const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify this email and password, call done with the user
	// if it is the correct email and password
	// otherwise, call done with false
	User.getAuthenticated(email, password, function(err, user, reason) {
			
		if (err) { return done(err); }

		// login was successful if we have a user
		if (user) { return done(null, user); }

		// otherwise we can determine why we failed
		var reasons = User.failedLogin;
		switch (reason) {
			case reasons.MAX_ATTEMPTS:
				// send email or otherwise notify user that account is
				// temporarily locked
				return done(null, false, { message: 'User blocked', code: 'USER_BLOCK' });
			default:
			case reasons.NOT_FOUND:
			case reasons.PASSWORD_INCORRECT:
				// note: these cases are usually treated the same - don't tell
				// the user *why* the login failed, only that it did
				return done(null, false, { message: 'Check user and password', code: 'WRONG_CREDENTIALS' });
		}
	});  
});

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.security.jwtSecret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// See if the user ID in the payload exists in our database
	// If it does, call 'done' with that other
	// otherwise, call done without a user object
	User.findById(payload.sub, function(err, user) {
		if (err) { return done(err, false); }

		if (user) {  
			
			// Jwt will last 1h
			var today = new Date;
			
			// Check if is expired (5 min)
			if (payload.iat <= today.setMinutes(today.getMinutes() - 5)) {
				return done(null, false, { message: "Expired Token", code: 'TOKEN_EXPIRED' });
			} else {
				return done(null, user);
			} 
		} else {
			return done(null, false);
		}
	});
});


// Tell passport to use this strategy
passport.use(localLogin);
passport.use(jwtLogin);
