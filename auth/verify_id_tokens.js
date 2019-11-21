'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

// [START verify_id_token]
// idToken comes from the client app
admin
  .auth()
  .verifyIdToken(idToken)
  .then(function(decodedToken) {
    const uid = decodedToken.uid;
    // ...
  })
  .catch(function(error) {
    // Handle error
  });
// [END verify_id_token]

let idToken;
