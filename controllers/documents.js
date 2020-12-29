const async = require('async');
const _ = require('underscore');
const config = require('../helpers/config')
const Helpers = require('../helpers/helper')
const college = require('../models/college');
const documents = require('../models/documents');
const multichain = require('../helpers/multichain')
const multichainCredential = config.credentials;

async function signup (req,res){
    // console.log('[success][admin][signup]: Request params --> ', req.body);
    if (!req.body.email) return res.send({statusCode:400,message:"Email Id is missing."});
    if (!req.body.auth_person_name) return res.send({statusCode:400,message:"authname is missing."});
    if (!req.body.insti_type) return res.send({statusCode:400,message:"Institute type is missing."});
    if (!req.body.insti_name) return res.send({statusCode:400,message:"Institute name is missing."});
    if (!req.body.accred_num) return res.send({statusCode:400,message:"Accre number  is missing."});
    req.body["cts"]=Helpers.dateSeconds();
    req.body["uts"]=Helpers.dateSeconds();
    req.body["sts"]="A"
     // console.log("req.body"+req.body);
    try{
      let password = Helpers.genratePassword();
      let hashPassword = await Helpers.hashPasswordfn(password);
      req.body["password"] = hashPassword;
      req.body["plainTextPass"] = password;
      console.log("req.body",req.body);
      req.body["chain_address"] = await multichain.getNewAddressandpermissionOnMultichain();
       console.log("req.body address",req.body);
      let mdata = await college.create(req.body);
      delete req.body.plainTextPass
      delete req.body.plainTextPass
      console.log("req.body"+req.body);
      let publish = await await multichainCredential.publishFrom({
                    from:config.adminAddress,
                    stream:"college",
                    key:req.body.chain_address,
                    data: {"json":req.body}
                  })
      // const output1 = require('../helpers/mailContent/approval_mail_with_password.js').approvalMailWithPassword(sendMailData);
      // var mailOptions = {
			// 			from: config.noreplyemail,
			// 			to: req.body.email,
			// 			subject: 'Your Account Details',
			// 			html: output1
			// 		};
      //
			// 		queueData = {
			// 			queue: Constant.mailQueue,
			// 			msg: mailOptions
			// 		}
      //
			// 		module.exports.sendToQueue(queueData)

      return res.send({statusCode:200,message:"Department has been Successfully registered."})
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


exports.signup=signup;
