const express = require('express'); 
const router = express.Router();
const Authentication = require('../controllers/authentication');
const User = require('../models/user.js');
const _ = require('lodash');
const itemPerPage = 10;
const maxItemPerPage = 50;

router.route('/')
	.get(Authentication.checkRole(Authentication.Roles.USER), function(req, res) {
		
		var orderBy = req.query.orderby ? req.query.orderby : 'email';
		var query = User.find({ $or: [ { '_id': req.user.id }, { 'role': { $lt: req.user.role } } ] }).sort([[orderBy, 'asc']]);
		
		if (req.query.offset !== undefined) {
			query = query.skip(parseInt(req.query.offset)).limit(itemPerPage);
		} else {
			query = query.limit(maxItemPerPage);
		}
		
		query.exec(function(err, users) {
			if (err) res.status(500).json({ message: err.message });
			else {
				const list = _.map(users, 
					function(user) {
						return User.filterOutputUser(user.toObject());
					});
				
				if (list.length < 1)
					res.status(204).json({ message: "no content" });
				else
					res.json(list);
			}
		});
	})

	.post(Authentication.checkRole(Authentication.Roles.ADMIN), function(req, res) {
		const user = new User({
			role: 1,
			email: req.body.email,
			username: req.body.email,
			first_name: req.body.first_name,
			family_name: req.body.family_name, 
			'local.email': req.body.email,
			'local.password': req.body.password
		});
		user.save(function(err) {
			if (err) 
				res.status(422).json({ message: "email duplicated" });
			else 
				res.status(201).json({ message: 'user created' });
		});
	});

router.route('/:user_id')

	.get(Authentication.checkRoleOrItsMe(Authentication.Roles.ADMIN), function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) 
				res.status(500).json({ message: err.message });
			else if (user.role >= req.user.role && user.id !== req.user.id) 
				res.status(204).json({ message: 'user not found' });
			else
				res.json(User.filterOutputUser(user.toObject()));
			});
	})
		
	.put(Authentication.checkRoleOrItsMe(Authentication.Roles.ADMIN), function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) { 
				return res.status(500).json({ message: err.message }); 
			}
			if (user.role >= req.user.role && user.id !== req.user.id) { 
				return res.status(401).json({ message: 'Unauthorized' }); 
			}
			if (req.body['role'] && (req.body['role'] + 0) >= req.user.role){ 
				return res.status(401).json({ message: 'Unauthorized' }); 
			}

			const check = function(fieldName) {
				if (req.body[fieldName] !== undefined)
					user[fieldName] = req.body[fieldName];
			};

			check("username");
			check("first_name");
			check("family_name");
			check("password");
			check("role");
			if (req.body.password !== undefined) user.local.password = req.body.password;
			
			user.save(function(err) {
				if (err) 
					res.status(500).json({ message: err.message });
				else 
					res.json({ message: 'user updated' });
			});
		});
	})
	
	.delete(Authentication.checkRoleOrItsMe(Authentication.Roles.ADMIN), function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, task) {
			if (err) 
				res.status(500).json({ message: err.message });
			else 
				res.json({ message: 'Successfully deleted' });
		});
	});

module.exports = router;