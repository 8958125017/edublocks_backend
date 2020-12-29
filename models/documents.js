const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let documents= new Schema({
    doc_id            : { type : String},
    insti_id          : { type : String},     
    folder_name       : { type : String, /*required: true*/},        
    doc_name          : { type : String},
    doc_type          : { type : String, unique: true , required :true }, 
    status            : { type : String},
    doc_qr            : { type : String },
    doc_data          : { type : String},
    date_of_upload    : { type : Date},
    stud_id           : { type : String},    
    chain_address     : { type : String },

})

module.exports = mongoose.model('documents',documents);
