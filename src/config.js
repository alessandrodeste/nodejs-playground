var config = {};
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  console.log('development config')
  config = require('./env/development');
  
} else if (env === 'production') {
  config = require('./env/production');
}

module.exports = config;