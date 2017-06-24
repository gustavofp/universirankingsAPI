const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../user/user')
const env = require('../.env')

//Regex pata validação de email
const emailRegex = /\S+@\S+\.\S+/

//método que retorna erros do Mongo nas Responses
const sendErrorsFromDB = (res, dbErrors, next) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return next({status: 400, errors})
}


const login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    //procura usuário pelo email
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err, next)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            //se encontrar o user, e ele estiver com a senha correta gera um token e manda de volta na Response
            const token = jwt.sign(user, env.authSecret, {
                expiresIn: "1 day"
            })
            next({ user, token })
        } else {
            return next({ status:400, errors: ['Usuário/Senha inválidos'] })
        }
    })

}

// valida token, se expirado retorna Response com o erro
const validateToken = (req, res, next) => {

    const token = req.body.token || '';

    jwt.verify(token, env.authSecret, function(err, decoded) {
        return next({status: 200, valid: !err})
    })

}

const signUp = (req, res, next) => {

    console.log(req.body)

    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''
    const birth_date = req.body.birth_date || ''
    const profile_picture = req.body.profile_picture || '/assets/images/profile-default.png'


    //validações de email com Regex
    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informa está inválido'] })
    }

    //cria hash da senha
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)

    //compara campo senha com confirmação de senha
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }


    //procura usuário pelo email para verificar se já está cadastrado
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            //caso não retorne erro, nem outro usuário com o mesmo email, cadastra o novo user
            const newUser = new User({ email, password: passwordHash, name, birth_date, profile_picture })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    //cria o usuário e faz o login
                    login(req, res, next)
                }
            })
        }
    });

}

module.exports = { login, signUp, validateToken };