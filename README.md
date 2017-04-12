# NodeJs Playground

This is a simple scaffolding project used to test libraries.

## What you can find here

### Libraries

- Rest services with [Express.js](http://expressjs.com/)
- Authentication with [Passport.js](http://passportjs.org/)
- MongoDb connection with [Mongoose](http://mongoosejs.com/)
- BCrypt with [bcrypt-nodejs](https://www.npmjs.com/package/bcrypt-nodejs)

### Features and implementations 

- Cors support
- Users collection CRUD with MongoDb persistence
- Access token in [jwt](https://jwt.io/) to handle basic authentication 
- Refresh token to create access token
 
### Related projects

- [Angular2 SPA Frontend](https://github.com/alessandrodeste/angular2-playground.git)
- [React SPA Frontend](https://github.com/alessandrodeste/react-playground)
- [Vue SPA Frontend](https://github.com/alessandrodeste/vue-playground)

## How to use

First install and configure mongodb.
If the mongodb is hosted outside (ex. [mlab](https://mlab.com/)) 
is possible to configure the URI and the db name in the files /src/env/development.js

Development on localhost or other development environment (ex. [c9](https://c9.io))

```bash
# Install packages
npm install

# Install mongo collection and default user
node ./src/setup_mongo.js

# Run application with nodemon
npm run dev
```

In production (ex. [heroku](https://www.heroku.com/)) the environment variables to use are:
- NODE_ENV
- IP
- PORT
- DB_NAME
- DB_URI
- JWT_SECRET

## What I'm working on and open points

- OAuth2 with google and passport.js
- Tests
- Yarn
- Remove use of mongoose default mpromise (is deprecated)
- how to improve token lifecycle? I don't like this result
- how is implemented mongoose id creation? See refresh token in signup.
- why signin debug log return 401 but the actual result is 200?
- find a non deprecated libraries for bcrypt

## Thank you

- [Stephen Grider](https://www.udemy.com/user/sgslo/) great Udemy courses
- [Passport flow overview](http://toon.io/understanding-passportjs-authentication-flow/) great guide
- [JWT](http://jwt.io/)
- [csrf and node](http://sporcic.org/2012/06/csrf-with-nodejs-and-express/)
- [Token!](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) great token example
- [More Tokens](https://blog.hyphe.me/using-refresh-tokens-for-permanent-user-sessions-in-node/)
- [More spanish refresh tokens docs](https://solidgeargroup.com/refresh-token-autenticacion-jwt-implementacion-nodejs?lang=es)