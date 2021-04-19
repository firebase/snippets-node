const { initializeApp, cert } = require('firebase-admin/app');

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
