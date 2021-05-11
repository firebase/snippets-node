'use strict';
const express = require('express');

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

function customClaimsCloudFunction() {
  // [START auth_custom_claims_cloud_function]
  const functions = require('firebase-functions');

  const admin = require('firebase-admin');
  admin.initializeApp();

  // On sign up.
  exports.processSignUp = functions.auth.user().onCreate(async (user) => {
    // Check if user meets role criteria.
    if (
      user.email &&
      user.email.endsWith('@admin.example.com') &&
      user.emailVerified
    ) {
      const customClaims = {
        admin: true,
        accessLevel: 9
      };

      try {
        // Set custom user claims on this newly created user.
        await admin.auth().setCustomUserClaims(user.uid, customClaims);

        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref('metadata/' + user.uid);

        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        await  metadataRef.set({refreshTime: new Date().getTime()});
      } catch (error) {
        console.log(error);
      }
    }
  });
  // [END auth_custom_claims_cloud_function]
}

function customClaimsServer() {
  const app = express();

  // [START auth_custom_claims_server]
  app.post('/setCustomClaims', async (req, res) => {
    // Get the ID token passed.
    const idToken = req.body.idToken;

    // Verify the ID token and decode its payload.
    const claims = await admin.auth().verifyIdToken(idToken);

    // Verify user is eligible for additional privileges.
    if (
      typeof claims.email !== 'undefined' &&
      typeof claims.email_verified !== 'undefined' &&
      claims.email_verified &&
      claims.email.endsWith('@admin.example.com')
    ) {
      // Add custom claims for additional privileges.
      await admin.auth().setCustomUserClaims(claims.sub, {
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
