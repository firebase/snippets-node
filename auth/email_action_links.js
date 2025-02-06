'use strict';
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
initializeApp();

// [START init_action_code_settings]
const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for
  // this URL must be whitelisted in the Firebase Console.
  url: 'https://www.example.com/checkout?cartId=1234',
  // This must be true for email link sign-in.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios',
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12',
  },
  // The domain must be configured in Firebase Hosting and owned by the project.
  linkDomain: 'custom-domain.com',
};
// [END init_action_code_settings]

// [START password_reset_link]
// Admin SDK API to generate the password reset link.
const userEmail = 'user@example.com';
getAuth()
  .generatePasswordResetLink(userEmail, actionCodeSettings)
  .then((link) => {
    // Construct password reset email template, embed the link and send
    // using custom SMTP server.
    return sendCustomPasswordResetEmail(userEmail, displayName, link);
  })
  .catch((error) => {
    // Some error occurred.
  });
// [END password_reset_link]

function emailVerificationLink() {
  // [START email_verification_link]
  // Admin SDK API to generate the email verification link.
  const useremail = 'user@example.com';
  getAuth()
    .generateEmailVerificationLink(useremail, actionCodeSettings)
    .then((link) => {
      // Construct email verification template, embed the link and send
      // using custom SMTP server.
      return sendCustomVerificationEmail(useremail, displayName, link);
    })
    .catch((error) => {
      // Some error occurred.
    });
  // [END email_verification_link]
}

function signInWithEmailLink() {
  // [START sign_in_with_email_link]
  // Admin SDK API to generate the sign in with email link.
  const useremail = 'user@example.com';
  getAuth()
    .generateSignInWithEmailLink(useremail, actionCodeSettings)
    .then((link) => {
      // Construct sign-in with email link template, embed the link and
      // send using custom SMTP server.
      return sendSignInEmail(useremail, displayName, link);
    })
    .catch((error) => {
      // Some error occurred.
    });
  // [END sign_in_with_email_link]
}

let displayName;
const sendSignInEmail = (...args) => {
  // TODO: this function is just here to make the code "compile"
};
const sendCustomVerificationEmail = (...args) => {
  // TODO: this function is just here to make the code "compile"
};
const sendCustomPasswordResetEmail = (...args) => {
  // TODO: this function is just here to make the code "compile"
};
