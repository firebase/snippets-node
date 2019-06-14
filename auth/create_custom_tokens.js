'use strict';
const admin = require('firebase-admin');

// Initialize the Admin app with the default appication credentials
// [START initialize_sdk_with_default_config]
admin.initializeApp();
// [END initialize_sdk_with_default_config]

// Initialize the Admin app by providing a service accoune key
// [START initialize_sdk_with_service_account_id]
admin.initializeApp({
  serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com',
});
// [END initialize_sdk_with_service_account_id]

// [START custom_token]
const uid = 'some-uid';

admin
  .auth()
  .createCustomToken(uid)
  .then(function(customToken) {
    // Send token back to client
  })
  .catch(function(error) {
    console.log('Error creating custom token:', error);
  });
// [END custom_token]

// [START custom_token_with_claims]
const userId = 'some-uid';
const additionalClaims = {
  premiumAccount: true,
};

admin
  .auth()
  .createCustomToken(userId, additionalClaims)
  .then(function(customToken) {
    // Send token back to client
  })
  .catch(function(error) {
    console.log('Error creating custom token:', error);
  });
// [END custom_token_with_claims]
