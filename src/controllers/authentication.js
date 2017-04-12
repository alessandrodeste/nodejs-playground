const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');
const passport = require('passport');

exports.signin = function(req, res, next) {
	// User has already had their email and password auth'd
	// We just need to give them a token and the refresh token
	res.status(200).send({ 
		token: User.createToken(req.user), 
		refreshToken: req.user.local.token 
	});
}

exports.loggedin = function(req, res, next) {
	res.json({ 'user': User.filterOutputUser(req.user.toObject()) });
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password'});
	}

	// See if a user with the given email exists
	User.findOne({ email: email }, function(err, existingUser) {
		if (err) { return next(err); }

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use' });
		}

		// If a user with email does NOT exist, create and save user record
		const user = new User({
			role: 2,
			email: email,
			username: email,
			'local.email': email,
			'local.password': password
		});

		// NOTE: I'm not sure about this. Should be MongoDb to create the uniqueId, not mongoose client side. 
		// How this even works?
		user.local.token = User.createToken(user);
		
		user.save(function(err) {
			if (err) { return next(err); }

			// Repond to request indicating the user was created
			res.json({ token: User.createToken(user), refreshToken: user.local.token });
		});
	});
}

exports.refreshToken = function(req, res, next) {
	return validateRefreshToken(req.body.token, function (value) {
		if (typeof(value) === "string") {
			res.status(401).send();
		} else {
			res.send({ token: User.createToken(value) });	
		}
	});
}

// Remove the refresh token
// this action is possibile with a valid access token.
// I'm not happy with this solution, it needs an improvment.
exports.rejectToken = function(req, res, next) {
	const updates = {
		$unset: { 'local.token': 1 }
	};
	return req.user.update(updates, function(err) {
		if (err) return next(err);
		
		res.status(204).send('No data');
	});
}

exports.Roles = {
	NONE: 0,
	DISABLED: 1,
	USER: 2,
	ADMIN: 5,
	SU: 10
}

exports.checkRoleOrItsMe = function(role) {
	return function(req, res, next) {
		if (req.user 
				&& (req.user.id === req.params.user_id 
				|| req.user.role >= role))
			next();
		else 
			res.status(401).send('Unauthorized');
	};
};

exports.checkRole = function(role) {
	return function(req, res, next) {
		if (req.user && req.user.role >= role)
			next();
		else
			res.status(401).send('Unauthorized');
	};
};

exports.passport = function(type) {
	return (req, res, next) => {
	    passport.authenticate(type, (err, user, info) => {
	    	if (err) return next(err);
	        if (!user) {
	        	if (info)
	        		return res.status(401).json( { error: info } );
	        	else 
	        		return res.status(401).json( { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } } );
	        }
	        
	        req.user = user;
	        return next();
	    })(req, res, next);
	};
}

// A refresh token is valid if is associated to the user and is not expired
//
const validateRefreshToken = function(token, callback) {
	var payload = "";
	try {
		payload = jwt.decode(token, config.security.jwtSecret);
	} catch (err) {
		callback('Invalid token');
		return Promise.resolve();
	}
	
	// check if the refersh token exist and is associated with the correct user
	var query = User.findOne({ '_id': payload.sub, 'local.token': token })
	var promise = query.exec();
	
	promise.then(function(user) {
		if (user) {      
			// Jwt will last 1h
			var today = new Date;
			
			// is an access token
			if (payload.iat <= today.setMonth(today.getMonth() - 1)) {
				callback('Expired Token');
			} else {
				callback(user);
			} 
		} else {
			callback('User not find');
		}
	});
	
	return promise;
};