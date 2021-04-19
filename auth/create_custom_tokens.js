'use strict';
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize the Admin app with the default appication credentials
// [START initialize_sdk_with_default_config]
initializeApp();
// [END initialize_sdk_with_default_config]

// Initialize the Admin app by providing a service accoune key
// [START initialize_sdk_with_service_account_id]
initializeApp({
  serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com',
});
// [END initialize_sdk_with_service_account_id]

// [START custom_token]
const uid = 'some-uid';

getAuth()
  .createCustomToken(uid)
  .then((customToken) => {
    // Send token back to client
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
// [END custom_token]

// [START custom_token_with_claims]
const userId = 'some-uid';
const additionalClaims = {
  premiumAccount: true,
};

getAuth()
  .createCustomToken(userId, additionalClaims)
  .then((customToken) => {
    // Send token back to client
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
// [END custom_token_with_claims]
