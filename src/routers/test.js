
const express  = require('express');
const router   = express.Router();

router.route('/').get(function(req, res) {
	console.log("ping");
	res.json({message: "pong"});
});
module.exports = router;