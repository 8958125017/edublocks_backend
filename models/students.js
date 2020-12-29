const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let students = new Schema({
    stud_id            : { type : String},
    stud_name          : { type : String},     
    insti_id           : { type : String, /*required: true*/},        
    date_of_reg        : { type : Date},
    status             : { type : Boolean}
})

module.exports = mongoose.model('students',students);
