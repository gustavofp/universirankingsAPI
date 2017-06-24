const express = require('express')
const auth = require('./middlewares/auth')

module.exports = function (server) {

    /*
    * Rotas protegidas por Token JWT
    */

    //configura rotas protegidas para usarem o middleware auth
    const protectedApi = express.Router()
    server.use('/api', protectedApi)
    protectedApi.use(auth)

    /*
    * Rotas abertas
    */

    const openApi = express.Router()
    server.use('/oapi', openApi)

    const AuthService = require('./auth/authService')

    openApi.post('/login', AuthService.login(() => {
        console.log('hey');
    }))
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
}

