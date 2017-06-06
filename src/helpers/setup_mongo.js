// code for initializing the DB w/ an admin user
const mongoose = require('mongoose');

const setupMongo = {
    
    User: null,
    adminUser: null, 

    initialize: function(config) {
        mongoose.connect('mongodb://' + config.mongo.dbUrl + '/' + config.mongo.dbName);
        setupMongo.User = require('../models/user');
        
        setupMongo.adminUser = new setupMongo.User({
        	username: 'admin',
        	role: 10,
        	email: 'admin@test.com',
        	local: {email: 'admin@test.com', password: 'admin'}
        });
    },
  
    addAdminUser: function(done) {
        const query = setupMongo.User.findOne({username:'admin'}, function (err, person) {

            if (err) {
                console.log("ERRORE:", err);
                done();
            }
            if (!person) {
                console.log('Creating new Admin User');
                setupMongo.adminUser.save().then(function(err) {
                    if (err) 
                       console.log(err.message);
                    else 
                        console.log('Created new Admin User');
                    done();
                });
                console.log('Waiting new Admin User');
            } else {
                console.log('Admin User already installed');
                done();
            }            
        });
    },
};

module.exports = setupMongo;

