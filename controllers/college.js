const async = require('async');
const _ = require('underscore');
const config = require('../helpers/config')
const Helpers = require('../helpers/helper')
const college = require('../models/college');
const multichain = require('../helpers/multichain')
const constant = require('../helpers/constant');
const jwt = require('jsonwebtoken');
const saltRounds = 10
const bcrypt = require('bcrypt-nodejs');
const multichainCredential = config.credentials;



// Login Api start here
async function login (req, res) {
    console.log('[success][college][login]: Request params --> ', req.body);
    if (!req.body.email) return res.send(Message.error400('Email address missing'))
    if (!req.body.password) return res.send(Message.error400('Password is missing'))
    try{
      let user = await college.findOne({email:req.body.email});   
      if(user == null) return res.send({ statusCode: 404, message: "The email address that you've entered doesn't match any account" })
      bcrypt.compare(req.body.password, user.password, async function (err, match) {
        console.log("[success][college][login] : ", err, match)
        if (err)  return res.send({statusCode:500,message:"Something went wrong."});
        if (!match) return res.send({statusCode: 500,message: "The password that you've entered is incorrect."})
        return res.send({statusCode:200,message:"Login Successfully.",data:user});
      })
    }
    catch(err)
    {
      console.log('[error][college][login]: error --> ', err);
      return res.send({statusCode:500,message:"Something went wrong."});
    }
}

// Signup Api start here

async function signup (req,res){   
    if (!req.body.email) return res.send({statusCode:400,message:"Email Id is missing."});
    if (!req.body.auth_person_name) return res.send({statusCode:400,message:"authname is missing."});
    if (!req.body.insti_type) return res.send({statusCode:400,message:"Institute type is missing."});
    if (!req.body.insti_name) return res.send({statusCode:400,message:"Institute name is missing."});
    if (!req.body.accred_num) return res.send({statusCode:400,message:"Accrediation number  is missing."});
    if (!req.body.password) return res.send({statusCode:400,message:"password  is missing."});
    req.body["req_date"]=Helpers.dateSeconds();  
    req.body["sts"]="A"   
    try{
      // let password = Helpers.genratePassword();
       let password = req.body.password
      let hashPassword = await Helpers.hashPasswordfn(password);
      req.body["password"] = hashPassword;
      req.body["plainTextPass"] = password;
      console.log("req.body",req.body);
      req.body["chain_address"] = await multichain.getNewAddressandpermissionOnMultichain();       
      let mdata = await college.create(req.body);
      delete req.body.plainTextPass
      console.log("req.body"+req.body);
      let publish = await await multichainCredential.publishFrom({
                    from:config.adminAddress,
                    stream:"college",
                    key:req.body.chain_address,
                    data: {"json":req.body}
                  })     

      return res.send({statusCode:200,message:"Institute has been successfully registered."})
      console.log('[success][admin][signup]: Request blockaddr --> ',publish);
    }
    catch(err)
    {
      console.log('[error][admin][login]: error --> ', err);
      return res.send({statusCode:500,message:"Something went wrong."});
    }
 }
 
 async function getapi (req,res){
   try{
     let get = await college.find(req.body);
     return res.send({statusCode:200,message:"Data fetch Successfully.",data:get})
   }
   catch(err)
   {

   }

 }


exports.login=login;
exports.signup=signup;
