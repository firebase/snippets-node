'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

const uid = 'firebaseUserId123';
let idToken;
// [START set_custom_user_claims]
// Set admin privilege on the user corresponding to uid.

admin.auth().setCustomUserClaims(uid, {admin: true}).then(() => {
  // The new custom claims will propagate to the user's ID token the
  // next time a new one is issued.
});
// [END set_custom_user_claims]


// [START verify_custom_claims]
// Verify the ID token first.
admin.auth().verifyIdToken(idToken).then((claims) => {
  if (claims.admin === true) {
    // Allow access to requested admin resource.
  }
});
// [END verify_custom_claims]