const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let URL = new Schema({
    shortURL: {
        type: String,
    },
    longURL: {
        type: String
    }}, {
        collection: 'tblURLS'
    });

module.exports = mongoose.model('', URL);
