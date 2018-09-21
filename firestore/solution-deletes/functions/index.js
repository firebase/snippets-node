const admin = require('firebase-admin');
const firebase_tools = require('firebase-tools');
const functions = require('firebase-functions');

admin.initializeApp();

/**
 * Callable function that creates a custom auth token with the
 * custom attribute "admin" set to true.
 * 
 * See https://firebase.google.com/docs/auth/admin/create-custom-tokens
 * for more information on creating custom tokens.
 * 
 * @param {string} data.uid the user UID to set on the token.
 */
exports.mintAdminToken = functions.https.onCall((data, context) => {
  const uid = data.uid;

  return admin
    .auth()
    .createCustomToken(uid, { admin: true })
    .then(function(token) {
      return { token: token };
    });
});

/**
 * Initiate a recursive delete of documents at a given path.
 * 
 * This function first checks to make sure that the calling user is
 * authenticated and that the token has the custom "admin" attribute
 * set to true.
 * 
 * Next, the function calls the firestore:delet functionality
 * of the firebase-tools library to initiate a recursive delete.
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 * 
 * Deployment notes:
 *   - The fb.token variable must be set in the functions config. This
 *     token can be obtained by running 'firebase login:ci'
 *   - The runtime options are set to the max timeout and RAM to allow
 *     for long-running delete operations of many documents.
 * 
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall((data, context) => {
    // Only allow admin users to execute this function.
    if (!(context.auth && context.auth.token && context.auth.token.admin)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.'
      );
    }

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    // Run a recursive delete on the given document or collection path/
    return firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token
      })
      .then(() => {
        return { path: path };
      });
  });
