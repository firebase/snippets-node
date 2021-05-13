const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

function initDefaultBucket() {
  // [START storage_init_default_bucket]
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getStorage } = require('firebase-admin/storage');

  const serviceAccount = require('./path/to/serviceAccountKey.json');

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: '<BUCKET_NAME>.appspot.com'
  });

  const bucket = getStorage().bucket();

  // 'bucket' is an object defined in the @google-cloud/storage library.
  // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
  // for more details.
  // [END storage_init_default_bucket]
}

function customBucket() {
  // [START storage_custom_bucket]
  const bucket = getStorage().bucket('my-custom-bucket');
  // [END storage_custom_bucket]
}

function customApp() {
  const customApp = initializeApp({
    // ...
  }, 'custom');

  // [START storage_custom_app]
  const bucket = getStorage(customApp).bucket();
  // [END storage_custom_app]
}
