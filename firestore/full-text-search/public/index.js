// [START search_index_unsecure]
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
const index = client.initIndex("notes");

index
  .query({
    query: "Some text"
  })
  .then(responses => {
    console.log(responses.hits);
  });
// [END search_index_unsecure]

// [START search_index_secure]
const projectID = "YOUR_PROJECT_ID";

fetch(`https://us-central1-${projectID}.cloudfunctions.net/getSearchKey/`, {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(r => {
    return r.json();
  })
  .then(data => {
    this.algolia.client = algoliasearch(ALGOLIA_APP_ID, data.key);
    this.algolia.index = this.algolia.client.initIndex("notes");

    index
      .query({
        query: "Some text"
      })
      .then(responses => {
        console.log(responses.hits);
      });
  });
// [END search_index_secure]
