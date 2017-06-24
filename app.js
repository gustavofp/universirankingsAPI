const app = require('./config/app.config');
const db = require('./config/db.config');
const auth = require('./middlewares/auth');
const express = require('express');

const util = require('util');

const AuthService = require('./auth/authService')


app.post('/api/login', (req, res) => {
    AuthService.login(req, res, (callback) => {
        res.send(callback);
    });
});

app.post('/api/signup', (req, res) => {
    AuthService.signUp(req, res, (callback) => {
        res.send(callback);
    });
});


/*               
    ROTAS PROTEGIDAS PELO MIDDLEWARE AUTH
*/

const protectedApi = express.Router()
app.use('/api/content', protectedApi)
protectedApi.use(auth)

protectedApi.get('/', (req, res) => {
    console.log("opa")
});

