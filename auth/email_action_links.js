'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

// [START init_action_code_settings]
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.
  url: 'https://www.example.com/checkout?cartId=1234',
  // This must be true for email link sign-in.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  // FDL custom domain.
  dynamicLinkDomain: 'coolapp.page.link'
};
// [END init_action_code_settings]

// [START email_verification_link]
// Admin SDK API to generate the password reset link.
const email = 'user@example.com';
admin.auth().generatePasswordResetLink(email, actionCodeSettings)
  .then((link) => {
    // Construct password reset email template, embed the link and send
    // using custom SMTP server.
    return sendCustomPasswordResetEmail(email, displayName, link);
  })
  .catch((error) => {
    // Some error occurred.
  });

// [START email_verification_link]
// Admin SDK API to generate the email verification link.
const email = 'user@example.com';
admin.auth().generateEmailVerificationLink(email, actionCodeSettings)
  .then((link) => {
    // Construct email verification template, embed the link and send
    // using custom SMTP server.
    return sendCustomVerificationEmail(email, displayName, link);
  })
  .catch((error) => {
    // Some error occurred.
  });
// [END email_verification_link]

// [START sign_in_with_email_link]
// Admin SDK API to generate the sign in with email link.
const email = 'user@example.com';
admin.auth().generateSignInWithEmailLink(email, actionCodeSettings)
  .then((link) => {
    // Construct sign-in with email link template, embed the link and
    // send using custom SMTP server.
    return sendSignInEmail(email, displayName, link);
  })
  .catch((error) => {
    // Some error occurred.
  });
// [END sign_in_with_email_link]