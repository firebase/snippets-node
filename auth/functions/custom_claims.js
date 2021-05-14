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
