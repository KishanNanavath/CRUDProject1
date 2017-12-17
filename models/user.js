/**
 * Created by Balkishan on 12/2/2017.
 */

// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String,
    address:String,
    mobile:Number,
    email:String,
    password: String
}));