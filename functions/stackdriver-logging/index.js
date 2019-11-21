// [START sd_logging_import]
const {Logging} = require('@google-cloud/logging');
// [END sd_logging_import]
const functions = require('firebase-functions');

// [START sd_example_function]
exports.helloError = functions.https.onRequest((request, response) => {
  console.log('I am a log entry!');
  response.send('Hello World...');
});
// [END sd_example_function]

// [START sd_logging_setup]
// Instantiate the StackDriver Logging SDK. The project ID will
// be automatically inferred from the Cloud Functions environment.
const logging = new Logging();
const log = logging.log('my-custom-log-name');

// This metadata is attached to each log entry. This specifies a fake
// Cloud Function called 'Custom Metrics' in order to make your custom
// log entries appear in the Cloud Functions logs viewer.
const METADATA = {
  resource: {
    type: 'cloud_function',
    labels: {
      function_name: 'CustomMetrics',
      region: 'us-central1',
    },
  },
};
// [END sd_logging_setup]

function writeLog() {
  // [START sd_write_log]
  // Data to write to the log. This can be a JSON object with any properties
  // of the event you want to record.
  const data = {
    event: 'my-event',
    value: 'foo-bar-baz',

    // Optional 'message' property will show up in the Firebase
    // console and other human-readable logging surfaces
    message: 'my-event: foo-bar-baz',
  };

  // Write to the log. The log.write() call returns a Promise if you want to
  // make sure that the log was written successfully.
  const entry = log.entry(METADATA, data);
  log.write(entry);
  // [END sd_write_log]
}
