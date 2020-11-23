'use strict';
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const app = express();

// [START session_login]
app.post('/sessionLogin', (req, res) => {
  // Get the ID token passed and the CSRF token.
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();
  // Guard against CSRF attacks.
  if (csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      },
      (error) => {
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    );
});
// [END session_login]

app.post('/verifyToken', (req, res) => {
  // Get the ID token.
  const idToken = req.body.idToken.toString();
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // [START check_auth_time]
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedIdToken) => {
      // Only process if the user just signed in in the last 5 minutes.
      if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
        // Create session cookie and set it.
        return admin.auth().createSessionCookie(idToken, { expiresIn });
      }
      // A user that was not recently signed in is trying to set a session cookie.
      // To guard against ID token theft, require re-authentication.
      res.status(401).send('Recent sign in required!');
    });
  // [END check_auth_time]
});

// [START session_verify]
// Whenever a user is accessing restricted content that requires authentication.
app.post('/profile', (req, res) => {
  const sessionCookie = req.cookies.session || '';
  // Verify the session cookie. In this case an additional check is added to detect
  // if the user's Firebase session was revoked, user deleted/disabled, etc.
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      serveContentForUser('/profile', req, res, decodedClaims);
    })
    .catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      res.redirect('/login');
    });
});
// [END session_verify]

app.post('/verifySessionCookie', (req, res) => {
  const sessionCookie = req.cookies.session || '';
  // [START session_verify_with_permission_check]
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      // Check custom claims to confirm user is an admin.
      if (decodedClaims.admin === true) {
        return serveContentForAdmin('/admin', req, res, decodedClaims);
      }
      res.status(401).send('UNAUTHORIZED REQUEST!');
    })
    .catch((error) => {
      // Session cookie is unavailable or invalid. Force user to login.
      res.redirect('/login');
    });
  // [END session_verify_with_permission_check]
});

// [START session_clear]
app.post('/sessionLogout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/login');
});
// [END session_clear]

// [START session_clear_and_revoke]
app.post('/sessionLogout', (req, res) => {
  const sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  admin
    .auth()
    .verifySessionCookie(sessionCookie)
    .then((decodedClaims) => {
      return admin.auth().revokeRefreshTokens(decodedClaims.sub);
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch((error) => {
      res.redirect('/login');
    });
});
// [END session_clear_and_revoke]

const serveContentForAdmin = (...args) => {
  // TODO: this function is just here to make the code "compile"
};
const serveContentForUser = (...args) => {
  // TODO: this function is just here to make the code "compile"
};
