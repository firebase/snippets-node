const admin = require('firebase-admin');

function initializeApplicationDefault() {
    // [START initialize_application_default]
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    });
    // [END initialize_application_default]
}

function initializeRefreshToken() {
    // [START initialize_refresh_token]
    const refreshToken = '...'; // Get refresh token from OAuth2 flow

    admin.initializeApp({
      credential: admin.credential.refreshToken(refreshToken),
      databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    });
    // [END initialize_refresh_token]
}

function initializeEmpty() {
    // [START initialize_empty]
    const app = admin.initializeApp();
    // [END initialize_empty]
}

function initializeDefaultApp() {
    const defaultAppConfig = {};

    // [START initialize_default_app]
    // Initialize the default app
    const defaultApp = admin.initializeApp(defaultAppConfig);

    console.log(defaultApp.name);  // '[DEFAULT]'

    // Retrieve services via the defaultApp variable...
    let defaultAuth = defaultApp.auth();
    let defaultDatabase = defaultApp.database();

    // ... or use the equivalent shorthand notation
    defaultAuth = admin.auth();
    defaultDatabase = admin.database();
    // [END initialize_default_app]
}

function initializeMultipleApps() {
    const defaultAppConfig = {};
    const otherAppConfig = {};

    // [START initialize_multiple_apps]
    // Initialize the default app
    admin.initializeApp(defaultAppConfig);

    // Initialize another app with a different config
    var otherApp = admin.initializeApp(otherAppConfig, 'other');

    console.log(admin.app().name);  // '[DEFAULT]'
    console.log(otherApp.name);     // 'other'

    // Use the shorthand notation to retrieve the default app's services
    const defaultAuth = admin.auth();
    const defaultDatabase = admin.database();

    // Use the otherApp variable to retrieve the other app's services
    const otherAuth = otherApp.auth();
    const otherDatabase = otherApp.database();
    // [END initialize_multiple_apps]
}

function multipleFirebaseApps() {
    // [START firebase_options]
    const secondaryServiceAccount = require('./path/to/serviceAccountKey.json');

    // All required options are specified by the service account,
    // add service-specific configuration like databaseURL as needed.
    const secondaryAppConfig = {
        credential: admin.credential.cert(secondaryServiceAccount),
        // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    };
    // [END firebase_options]

    // [START firebase_secondary]
    // Initialize another app with a different config
    const secondary = admin.initializeApp(secondaryAppConfig, 'secondary');
    // Access services, such as the Realtime Database
    // const secondaryDatabase = secondary.database();
    // [END firebase_secondary]
}
