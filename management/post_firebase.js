const requestPromise = require('request-promise');

// [START get_sa_access_token]
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/firebase'];

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    const key = require('./service-account.json');
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        SCOPES,
        null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
// [END get_sa_access_token]

// [START add_ios_app]
async function addIosApp(projectId, displayName, bundleId) {
  const accessToken = await getAccessToken();
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/' + projectId + '/iosApps',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    body: {
      'displayName': displayName,
      'bundleId': bundleId
    },
    json: true,
  };

  try {
    const resp = await requestPromise(options);
    console.log(resp);
  } catch(err) {
    console.error(err['message']);
  }
}
// [END add_ios_app]

// [START add_android_app]
async function addAndroidApp(projectId, displayName, packageName) {
  const accessToken = await getAccessToken();
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/' + projectId + '/androidApps',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    body: {
      'displayName': displayName,
      'packageName': packageName
    },
    json: true,
  };

  try {
    const resp = await requestPromise(options);
    console.log(resp);
  } catch(err) {
    console.error(err['message']);
  }
}
// [END add_android_app]

// [START add_web_app]
async function addWebApp(projectId, displayName) {
  const accessToken = await getAccessToken();
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/' + projectId + '/webApps',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    body: {
      'displayName': displayName
    },
    json: true,
  };

  try {
    const resp = await requestPromise(options);
    console.log(resp);
  } catch(err) {
    console.error(err['message']);
  }
}
// [END add_web_app]

// [START finalize_location]
async function finalizeProjectLocation(projectId, locationId) {
  const accessToken = await getAccessToken();
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/' + projectId + '/defaultLocation:finalize',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    body: {
      'locationId': locationId
    },
    json: true,
  };

  try {
    const resp = await requestPromise(options);
    console.log(resp);
  } catch(err) {
    console.error(err['message']);
  }
}
// [END finalize_location]
