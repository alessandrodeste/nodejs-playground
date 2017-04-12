# NodeJs Playground

This is a simple scaffolding project used to test libraries.

## What you can find here

- Express implementation for rest services
- Simple Passport usage for local signage
- Cors support
- Users collection CRUD with MongoDb persistence
- [Angular2 SPA Frontend](https://github.com/alessandrodeste/angular2-playground.git)
- [React SPA Frontend](https://github.com/alessandrodeste/react-playground)
- [Vue SPA Frontend](https://github.com/alessandrodeste/vue-playground)
- JWT, Access token and Refresh token

## How to use

Install packages

```bash
npm install
```

Copy and edit configuration file

```bash
cp ./src/config.tpl.js ./src/config.js
```

Install mongo collection and default user

```bash
node ./src/setup_mongo.js
```

Run application with nodemon

```bash
npm run dev
```

## What I'm working on and open points

- OAuth2 with google
- Tests
- Yarn
- Remove use of mongoose default mpromise (is deprecated)
- how to improve token lifecycle? I don't like this result
- how is implemented mongoose id creation? See refresh token in signup.
- why signin debug log return 401 but the actual result is 200?

## Thank you

- [Stephen Grider](https://www.udemy.com/user/sgslo/) great Udemy courses
- [Passport flow overview](http://toon.io/understanding-passportjs-authentication-flow/) great guide
- [JWT](http://jwt.io/)
- [csrf and node](http://sporcic.org/2012/06/csrf-with-nodejs-and-express/)
- [Token!](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) great token example
- [More Tokens](https://blog.hyphe.me/using-refresh-tokens-for-permanent-user-sessions-in-node/)
- [More spanish refresh tokens docs](https://solidgeargroup.com/refresh-token-autenticacion-jwt-implementacion-nodejs?lang=es)