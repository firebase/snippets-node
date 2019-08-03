const requestPromise = require('request-promise');

// [START list_available_projects]
async function listProjects() {
  const accessToken = await getAccessToken();
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/availableProjects',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + '<OAUTH2_ACCESS_TOKEN>',
    },
    json: true,
  };

  try {
    const resp = await requestPromise(options);
    console.log(resp);
    const projects = resp['projectInfo'];
    console.log('Project total: ' + projects.length);
    console.log('');
    for (let i in projects) {
      const project = projects[i];
      console.log('Project ' + i);
      console.log('ID: ' + project['project']);
      console.log('Display Name: ' + project['displayName']);
      console.log('');
    }
  } catch(err) {
    console.error(err);
  }
}
// [END list_available_projects]

// [START add_firebase]
async function addFirebase(projectId) {
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/' + projectId + ':addFirebase',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + '<OAUTH2_ACCESS_TOKEN>',
    },
    body: {
      'timeZone': 'America/Los_Angeles',
      'regionCode': 'US'
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
// [END add_firebase]

// [START check_operation]
async function checkOperation(operationName) {
  const options = {
    uri: 'https://firebase.googleapis.com/v1beta1/' + operationName,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + '<OAUTH2_ACCESS_TOKEN>',
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
// [END check_operation]

listProjects();
