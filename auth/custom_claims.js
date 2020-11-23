'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

const uid = 'firebaseUserId123';
const idToken = 'some-invalid-token';

// [START set_custom_user_claims]
// Set admin privilege on the user corresponding to uid.

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
  });
// [END set_custom_user_claims]

// [START verify_custom_claims]
// Verify the ID token first.
admin
  .auth()
  .verifyIdToken(idToken)
  .then((claims) => {
    if (claims.admin === true) {
      // Allow access to requested admin resource.
    }
  });
// [END verify_custom_claims]

// [START read_custom_user_claims]
// Lookup the user associated with the specified uid.
admin
  .auth()
  .getUser(uid)
  .then((userRecord) => {
    // The claims can be accessed on the user record.
    console.log(userRecord.customClaims['admin']);
  });
// [END read_custom_user_claims]

// [START set_custom_user_claims_script]
admin
  .auth()
  .getUserByEmail('user@admin.example.com')
  .then((user) => {
    // Confirm user is verified.
    if (user.emailVerified) {
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });
// [END set_custom_user_claims_script]

// [START set_custom_user_claims_incremental]
admin
  .auth()
  .getUserByEmail('user@admin.example.com')
  .then((user) => {
    // Add incremental custom claim without overwriting existing claims.
    const currentCustomClaims = user.customClaims;
    if (currentCustomClaims['admin']) {
      // Add level.
      currentCustomClaims['accessLevel'] = 10;
      // Add custom claims for additional privileges.
      return admin.auth().setCustomUserClaims(user.uid, currentCustomClaims);
    }
  })
  .catch((error) => {
    console.log(error);
  });
// [END set_custom_user_claims_incremental]
