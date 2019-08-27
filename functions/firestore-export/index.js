const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');

const client = new firestore.v1.FirestoreAdminClient();

exports.scheduledFirestoreExport = functions.pubsub
                                            // Set schedule
                                            .schedule('every 24 hours')
                                            .onRun((context) => {
   const databaseName = 
       client.databasePath(process.env.GCP_PROJECT, '(default)');

   // Replace BUCKET_NAME
   const bucket = 'gs://BUCKET_NAME'

   client.exportDocuments({
       name: databaseName,
       outputUriPrefix: bucket,
       // Leave collectionIds empty to export all collections
       // or set to a list of collection IDs to export,
       // collectionIds: ['users', 'posts']
       collectionIds: []
       })
   .then(responses => {
       const response = responses[0];
       console.log(response['name'])
   })
   .catch(err => {
       console.error(err);
   });
});