const async = require('async');
const _ = require('underscore');
const config = require('../helpers/config')
const Helpers = require('../helpers/helper')
const department = require('../models/department');
const dashboarddatadetails = require('../models/dashboarddatadetails');
const multichain = require('../helpers/multichain')
const multichainCredential = config.credentials;
const nodemailer = require('nodemailer');

async function signup (req,res){
    console.log('[success][admin][signup]: Request params --> ', req.body);
    if (!req.body.email) return res.send({statusCode:400,message:"Email Id is missing."});
    if (!req.body.username) return res.send({statusCode:400,message:"username is missing."});
    if (!req.body.opsType) return res.send({statusCode:400,message:"Operation type is missing."});
    if (!req.body.opsMode) return res.send({statusCode:400,message:"Operation mode is missing."});
    if (!req.body.pubBlockaddr) return res.send({statusCode:400,message:"Publisher block address is missing."});
    req.body["cts"]=Helpers.dateSeconds();
    req.body["uts"]=Helpers.dateSeconds();
    req.body["sts"]="A"
    try{
      let password = Helpers.genratePassword();
      let hashPassword = await Helpers.hashPasswordfn(password);
      req.body["password"] = hashPassword;
      req.body["plainTextPass"] = password;
      req.body["blockaddr"] = await multichain.getNewAddressandpermissionOnMultichain();
      let mdata = await department.create(req.body);
      delete req.body.plainTextPass
      delete req.body.plainTextPass
      let publish = await await multichainCredential.publishFrom({
                    from:config.adminAddress,
                    stream:"department",
                    key:req.body.blockaddr,
                    data: {"json":req.body}
                  })
      
     
      // const output1 = require('../helpers/mailContent/approval_mail_with_password.js').approvalMailWithPassword(sendMailData);
      // var mailOptions = {
// from: config.noreplyemail,
// to: req.body.email,
// subject: 'Your Account Details',
// html: output1
// };
      //
// queueData = {
// queue: Constant.mailQueue,
// msg: mailOptions
// }
      //
// module.exports.sendToQueue(queueData)

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
     let get = await department.find(req.body);
   
     return res.send({statusCode:200,message:"Data fetch Successfully.",data:get})
   }
   catch(err)
   {

   }

}


async function dashboarddata(req, res, next) {
    console.log("============== upload the data ============ \n\n", req);
    if (!req.body.docporse) return  res.send({statusCode:400,message:"docporse is missing."});
    if (!req.files.doc) return  res.send({statusCode:400,message:"doc is missing."});
    if (!req.body.docdata) return res.send({statusCode:400,message:"docdata is missing."});
    if (!req.body.studentName) return res.send({statusCode:400,message:"studentName is missing."});

    console.log("req.body = = 1"+req.body);
    if (!req.body.stud_roll_no) return  res.send({statusCode:400,message:"studroll_no missing."});
   
    console.log("req.body = = 2"+req.body.doc);
    let docpath="./doc/"+req.files.doc.name
    req.files.doc.mv(docpath,(err)=>{
      console.log("===",err)
    });
    req.body['doc']=docpath;
      req.body["req_date"]=Helpers.dateSeconds();  
    console.log("req.body = = 3"+req.body);
    var  instid = Math.floor((Math.random() * 10000000000000000000) + 1);
    req.body.instid = instid;
    console.log("req.body = = "+req.body);
    let mdata = await dashboarddatadetails.create(req.body)
        .then((Data) => {
            if (Data) {

            
                console.log('=============== stud_roll_No rigestered Scuussffly ===============');
                return res.send({statusCode:200,message:"stud_roll_No Scuussffly rigestered exists."});
            }
            else {
                //check Distributor doesn't exixts
                models.dashboarddatadetails.findOne({ stud_roll_no: req.body.stud_roll_no })
                    .then((Data) => {
                        if (Data) {
                            console.log('=============== stud_roll_No  already exists ===============');
                            return res.send({statusCode:400,message:"stud_roll_No  already exists."});
                        }
                        else {
                            console.log('===============Adding a new stud_roll_No  process start ===============\n\n', req.body);
                          
                            //Generate randomstring length:6 for password
                          
                            //for Encrypt password
                          
                            //genrate productId
                            // Helpers.generateId({
                               
                            // }, (callback) => {
                               
                            // })

                           
                            // //Timestamps
                            // req.body.cts = Helpers.dateSeconds();
                            // req.body.uts = Helpers.dateSeconds()
                            //Generate randomstring length:6 for login ID
                     
                            //Insert in Database
                          
                             
                              //  .catch(failed => {
                              //       console.log("======================= stud_roll_No  create() not working =======================\n", failed)
                              //       return  res.send({statusCode:500,message:"Something went wrong."});
                              //   })
                        }
                    })
                    .catch((e) => {
                        console.log('=========================stud_roll_No does not rigestered error =============================', e);
                        return  res.send({statusCode:500,message:"your All id exist."});;
                    });
            }
        })
        .catch((e) => {
            console.log('=========================stud_roll_No   id error =============================', e);
            return  res.send({statusCode:500,message:"Something went wrong."});
        });

       
    }
    async function getdatadashbord(req, res,next) {
      
      let mdata = await dashboarddatadetails.find({ })
      .then(async (success) => {
        return res.send({
          message: 'Data Found',
          statusCode: 200,
          result: success
        })
      })
      .catch(unsuccess => {
        console.log("error ", unsuccess)
          return res.send({
            message: 'Data not found.',
            statusCode: 400,
          })
      })
         }
       



         async function studentdetails(req, res,next) {
          console.log("req.body.instid = = "+req.body.instid);
          let mdata = await dashboarddatadetails.find({instid: req.body.instid} )
          .then(async (success) => {
            return res.send({
              message: 'Data Found',
              statusCode: 200,
              result: success
            })
          })
          .catch(unsuccess => {
            console.log("error ", unsuccess)
              return res.send({
                message: 'Data not found.',
                statusCode: 400,
              })
          })
             }
           
async function shareEmail (receiver, req, res){
    console.log("2222222222222222222222222222222",receiver, req.body)
            new Promise(function(resolve, reject) {
                console.log("1111")
              
               var transporter = nodemailer.createTransport({
                    service: 'gmail',
                       auth: {
                    user: 'qtlmailer@gmail.com',
                      pass: 'boostersA123'
  }
                });
                var helperOptions = {
                    from: 'qtlmailer@gmail.com',
                    to: receiver.toString(),
                    subject: 'Student Details of Blockchain',
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">

  
    <body>
    <h2>Dear Requestor </h2>
    <p>please find the detalis of student. <br>Universty/ school name dav school</p>
   <hr>
   <h5>here <br>
   Link:<a href="#">click here</a>
    <br>
    Thanks <br>
    Team Edublock></h5>'
    </body>
    </html>`

                };
                transporter.sendMail( helperOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
            })

        }
exports.shareEmail=shareEmail;
exports.studentdetails=studentdetails
exports.getdatadashbord=getdatadashbord;
exports.signup=signup;
exports.dashboarddata =dashboarddata