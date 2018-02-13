const algoliasearch = require('algoliasearch');
const ALGOLIA_APP_ID = 'YOUR_APP_ID';
const ALGOLIA_SEARCH_KEY = 'YOUR_SEARCH_KEY';

// To pass lint only
const firebase = undefined;
let index = undefined;

function searchIndexUnsecure() {
    // [START search_index_unsecure]
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
    const index = client.initIndex('notes');

    // Search query
    const query = 'Some text';

    // Perform an Algolia search:
    // https://www.algolia.com/doc/api-reference/api-methods/search/
    index
        .search({
            query
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            console.log(responses.hits);
        });
    // [END search_index_unsecure]
}

function searchIndexSecure() {
    // [START search_index_secure]
    const projectID = 'YOUR_PROJECT_ID';

    // Search query
    const query = 'Some text';

    // Use Firebase Authentication to request the underlying token
    firebase.auth().currentUser.getIdToken()
        .then(token => {
            // The token is then passed to our getSearchKey Cloud Function
            return fetch(`https://us-central1-${projectID}.cloudfunctions.net/getSearchKey/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }).then(r => {
            // The Fetch API returns a stream, which we convert into a JSON object.
            return r.json();
        }).then(data => {
            // Data will contain the restricted key in the `key` field.
            this.algolia.client = algoliasearch(ALGOLIA_APP_ID, data.key);
            this.algolia.index = this.algolia.client.initIndex('notes');

            // Perform the search as usual.
            return index.search({query});
        }).then(responses => {
            console.log(responses.hits);
        });
    // [END search_index_secure]
}