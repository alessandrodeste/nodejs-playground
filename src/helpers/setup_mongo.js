// code for initializing the DB w/ an admin user
const mongoose     = require('mongoose');

const setupMongo = {
    
    User: null,
    adminUser: null, 

    initialize: function(config) {
        setupMongo.baseUrl = config.mongo.dbUrl + '/databases/' + config.mongo.dbName + '/collections/';
        setupMongo.usersCollection = config.mongo.usersCollection;
        
        mongoose.connect('mongodb://' + config.mongo.dbUrl + '/' + config.mongo.dbName);
        setupMongo.User = require('../models/user');
        
        setupMongo.adminUser = new setupMongo.User({
            //setupMongo.adminUser.id = 'admin';
        	username: 'admin',
        	role: 10,
        	email: 'admin@test.com',
        	local: {email: 'admin@test.com', password: 'admin'}
        });
    },
  
    addAdminUser: function(done) {
        const query = setupMongo.User.findOne({username:'admin'}, function (err, person) {

            if (err) console.log("ERRORE:", err);
            if (!person) {
                console.log('Creating new Admin User');
                setupMongo.adminUser.save();
                console.log('Created new Admin User');
            } else {
                console.log('Admin User already present');
            }
            done();
        });
        
        
    },
       
};

module.exports = setupMongo;

