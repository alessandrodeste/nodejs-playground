const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const jwt = require('jwt-simple');
const config = require('../config');

// Constants
const SALT_WORK_FACTOR 	    = 10;
const MAX_LOGIN_ATTEMPTS    = 5;
const LOCK_TIME             = 2 * 60 * 60 * 1000;

//---------------------------
// Define our model
//---------------------------
const userSchema = new Schema({
	email: { type: String, lowercase: true, required: true, index: { unique: true } },
	username:  { type: String, required: true, index: { unique: true } }, 

	// Credentials
	local            : {
		email        : String,
		password     : String,
		token		 : String
	},
	
	google           : {
		id           : String,
		token        : String,
		email        : String,
		name         : String
	},

	// Security
	loginAttempts: { type: Number, required: true, default: 0 },
	lockUntil: { type: Number },
	role: { type: Number, default: 1 }, // 0: none, 1: disabled, 2: user, 5: admin, 10: su

	// Other informations
	first_name: String,
	family_name: String,

}, {
		collection: 'users'
});

//---------------------------
// enum: expose enum on the model, and provide an internal convenience reference 
//---------------------------
var reasons = userSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2
};

//---------------------------
// Pre-Save action (add salt in password)
//---------------------------
userSchema.pre('save', function(next) {
	const user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('local.password')) return next();

	// generate a salt then run callback
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) { return next(err); }

		// hash the password along with our new salt
		bcrypt.hash(user.local.password, salt, null, function(err, hash) {
			if (err) { return next(err); }

			// overwrite plain text password with encrypted password
			user.local.password = hash;
			next();
		});
	});
});

//---------------------------
// Property: isLocked (boolean)
//---------------------------
userSchema.virtual('isLocked').get(function() {
		// check for a future lockUntil timestamp
		return !!(this.lockUntil && this.lockUntil > Date.now());
});

//---------------------------
// Method: Compare password
//---------------------------
userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.local.password, function(err, isMatch) {
		if (err) { return callback(err); }
		callback(null, isMatch);
	});
}

//---------------------------
// Method: increment login attempts
//---------------------------
userSchema.methods.incLoginAttempts = function(cb) {
	// if we have a previous lock that has expired, restart at 1
	if (this.lockUntil && this.lockUntil < Date.now()) {
		return this.update({
			$set: { loginAttempts: 1 },
			$unset: { lockUntil: 1 }
		}, cb);
	}
	// otherwise we're incrementing
	var updates = { $inc: { loginAttempts: 1 } };
	// lock the account if we've reached max attempts and it's not locked already
	if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	}
	return this.update(updates, cb);
};

//---------------------------
// Authenticate user (local strategies) and increment login attempts
//---------------------------
userSchema.statics.getAuthenticated = function(email, password, cb) {
	this.findOne({ 'local.email': email }, function(err, user) {
		if (err) return cb(err);

		// make sure the user exists
		if (!user) {
			return cb(null, null, reasons.NOT_FOUND);
		}

		// check if the account is currently locked
		if (user.isLocked) {
			// just increment login attempts if account is already locked
			return user.incLoginAttempts(function(err) {
				if (err) return cb(err);
				return cb(null, null, reasons.MAX_ATTEMPTS);
			});
		}

		// test for a matching password
		user.comparePassword(password, function(err, isMatch) {
			if (err) return cb(err);

			// check if the password was a match
			if (isMatch) {
				
				// reset attempts and lock info and generate the refresh token
				const token = createToken(user);
				const updates = {
					$set: { loginAttempts: 0, 
							'local.token': token },
					$unset: { lockUntil: 1 }
				};
				return user.update(updates, function(err) {
					if (err) return cb(err);
					
					user.local.token = token;
					return cb(null, user);
				});
			}

			// password is incorrect, so increment login attempts before responding
			user.incLoginAttempts(function(err) {
				if (err) return cb(err);
				return cb(null, null, reasons.PASSWORD_INCORRECT);
			});
		});
	});
};

//------------------------------------------------------------------
// return cleanup user (no sensible information)
//------------------------------------------------------------------
userSchema.statics.filterOutputUser = function(user) {
	if ( user ) {
		return _.omit(user, ['local', 'google', 'loginAttempts']);		
	} else {
		return null;
	}
};

//------------------------------------------------------------------
// return new jwt token
//------------------------------------------------------------------
userSchema.statics.createToken = function(user) {
	return createToken(user);
};

function createToken(user) {
	return jwt.encode({ 
		sub: user._id, 
		iat: new Date().getTime()
	}, config.security.jwtSecret);
};

// Create the model class
module.exports = mongoose.model('user', userSchema);
