const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let dashboarddatadetails = new Schema({
    doc  : { type : String},
    docporse  : { type : Array},     
    docdata : { type : String},        
    stud_roll_no : { type: Number,},
    req_date:{type:String} ,            
    docpath:{type:String} ,               
    instid :  { type : String},
    studentName :  { type : String}, 
    instiaddress: { type : String},
    req_date: {type:String},

  

})

module.exports = mongoose.model('dashboarddatadetails',dashboarddatadetails);