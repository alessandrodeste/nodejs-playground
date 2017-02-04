// Starting point

// Requires
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Load configuration
const config = require('./config');

// Configure routing
const router = require('./routers/index');

// DB Setup
mongoose.connect('mongodb://' + config.mongo.dbUrl + '/' + config.mongo.dbName); 

// App Setup
app.use(morgan('dev'));                             // log every request to the console
app.use(cors());                                    // enable CORS for all domains
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Start server
const server = http.createServer(app);
server.listen(config.server.listenPort, config.server.ip);
console.log('Server listening on: ' + config.server.ip + ":" + config.server.listenPort);
