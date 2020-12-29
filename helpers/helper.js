const bcrypt = require('bcrypt-nodejs')
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var Buffer = require('buffer');
var path = require('path');
var fs = require('fs');

//models

module.exports = {
  dateSeconds: (date)=>{
  		if (date)
  			return Math.floor(date / 1000).toString()
  		else
  			return Math.floor(Date.now() / 1000).toString()
  	},
    genratePassword:()=>{
      var password = '';
  		var otppossible = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  		for (var i = 0; i < 8; i++) {
  			password += otppossible.charAt(Math.floor(Math.random() * otppossible.length));
  		};
      return password;
    },
    hashPasswordfn: (password) => {
    return new Promise( async (resolve, reject)=>{
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, null, async function (err, hash) {
          if (err) reject(false);
          resolve(hash);
          })
      })
    })
	},

}

// function verifyJWTToken(req, res, next) {
//    //Get auth header value
//    const bearerHeader = req.headers['authorization'];
//    //check if bearer is undefined
//    if (typeof bearerHeader !== 'undefined') {
//        //split at the space
//        const bearer = bearerHeader.split(' ');
//        // Get token from array
//        const bearerToken = bearer[0];
//        // Set the token
//        req.token = bearerToken;
//        jwt.verify(req.token, 'secretkey', (err, authData) => {
//            if (err) {
//                return res.send(Error401);
//            } else {
//                console.log("=========================Verify JWT Token=========================");
//                return next();
//            }
//        });
//        // call next middleware
//        //next();
//    } else {
//        // Forbidden
//        return res.send(Error401);

//    }
// }


function generateId(data, callback) {
  console.log("=========", data);
  let code;
  if (data.request == "M") code = "01"
  if (data.request == "P") code = "02"
  if (data.request == "D") code = "03"
  if (data.request == "R") code = "04"
  if (data.request == "U") code = "05"
  if (data.request == "W") code = "06"
  if (data.request == "MN") code = "07"

  if (data.request == "m") code = "08"
  if (data.request == "PU") code = "09"
 


  start = "15"  //start unquie id with 15
  uid = ""
  var uidPossible = "1234567890";
  for (var i = 0; i < 2; i++) {
      uid += uidPossible.charAt(Math.floor(Math.random() * uidPossible.length));
  };
  var token = start + code + Date.now() + uid
  callback(token);
}
exports.generateId=generateId;
