const functions = require('firebase-functions');
const firestore = require('firebase-functions/lib/providers/datastore');
const Firestore = require('@google-cloud/firestore');

const algoliasearch = require('algoliasearch');

// [START init_algolia]
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const ALGOLIA_INDEX_NAME = 'blogposts';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
// [END init_algolia]

// Initialize Firestore
const firestoreOptions = {
    projectId: process.env.GCLOUD_PROJECT
};
const db = new Firestore(firestoreOptions);

// [START update_index_function]
// Update the search index every time a blog post is written.
exports.indexBlogPost = firestore.document('posts/{postId}').onWrite(event => {
    // Get the text of the blog post
    const document = event.data.value;
    const text = document.fields.text.stringValue;

    // Construct a JSON representation
    const postObject = {
        text: text,
        objectID: event.params.postId
    };

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(postObject);
});
// [END update_index_function]

// [START search_request_function]
// When a client writes a new request to 'post_search_requests', search the blog post
// index and write the response back to `post_search_responses'
exports.searchRequest = firestore.document('post_search_requests/{searchId}').onWrite(event => {
    // Get the search ID and query from the event
    const searchId = event.params.searchId;
    const document = event.data.value;
    const query = document.fields.query.stringValue;

    // Query the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.search(query).then(content => {
        // Search success, write response back to post_search_responses.
        // The 'content' variable is an algolia search response
        // https://www.algolia.com/doc/api-client/javascript/search/#search-response-format
        return db.collection('post_search_responses')
            .doc(searchId)
            .set({
                content: content
            });
    }).catch(err => {
        // Search failed, write error to post_search_responses.
        return db.collection('post_search_responses')
            .doc(searchId)
            .set({
                error: err
            });
    });
});
// [END search_request_function]