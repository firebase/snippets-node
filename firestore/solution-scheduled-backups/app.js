const axios = require('axios');
const dateformat = require('dateformat');
const express = require('express');
const { google } = require('googleapis');

const app = express();

// Trigger a backup
app.get('/cloud-firestore-export', async (req, res) => {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/datastore']
  });

  const accessTokenResponse = await auth.getAccessToken();
  const accessToken = accessTokenResponse.token;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken
  };

  const outputUriPrefix = req.param('outputUriPrefix');
  if (!(outputUriPrefix && outputUriPrefix.indexOf('gs://') == 0)) {
    res.status(500).send(`Malformed outputUriPrefix: ${outputUriPrefix}`);
  }

  // Construct a backup path folder based on the timestamp
  const timestamp = dateformat(Date.now(), 'yyyy-mm-dd-HH-MM-ss');
  let path = outputUriPrefix;
  if (path.endsWith('/')) {
    path += timestamp;
  } else {
    path += '/' + timestamp;
  }

  const body = {
    outputUriPrefix: path
  };

  // If specified, mark specific collections for backup
  const collectionParam = req.param('collections');
  if (collectionParam) {
    body.collectionIds = collectionParam.split(',');
  }

  const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`;

  try {
    const response = await axios.post(url, body, { headers: headers });
    res
      .status(200)
      .send(response.data)
      .end();
  } catch (e) {
    if (e.response) {
      console.warn(e.response.data);
    }

    res
      .status(500)
      .send('Could not start backup: ' + e)
      .end();
  }
});

// Index page, just to make it easy to see if the app is working.
app.get('/', (req, res) => {
  res
    .status(200)
    .send('[scheduled-backups]: Hello, world!')
    .end();
});

// Start the server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
