
module.exports = {  
	mongo: {
		dbName: process.env.DB_NAME,                    // The name of database that contains the security information
		usersCollection: 'users',                       // The name of the collection contains user information    
		dbUrl: process.env.DB_URI                       // The base url of the MongoDB Server
	},
	server: {
		listenPort: process.env.PORT || 3000,           // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
		securePort: 8433,                               // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
		ip: process.env.IP || "0.0.0.0"
	},
	security: {
		jwtSecret: 'jwt-secret-test'
	}
};