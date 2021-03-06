
// To db setup:
// node setup_mongo.js

const config       = require('./config');
const initDB       = require('./helpers/setup_mongo');

console.log('************** START');

const totItems = 1;
var resolved = 0;
const subTaskEnded = function() {
    resolved++;
    if (resolved >= totItems) {
        console.log('************** END');
        process.exit(0);
    }
};

initDB.initialize(config);
initDB.addAdminUser(function() {
    subTaskEnded();
});

