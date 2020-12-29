const mongoose = require('mongoose');
var _ = require('underscore');
const Schema = mongoose.Schema;
const constant = require('../helpers/constant')
const Helpers = require('../helpers/helper.js');

let entity = new Schema({
    _id: {type: String},
    id: {type:String},
    eclass: {type:String}, // PE or TM
    etype: {type:String}, // P - Private , G - Government , S - SEBI Approved , U - Public , O - Others
    etypeo :{type:String}, //  etype=O then etypeo=name of other entity type.
    name: {type:String, uppercase: true},
    //parent: req.body.parent,
    poi: {type: String, uppercase: true},    // PAN number
    cinNo: {type:String},
    doc: {type:Object},
    docHash: {type:String},
    currentAddress: {type:Object},
    perAddress: {type:Object},
    authPerson: {
        name:{type:String},
        designation:{type:String},
        mobNo:{type:String},
        email:{type:String, lowercase: true, trim: true}
    },
    ctgr: {type:String},
    appon : {type:String},  // Actual DLT registration date i.e. in sync with hyperledger
    apponsys: {type:String}, // Approved on our Client's portal.
    companyEmail: {type:String, lowercase: true, trim: true},
    cts: {type:String},
    uts : {type:String},
    expiryDate: {type: String},
    sts: {type:String},
    ismobNoValid: {type:Number, default: 0},
    isCompanyEmailValid: {type:Number, default: 0},
    isIPVerified: {type:Number, default: 0},
    mobToken: {type:Number},
    emailToken: {type:String},
    ip: {type:String},
    reqid: {type:String},
    isOverseaKey: {type:Boolean},
    svcprv:{type: String, default: constant.operatorQL},   //'AI','VO','ID','BL','ML','QL','TA','JI','VI','VM'
    remarks : {type:String},
    password : {type : String},
    authDocTM: {type: String},      // Authorization doc provided by PE to TM to act on its behalf.
    crtrTM: {type: String},         // TM ID of the telemarketer which is registering the PE.
    crtrTmName: {type: String},     // TM name of the telemarketer which is registering the PE.
    crtrFlag: {type: String},
    isExempted: {type: Boolean, default: false},
    isPayment: {type: Boolean, default: false},
    payementDetails : {type : String},
    exemptedRemarks :{type : String},
    exemptedDoc: {type: String},
    isNu: {type: Boolean, default: false},  // Status for neuron read. true: updated to neuron; false: not updated
    isDlt:{type:Boolean,default:false},
    isNewRegistration: {type: Boolean}, // Whether the registration is new or existing in DLT
    isdlr : {type:String},
    poiDoc: {                   // POI Details
        name: {type: String},
        url: {type: String}
    },
    poa: {
        name: {type: String},
        url: {type: String}
    },
    agreement: {
        name: {type: String},
        url: {type: String}
    },
    requested: [                // tmid when request made by PE and PEID when request made by TM
        {
            _id: {type: String, ref: 'entity'},
            name: {type: String},
            peApprovalDoc: {type: String},
            ts:{type:String},
            isdeclared:{type:Boolean,default:false}
        }
    ],
    pending: [ //TM--eid
        {
            _id: {type: String, ref: 'entity'},
            name: {type: String},
            peApprovalDoc:{type:String},
            ts:{type:String},
            isdeclared:{type:Boolean,default:false}
        }
    ],
    approved: [
        {
            _id: {type: String, ref: 'entity'},
            name: {type: String},
            peApprovalDoc: {type: String},
            ts:{type:String},
            isdeclared:{type:Boolean,default:false}
        }
    ],
    rejected: [
        {
            _id: {type: String, ref: 'entity'},
            name: {type: String},
            peApprovalDoc: {type: String},
            remarks: {type: String},
            ts:{type:String},
            isdeclared:{type:Boolean,default:false}
        }
    ],
    revoked: [
        {
            _id: {type: String, ref: 'entity'},
            name: {type: String},
            peApprovalDoc: {type: String},
            requesteeType: {type : String},
            requesteeId: {type : String},
            remarks: {type: String},
            ts:{type:String},
            isdeclared:{type:Boolean,default:false}
        }
    ],
    otherDocs:[
      {
        name:{type:String},
        url:{type:String},
        uplodedBy:{type:String},
        ts:{type:String,default:Math.floor(Date.now() / 1000).toString()}
      }
    ],
    interimSts : {type : String}
})

module.exports = mongoose.model('entity',entity);




entity.pre('save', function(next){
    var user = this ;
	console.log("RTM=============",require('./rtm.js'));
	require('./rtm.js').find({$or:[{companyEmail: user.companyEmail}, {orgName: user.orgName},{panNo:user.panNo}]},
    function(error, rtmdata){
        console.log('RTMDATA========================>',rtmdata);
        if(error)
            return next(error);
        else
        mongoose.model('entity',entity).find({$or:[{companyEmail: user.companyEmail}, {orgName: user.orgName},{panNo:user.panNo}]},
                function(err, users){
        if(err) {
            return next(err);
        } else if(users) {
            console.log('User:::',users);
            if (_.find(users , {panNo:user.panNo})||_.find(rtmdata , {panNo:user.panNo})) {
            user.invalidate('Pan', 'Organization with this panNo is registered.');
                    console.log('Organization with this panNo is registered.');
            next( new Error("Organization with this panNo is registered."));
            }
            else if (_.find(users , {orgName: user.orgName})||_.find(rtmdata , {orgName: user.orgName})){
            user.invalidate('organization name', 'Organization with this name is registered.');
                    console.log('Organization with this name is registered.');
            next( new Error("Organization with this name is registered."));
            }
            else if(_.find(users,{companyEmail: user.companyEmail})||_.find(rtmdata , {companyEmail: user.companyEmail}))
            {
            user.invalidate('Email', 'Email is already in used.');
                    console.log('Email is already used');
            next( new Error("Email is already in used."));
            }
                else next();
        }
        })
    })
})

module.exports = mongoose.model('entity',entity);
