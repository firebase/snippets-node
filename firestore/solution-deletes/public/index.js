var firebase = firebase || {};

// [START call_delete_function]
/**
 * Call the 'recursiveDelete' callable function with a path to initiate
 * a server-side delete.
 */
function deleteAtPath(path) {
    var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
    deleteFn({ path: path })
        .then(function(result) {
            logMessage('Delete success: ' + JSON.stringify(result));
        })
        .catch(function(err) {
            logMessage('Delete failed, see console,');
            console.warn(err);
        });
}
// [END call_delete_function]

/**
 * Call the 'mintAdminToken' callable function to get a custom token that
 * makes us an admin user, then sign in.
 */
function signInAsAdmin() {
    var tokenFn = firebase.functions().httpsCallable('mintAdminToken');
    tokenFn({ uid: 'user1234' }).then(function (res) {
        return firebase.auth().signInWithCustomToken(res.data.token);
    });
}

/**
 * Helper function: set the signed-in state of the UI.
 */
function setSignedIn(signedIn) {
    if (signedIn) {
        logMessage('Signed in.');
    } else {
        logMessage('Not signed in.');
    }

    setEnabled('input-delete', signedIn);
    setEnabled('btn-delete', signedIn);
    setEnabled('btn-signin', !signedIn);
}

/**
 * Helper function: log a message to the UI.
 */
function logMessage(msg) {
    var msgLi = document.createElement('li');
    msgLi.innerText = msg;
    document.getElementById('log-list').appendChild(msgLi);
}

/**
 * Helper function: enable or disable a form element.
 */
function setEnabled(id, enabled) {
    if (enabled) {
        document.getElementById(id).removeAttribute('disabled');
    } else {
        document.getElementById(id).setAttribute('disabled', true);
    }
}

/**
 * Set up the UI:
 *   - Click listeners.
 *   - Auth state listener.
 */
document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  });

  document.getElementById('btn-delete').addEventListener('click', function() {
    var deleteInput = document.getElementById('input-delete');
    var deletePath = deleteInput.value;
    deleteAtPath(deletePath);
  });

  document.getElementById('btn-signin').addEventListener('click', function() {
    signInAsAdmin();
  });
});
