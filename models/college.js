const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let college = new Schema({
    insti_id            : { type : String},
    insti_name          : { type : String},     
    auth_person_name    : { type : String, /*required: true*/},        
    insti_type          : { type: String,
                            enum: ['School','University',],
                            default:'School'
                          },
     email               : { type : String, unique: true , required :true }, 
     insti_address       : { type : String},
     accred_from         : { type : String },
     mob_num             : { type : String },
     phone_num           : { type : String },
     // commence_date       : { type : Date},
     req_date            : { type : Date},
     // reg_date            : { type : Date},
     accred_num          : { type : Number, unique: true , required :true }, 
     sts                 : { type : String}, 
     isDeemed            :{ type: Boolean,
                            enum: [true,false],
                            default:false
                          },  
     // University          : { type : String },
     country             : { type : String },
     username            : { type : String },
     password            : { type : String },
     chain_address       : { type : String },

})

module.exports = mongoose.model('college',college);
