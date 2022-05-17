'use strict';
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');
initializeApp();

const express = require('express');

const uid = 'firebaseUserId123';
const idToken = 'some-invalid-token';

// [START set_custom_user_claims]
// Set admin privilege on the user corresponding to uid.

getAuth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
  });
// [END set_custom_user_claims]

// [START verify_custom_claims]
// Verify the ID token first.
getAuth()
  .verifyIdToken(idToken)
  .then((claims) => {
    if (claims.admin === true) {
      // Allow access to requested admin resource.
    }
  });
// [END verify_custom_claims]

// [START read_custom_user_claims]
// Lookup the user associated with the specified uid.
getAuth()
  .getUser(uid)
  .then((userRecord) => {
    // The claims can be accessed on the user record.
    console.log(userRecord.customClaims['admin']);
  });
// [END read_custom_user_claims]

// [START set_custom_user_claims_script]
getAuth()
  .getUserByEmail('user@admin.example.com')
  .then((user) => {
    // Confirm user is verified.
    if (user.emailVerified) {
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
      return getAuth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });
// [END set_custom_user_claims_script]

// [START set_custom_user_claims_incremental]
getAuth()
  .getUserByEmail('user@admin.example.com')
  .then((user) => {
    // Add incremental custom claim without overwriting existing claims.
    const currentCustomClaims = user.customClaims;
    if (currentCustomClaims['admin']) {
      // Add level.
      currentCustomClaims['accessLevel'] = 10;
      // Add custom claims for additional privileges.
      return getAuth().setCustomUserClaims(user.uid, currentCustomClaims);
    }
  })
  .catch((error) => {
    console.log(error);
  });
// [END set_custom_user_claims_incremental]

function customClaimsServer() {
  const app = express();

  // [START auth_custom_claims_server]
  app.post('/setCustomClaims', async (req, res) => {
    // Get the ID token passed.
    const idToken = req.body.idToken;

    // Verify the ID token and decode its payload.
    const claims = await getAuth().verifyIdToken(idToken);

    // Verify user is eligible for additional privileges.
    if (
      typeof claims.email !== 'undefined' &&
      typeof claims.email_verified !== 'undefined' &&
      claims.email_verified &&
      claims.email.endsWith('@admin.example.com')
    ) {
      // Add custom claims for additional privileges.
      await getAuth().setCustomUserClaims(claims.sub, {
        admin: true
      });

      // Tell client to refresh token on user.
      res.end(JSON.stringify({
        status: 'success'
      }));
    } else {
      // Return nothing.
      res.end(JSON.stringify({ status: 'ineligible' }));
    }
  });
  // [END auth_custom_claims_server]
}
