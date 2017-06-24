const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = module.exports = express();

const port = "8080"

app.listen(port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

