
const express  = require('express');
const router   = express.Router();
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });


router.route('/logout').get(function(req, res) {
	// FIXME: token is still in memory... how can I revoke it?
	// TODO delete token
	// req.logout();
	res.status(200).json({message: "logged out"});
});

// Return the logged user
// TODO: refresh token?
router.route('/loggedin').get(requireAuth, function(req, res) {
	res.json({ 'user': req.user });
});

router.route('/signin').post(requireSignin, Authentication.signin);
router.route('/signup').post(Authentication.signup);


module.exports = router;