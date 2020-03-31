'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

const idToken = "some_id_token";

// [START verify_id_token]
// idToken comes from the client app
admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    let uid = decodedToken.uid;
    // ...
  }).catch(function(error) {
    // Handle error
  });
// [END verify_id_token]