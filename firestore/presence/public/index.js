// [START rtdb_presence]
// Fetch the current User ID from Firebase Authentication.
const uid = firebase.auth().currentUser.uid;

// Create a reference to this user's specific status node.
// This is where we will store data about being online/offline.
const userPresenceRef = firebase.database().ref(`/status/${uid}`);

// Create a reference to a special ".info/connected" path in 
// Realtime Database. This path returns `true` when connected
// and `false` when disconnected.
firebase.database().ref(".info/connected").on("value", function (snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) return;

    // If we are connected, then use the 'onDisconnect()' 
    // method to add a set will only trigger once this 
    // client has disconnected by closing the app, 
    // losing internet, or any other means.
    userPresenceRef.onDisconnect().set({
        state: "offline",
        last_seen: firebase.database.ServerValue.TIMESTAMP,
    }).then(function () {
        // The promise returned from .onDisconnect().set()
        // will resolve as soon as the server acknowledges
        // the onDisconnect() request, NOT once we've actually
        // disconnected.

        // We can now set ourselves as "online" knowing that the
        // server will mark us as offline once we lose connection.
        userPresenceRef.set({
            state: "online",
            last_seen: firebase.database.ServerValue.TIMESTAMP,
        });
    });
});
// [END rtdb_presence]