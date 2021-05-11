const admin = require('firebase-admin');

function initDefaultBucket() {
  // [START storage_init_default_bucket]
  const admin = require('firebase-admin');

  const serviceAccount = require('./path/to/serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: '<BUCKET_NAME>.appspot.com'
  });

  const bucket = admin.storage().bucket();

  // 'bucket' is an object defined in the @google-cloud/storage library.
  // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
  // for more details.
  // [END storage_init_default_bucket]
}

function customBucket() {
  // [START storage_custom_bucket]
  const bucket = admin.storage().bucket('my-custom-bucket');
  // [END storage_custom_bucket]
}

function customApp() {
  const customApp = admin.initializeApp({
    // ...
  }, 'custom');

  // [START storage_custom_app]
  const bucket = customApp.storage().bucket();
  // [END storage_custom_app]
}
