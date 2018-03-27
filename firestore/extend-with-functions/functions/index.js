const functions = require('firebase-functions');

function triggerSpecificDocument() {
    // [START trigger_specific_document]
    // Listen for any change on document `marie` in collection `users`
    exports.myFunctionName = functions.firestore
        .document('users/marie').onWrite((event) => {
            // ... Your code here
        });
    // [END trigger_specific_document]
}

function triggerNewDocument() {
    // [START trigger_new_document]
    exports.createUser = functions.firestore
        .document('users/{userId}')
        .onCreate(event => {
            // Get an object representing the document
            // e.g. {'name': 'Marie', 'age': 66}
            const newValue = event.data.data();

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
        .onUpdate(event => {
            // Get an object representing the document
            // e.g. {'name': 'Marie', 'age': 66}
            const newValue = event.data.data();

            // ...or the previous value before this update
            const previousValue = event.data.previous.data();

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
        .onDelete(event => {
            // Get an object representing the document prior to deletion
            // e.g. {'name': 'Marie', 'age': 66}
            const deletedValue = event.data.previous.data();

            // perform desired operations ...
        });
    // [END trigger_document_deleted]
}

function triggerDocumentAnyChange() {
    // [START trigger_document_any_change]
    exports.modifyUser = functions.firestore
        .document('users/{userID}')
        .onWrite(event => {
            // Get an object with the current document value.
            // If the document does not exist, it has been deleted.
            const document = event.data.exists ? event.data.data() : null;

            // Get an object with the previous document value (for update or delete)
            const oldDocument = event.data.previous.data();

            // perform desired operations ...
        });
    // [END trigger_document_any_change]
}

function readingData() {
    // [START reading_data]
    exports.updateUser = functions.firestore
        .document('users/{userId}')
        .onUpdate(event => {
            // Get an object representing the current document
            const newValue = event.data.data();

            // ...or the previous value before this update
            const previousValue = event.data.previous.data();
        });
    // [END reading_data]
}

function readingDataWithGet(event) {
    // [START reading_data_with_get]
    // Fetch data using standard accessors
    const age = event.data.data().age;
    const name = event.data.data()['name'];

    // Fetch data using built in accessor
    const experience = event.data.get('experience');
    // [END reading_data_with_get]
}

function writingData() {
    // [START writing_data]
    // Listen for updates to any `user` document.
    exports.countNameChanges = functions.firestore
        .document('users/{userId}')
        .onUpdate((event) => {
            // Retrieve the current and previous value
            const data = event.data.data();
            const previousData = event.data.previous.data();

            // We'll only update if the name has changed.
            // This is crucial to prevent infinite loops.
            if (data.name == previousData.name) return;

            // Retrieve the current count of name changes
            let count = data.name_change_count;
            if (!count) {
                count = 0;
            }

            // Then return a promise of a set operation to update the count
            return event.data.ref.set({
                name_change_count: count + 1
            }, {merge: true});
        });
    // [END writing_data]
}

function basicWildcard() {
    // [START basic_wildcard]
    // Listen for changes in all documents and all sub-collections
    exports.useWildcard = functions.firestore
        .document('users/{userId}')
        .onWrite((event) => {
            // If we set `/users/marie` to {name: "marie"} then
            // event.params.userId == "marie"
            // ... and ...
            // event.data.data() == {name: "Marie"}
        });
    // [END basic_wildcard]
}

function multiWildcard() {
    // [START multi_wildcard]
    // Listen for changes in all documents and all subcollections
    exports.useMultipleWildcards = functions.firestore
        .document('users/{userId}/{messageCollectionId}/{messageId}')
        .onWrite((event) => {
            // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
            // event.params.userId == "marie";
            // event.params.messageCollectionId == "incoming_messages";
            // event.params.messageId == "134";
            // ... and ...
            // event.data.data() == {body: "Hello"}
        });
    // [END multi_wildcard]
}
