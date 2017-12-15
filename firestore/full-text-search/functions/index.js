const functions = require("firebase-functions");
const firestore = require("firebase-functions/lib/providers/firestore");
const Firestore = require("@google-cloud/firestore");

const algoliasearch = require("algoliasearch");

// [START init_algolia]
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const ALGOLIA_INDEX_NAME = "notes";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
// [END init_algolia]

// Initialize Firestore
const firestoreOptions = {
  projectId: process.env.GCLOUD_PROJECT
};
const db = new Firestore(firestoreOptions);

// [START update_index_function]
// Update the search index every time a blog post is written.
exports.onNoteCreated = firestore.document("notes/{noteId}").onCreate(event => {
  // Get the note document
  const note = event.data.data();

  // Add an "objectID" field which Algolia requires
  note.objectID = event.params.postId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(note);
});
// [END update_index_function]

// [START get_firebase_user]
const admin = require("admin");

function getFirebaseUser(req, res, next) {
  console.log("Check if request is authorized with Firebase ID token");

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>"
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log("Found 'Authorization' header");
    idToken = req.headers.authorization.split("Bearer ")[1];
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      console.log("ID Token correctly decoded", decodedIdToken);
      req.user = decodedIdToken;
      next();
    })
    .catch(error => {
      console.error("Error while verifying Firebase ID token:", error);
      res.status(403).send("Unauthorized");
    });
}
// [END get_firebase_user]

// [START get_algolia_user_token]
// This complex HTTP function will be created as an ExpressJS app:
// https://expressjs.com/en/4x/api.html
const app = require("express")();

// We'll enable CORS support to allow the function to be invoked
// from our app client-side.
app.use(require("cors")({ origin: true }));

// Then we'll also use a special "getFirebaseUser" middleware which
// verifies the Authorization header and adds a `user` field to the
// incoming request:
// https://gist.github.com/abehaskins/832d6f8665454d0cd99ef08c229afb42
app.use(getFirebaseUser);

// Add a route handler to the app to generate the secured key 
app.get("/", (req, res) => {
  // Create the params object as described in the Algolia documentation:
  // https://www.algolia.com/doc/guides/security/api-keys/#generating-api-keys
  const params = {
    // This filter ensures that only documents where author == user_id will be readable
    filters: `author:${req.user.user_id}`,
    // We also proxy the user_id as a unique token for this key.
    userToken: req.user.user_id
  };

  // Call the Algolia API to generate a unique key based on our search key
  const key = client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, params);

  // Then return this key as {key: "...key"}
  res.json({ key });
});

// Finally, pass our ExpressJS app to Cloud Functions as a function
// called "getSearchKey";
exports.getSearchKey = functions.https.onRequest(app);
// [END get_algolia_user_token]
