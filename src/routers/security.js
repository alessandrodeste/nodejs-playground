
const express  = require('express');
const router   = express.Router();
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


router.route('/logout').get(function(req, res) {
	// FIXME: token is still in memory... how can I revoke it?
	req.logout();
	res.send(200);
});

// Ping if is logged in
router.route('/loggedin').get(function(req, res) {
	//res.send(req.isAuthenticated() ? { 'user': req.user } : '0');
});

router.route('/signin').post(requireSignin, Authentication.signin);
router.route('/signup').post(Authentication.signup);


module.exports = router;