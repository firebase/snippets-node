'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

const uid = 'some_uid_1234';
const idToken = 'some_id_token';
const utcRevocationTimeSecs = 60 * 60;

// [START revoke_tokens]
// Revoke all refresh tokens for a specified user for whatever reason.
// Retrieve the timestamp of the revocation, in seconds since the epoch.
admin
  .auth()
  .revokeRefreshTokens(uid)
  .then(() => {
    return admin.auth().getUser(uid);
  })
  .then((userRecord) => {
    return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
  })
  .then((timestamp) => {
    console.log(`Tokens revoked at: ${timestamp}`);
  });
// [END revoke_tokens]

// [START save_revocation_in_db]
const metadataRef = admin.database().ref('metadata/' + uid);
metadataRef.set({ revokeTime: utcRevocationTimeSecs }).then(() => {
  console.log('Database updated successfully.');
});
// [END save_revocation_in_db]

// [START verify_id_token_check_revoked]
// Verify the ID token while checking if the token is revoked by passing
// checkRevoked true.
let checkRevoked = true;
admin
  .auth()
  .verifyIdToken(idToken, checkRevoked)
  .then((payload) => {
    // Token is valid.
  })
  .catch((error) => {
    if (error.code == 'auth/id-token-revoked') {
      // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
    } else {
      // Token is invalid.
    }
  });
// [END verify_id_token_check_revoked]
