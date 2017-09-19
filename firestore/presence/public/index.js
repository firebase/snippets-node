// [START rtdb_presence]
// Fetch the current user's ID from Firebase Authentication.
const uid = firebase.auth().currentUser.uid;

// Create a reference to this user's specific status node.
// This is where we will store data about being online/offline.
const userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`);

// We'll create two constants which we will write to 
// the Realtime database when this device is offline
// or online.
const isOffline = {
    state: "offline",
    last_seen: firebase.database.ServerValue.TIMESTAMP,
};

const isOnline = {
    state: "offline",
    last_seen: firebase.database.ServerValue.TIMESTAMP,
};

// Create a reference to the special ".info/connected" path in 
// Realtime Database. This path returns `true` when connected
// and `false` when disconnected.
firebase.database().ref(".info/connected").on("value", function (snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) {
        return;
    };

    // If we are currently connected, then use the 'onDisconnect()' 
    // method to add a set which will only trigger once this 
    // client has disconnected by closing the app, 
    // losing internet, or any other means.
    userStatusDatabaseRef.onDisconnect().set(isOffline).then(function () {
        // The promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect() 
        // request, NOT once we've actually disconnected:
        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

        // We can now safely set ourselves as "online" knowing that the
        // server will mark us as offline once we lose connection.
        userStatusDatabaseRef.set(isOnline);
    });
});
// [END rtdb_presence]

// [START rtdb_and_local_fs_presence]
[START_EXCLUDE]
[END_EXCLUDE]
const userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`);
const userStatusFirestoreRef = firebase.firestore().doc(`/status/${uid}`);

firebase.database().ref(".info/connected").on("value", function (snapshot) {
    if (snapshot.val() == false) {
        return;
    };

    userStatusRef.onDisconnect().set(isOffline).then(function () {
        userStatusRef.set(isOnline);
    });
});
// [END rtdb_and_local_fs_presence]
