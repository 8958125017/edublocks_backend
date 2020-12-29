const mongoUrl = 'mongodb://penny:boostersA123@49.50.67.44:27017/Edublocks?authSource=admin'; 	// Mongo DB URL for Node maintained data
const host='http://49.50.67.44';				// URL for Angular code (Entity) [RedirectURL]
const port='2015';
// const writeFilepath='/var/www/html/nitin/'								// Port on which Node instance is running
const credentials = require("multichain-node")({
  port: '9251',
  host: '49.50.67.44',
  user: "multichainrpc",
  pass: "3a6ykGHVUd8vTMKH1SXniHA4asMhKgkHP1oAp6o9Ljg4"
});
 const adminAddress = '1L9MRFsoAUfKTW5Ug5sMPgPsAAjuDxTrKU9eUz';

module.exports = {
	mongoUrl: mongoUrl,
	host: host,
	port: port,
	credentials:credentials,
	// writeFilepath:writeFilepath,
	adminAddress:adminAddress
}
