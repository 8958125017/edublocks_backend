var async = require('async');
var fs = require('fs');
const Config = require('../helpers/config')
let multichain = Config.credentials;
var publishDataOnMultichain = async (publishData )=>{
  return new Promise( async (resolve, reject)=>{
    try{
      let publish = await multichain.publishFrom({
              from: publishData.address,
              stream: publishData.streamName,
              key: publishData.key,
              data: publishData.data
          });
          resolve(publish);
    }
    catch(err){
      reject(false);
    }
  })

        // multichain.publishFrom({
        //         from: publishData.address,
        //         stream: publishData.streamName,
        //         key: publishData.key,
        //         data: publishData.data
        //     },
        //     (err, result) => {
        //       console.log("data-----------",err,result)
        //         if (err) {
        //           //return err;
        //             //console.log("error" + JSON.stringify(err));
        //             callback(err);
        //         }
        //         //return result;
        //         //console.log('callback come::', result, err);
        //        callback(result);
        //         // return res.send({status : 200, message : "Data has been saved!", result : result});
        //     });
}
var listStreamsKeyItem = (data,callback)=>{
  console.log("fundata",data);
    multichain.listStreamKeyItems({
      stream: data.stream,
      key:data.key,
      count: 20
        },
        (err, result) => {

        if(err) callback(err);
          else if(result.length){
            var resultLength = result[result.length-1].data;
            var success = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
            return callback(success);
          }else{
            return callback(null);
          }
        })
}
var listStreamsItem = (data,callback)=>{
  console.log("fundata",data);
    multichain.listStreamItems({
      stream: data.stream,
      count: 20
        },
        (err, result) => {
        if (err) callback(null)
        else {
          if(result.length){
            var resultLength = result[result.length-1].data;
            var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
            callback(result);
          }else{
            callback(null)
          }
}
})
}


// var getNewAddressandpermissionOnMultichain = async ()=>{
//   return new Promise( async (resolve, reject)=>{

//      try{
//       let address = await multichain.getNewAddress().then(add => {
//         var permissions = ['send', 'receive', 'connect', 'activate', 'issue', 'create'];
//         async.each(permissions,async (element,cb)=>{
//           console.log("element",element, address);
//           let grant = await multichain.grant({
//               'addresses': add,
//               'permissions': element
//           })
//         },(err)=>{
//           if(err) return reject(false);
//           else return resolve(add);
//         })
//       });
      
      
//      }
//     catch(err)
//     {
//        console.log("address",err);
//       reject(false);
//     }
//   })
// }


var getNewAddressandpermissionOnMultichain = async ()=>{
  return new Promise( async (resolve, reject)=>{
    try{
      let address = await multichain.getNewAddress();
      console.log("address test ==-=-=-=-",address)
      var permissions = ['send', 'receive', 'connect', 'activate', 'issue', 'create'];
      async.each(permissions,async (element,cb)=>{
        console.log("element",element);
        let grant = await multichain.grant({
            'addresses': address,
            'permissions': element
        })
      },(err)=>{
        if(err) return reject(false);
        else return resolve(address);
      })
    }
    catch(err)
    {
      reject(false);
    }
  })
}

exports.publishDataOnMultichain=publishDataOnMultichain;
exports.listStreamsKeyItem=listStreamsKeyItem;
exports.listStreamsItem=listStreamsItem;
exports.getNewAddressandpermissionOnMultichain=getNewAddressandpermissionOnMultichain;
