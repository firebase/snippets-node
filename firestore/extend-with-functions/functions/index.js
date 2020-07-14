const functions = require('firebase-functions');

function triggerSpecificDocument() {
  // [START trigger_specific_document]
  // Listen for any change on document `marie` in collection `users`
  exports.myFunctionName = functions.firestore
      .document('users/marie').onWrite((change, context) => {
        // ... Your code here
      });
  // [END trigger_specific_document]
}

function triggerNewDocument() {
  // [START trigger_new_document]
  exports.createUser = functions.firestore
      .document('users/{userId}')
      .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = snap.data();

        // access a particular field as you would any JS property
        const name = newValue.name;

        // perform desired operations ...
      });
  // [END trigger_new_document]
}

function triggerDocumentUpdated() {
  // [START trigger_document_updated]
  exports.updateUser = functions.firestore
      .document('users/{userId}')
      .onUpdate((change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = change.after.data();

        // ...or the previous value before this update
        const previousValue = change.before.data();

        // access a particular field as you would any JS property
        const name = newValue.name;

        // perform desired operations ...
      });
  // [END trigger_document_updated]
}

function triggerDocumentDeleted() {
  // [START trigger_document_deleted]
  exports.deleteUser = functions.firestore
      .document('users/{userID}')
      .onDelete((snap, context) => {
        // Get an object representing the document prior to deletion
        // e.g. {'name': 'Marie', 'age': 66}
        const deletedValue = snap.data();

        // perform desired operations ...
      });
  // [END trigger_document_deleted]
}

function triggerDocumentAnyChange() {
  // [START trigger_document_any_change]
  exports.modifyUser = functions.firestore
      .document('users/{userID}')
      .onWrite((change, context) => {
        // Get an object with the current document value.
        // If the document does not exist, it has been deleted.
        const document = change.after.exists ? change.after.data() : null;

        // Get an object with the previous document value (for update or delete)
        const oldDocument = change.before.data();

        // perform desired operations ...
      });
  // [END trigger_document_any_change]
}

function readingData() {
  // [START reading_data]
  exports.updateUser2 = functions.firestore
      .document('users/{userId}')
      .onUpdate((change, context) => {
        // Get an object representing the current document
        const newValue = change.after.data();

        // ...or the previous value before this update
        const previousValue = change.before.data();
      });
  // [END reading_data]
}

function readingDataWithGet(snap) {
  // [START reading_data_with_get]
  // Fetch data using standard accessors
  const age = snap.data().age;
  const name = snap.data()['name'];

  // Fetch data using built in accessor
  const experience = snap.get('experience');
  // [END reading_data_with_get]
}

function writingData() {
  // [START writing_data]
  // Listen for updates to any `user` document.
  exports.countNameChanges = functions.firestore
      .document('users/{userId}')
      .onUpdate((change, context) => {
        // Retrieve the current and previous value
        const data = change.after.data();
        const previousData = change.before.data();

        // We'll only update if the name has changed.
        // This is crucial to prevent infinite loops.
        if (data.name == previousData.name) {
          return null;
        }

        // Retrieve the current count of name changes
        let count = data.name_change_count;
        if (!count) {
          count = 0;
        }

        // Then return a promise of a set operation to update the count
        return change.after.ref.set({
          name_change_count: count + 1
        }, {merge: true});
      });
  // [END writing_data]
}

function basicWildcard() {
  // [START basic_wildcard]
  // Listen for changes in all documents in the 'users' collection
  exports.useWildcard = functions.firestore
      .document('users/{userId}')
      .onWrite((change, context) => {
        // If we set `/users/marie` to {name: "Marie"} then
        // context.params.userId == "marie"
        // ... and ...
        // change.after.data() == {name: "Marie"}
      });
  // [END basic_wildcard]
}

function multiWildcard() {
  // [START multi_wildcard]
  // Listen for changes in all documents in the 'users' collection and all subcollections
  exports.useMultipleWildcards = functions.firestore
      .document('users/{userId}/{messageCollectionId}/{messageId}')
      .onWrite((change, context) => {
        // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
        // context.params.userId == "marie";
        // context.params.messageCollectionId == "incoming_messages";
        // context.params.messageId == "134";
        // ... and ...
        // change.after.data() == {body: "Hello"}
      });
  // [END multi_wildcard]
}
