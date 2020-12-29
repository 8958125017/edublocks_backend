const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let department = new Schema({

    email: {type:String},
    password: {type:String},
    username : {type:String},
    opsType : {type:String},
    sts : {type:String},
    cts : {type:String},
    uts : {type:String},
    opsMode: { type : String},
    blockaddr : { type : String },
    pubBlockaddr : {type: String}

})

module.exports = mongoose.model('department',department);
