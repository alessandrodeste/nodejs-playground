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

## What I'm working on

- OAuth2 with google
- Tests
- Token keep alive lifecycle
- Yarn
- Token collection

## Thank you

- [Stephen Grider](https://www.udemy.com/user/sgslo/) great Udemy courses
- [Passport flow overview](http://toon.io/understanding-passportjs-authentication-flow/) great guide
- [Token!](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/) great token example
- [JWT](http://jwt.io/)
- [csrf and node](http://sporcic.org/2012/06/csrf-with-nodejs-and-express/)