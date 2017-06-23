// [START get_service_account_tokens]
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");
var credential = admin.credential.cert(serviceAccount);

var accessTokenInfo = credential.getAccessToken();
var accessToken = accessTokenInfo.access_token;
var expirationTime = accessTokenInfo.expires_in;
// Attach accessToken to HTTPS request in the "Authorization: Bearer" header
// After expirationTime, you must generate a new access token
// [END get_service_account_tokens]

console.log("The token " + accessToken + " expires in " + expirationTime);
