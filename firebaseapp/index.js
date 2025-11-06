const { initializeApp, getApp, cert, applicationDefault, refreshToken } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');

function initializeApplicationDefault() {
    // [START initialize_application_default]
    initializeApp({
        credential: applicationDefault(),
        databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    });
    // [END initialize_application_default]
}

function initializeRefreshToken() {
    // [START initialize_refresh_token]
    const myRefreshToken = '...'; // Get refresh token from OAuth2 flow

    initializeApp({
      credential: refreshToken(myRefreshToken),
      databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    });
    // [END initialize_refresh_token]
}

function initializeEmpty() {
    // [START initialize_empty]
    const app = initializeApp();
    // [END initialize_empty]
}

function initializeDefaultApp() {
    const defaultAppConfig = {};

    // [START initialize_default_app]
    // Initialize the default app
    const defaultApp = initializeApp(defaultAppConfig);

    console.log(defaultApp.name);  // '[DEFAULT]'

    // Retrieve services via the defaultApp variable...
    let defaultAuth = getAuth(defaultApp);
    let defaultDatabase = getDatabase(defaultApp);

    // ... or use the equivalent shorthand notation
    defaultAuth = getAuth();
    defaultDatabase = getDatabase();
    // [END initialize_default_app]
}

function initializeMultipleApps() {
    const defaultAppConfig = {};
    const otherAppConfig = {};

    // [START initialize_multiple_apps]
    // Initialize the default app
    initializeApp(defaultAppConfig);

    // Initialize another app with a different config
    var otherApp = initializeApp(otherAppConfig, 'other');

    console.log(getApp().name);  // '[DEFAULT]'
    console.log(otherApp.name);     // 'other'

    // Use the shorthand notation to retrieve the default app's services
    const defaultAuth = getAuth();
    const defaultDatabase = getDatabase();

    // Use the otherApp variable to retrieve the other app's services
    const otherAuth = getAuth(otherApp);
    const otherDatabase = getDatabase(otherApp);
    // [END initialize_multiple_apps]
}

function multipleFirebaseApps() {
    // [START firebase_options]
    const secondaryServiceAccount = require('./path/to/serviceAccountKey.json');

    // All required options are specified by the service account,
    // add service-specific configuration like databaseURL as needed.
    const secondaryAppConfig = {
        credential: cert(secondaryServiceAccount),
        // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    };
    // [END firebase_options]

    // [START firebase_secondary]
    // Initialize another app with a different config
    const secondary = initializeApp(secondaryAppConfig, 'secondary');
    // Access services, such as the Realtime Database
    // const secondaryDatabase = secondary.database();
    // [END firebase_secondary]
}
