const mongoose = require('mongoose');

const urlString = 'mongodb://localhost/API';

mongoose.connect(urlString, (err, res) => {
    let str;

    err ? str = "Não foi possível conectar ao mongoDB" : str = "Conexão iniciada"

    console.log(str)
});