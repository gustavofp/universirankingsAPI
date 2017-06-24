var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    birth_date: String,
    profile_picture: String,
});

module.exports = mongoose.model('User', UserSchema);
