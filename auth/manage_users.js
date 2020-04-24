'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

const uid = 'some_uid_1234';
const uid1 = 'some_uid_1';
const uid2 = 'some_uid_2';
const uid3 = 'some_uid_3';
const email = 'someone@example.com';
const phoneNumber = '+15558675309';

// [START get_user_by_id]
admin.auth().getUser(uid)
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully fetched user data:', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
  });
// [END get_user_by_id]

// [START get_user_by_email]
admin.auth().getUserByEmail(email)
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully fetched user data:', userRecord.toJSON());
  })
  .catch(function(error) {
   console.log('Error fetching user data:', error);
  });
// [END get_user_by_email]

// [START get_user_by_phone]
admin.auth().getUserByPhoneNumber(phoneNumber)
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully fetched user data:', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
  });
// [END get_user_by_phone]

// [START get_user_by_federated_id]
admin.auth().getUserByProviderUid('google.com', 'google_uid1234')
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully fetched user data:', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
  });
// [END get_user_by_federated_id]

// [START bulk_get_users]
admin.auth().getUsers([
    { uid: 'uid1' },
    { email: 'user2@example.com' },
    { phoneNumber: '+15555550003' },
    { providerId: 'google.com', providerUid: 'google_uid4' },
  ])
  .then(function(getUsersResult) {
    console.log('Successfully fetched user data:');
    getUsersResult.users.forEach((userRecord) => {
      console.log(userRecord);
    });

    console.log('Unable to find users corresponding to these identifiers:');
    getUsersResult.notFound.forEach((userIdentifier) => {
      console.log(userIdentifier);
    });
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
  });
// [END bulk_get_users]

// [START create_user]
admin.auth().createUser({
  email: 'user@example.com',
  emailVerified: false,
  phoneNumber: '+11234567890',
  password: 'secretPassword',
  displayName: 'John Doe',
  photoURL: 'http://www.example.com/12345678/photo.png',
  disabled: false
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch(function(error) {
    console.log('Error creating new user:', error);
  });
  // [END create_user]

// [START create_user_with_uid]
admin.auth().createUser({
  uid: 'some-uid',
  email: 'user@example.com',
  phoneNumber: '+11234567890'
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch(function(error) {
    console.log('Error creating new user:', error);
  });
// [END create_user_with_uid]

// [START update_user]
admin.auth().updateUser(uid, {
  email: 'modifiedUser@example.com',
  phoneNumber: '+11234567890',
  emailVerified: true,
  password: 'newPassword',
  displayName: 'Jane Doe',
  photoURL: 'http://www.example.com/12345678/photo.png',
  disabled: true
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error updating user:', error);
  });
// [END update_user]

// [START update_user_link_federated]
// Link the user with a federated identity provider (like Google).
admin.auth().updateUser(uid, {
    providerToLink: {
      providerId: 'google.com',
      uid: 'google_uid12345'
    }
  })
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error updating user:', error);
  });
// [END update_user_link_federated]

// [START update_user_unlink_federated]
// Unlink the user from a federated identity provider (like Google).
admin.auth().updateUser(uid, {
    providersToDelete: ['google.com']
  })
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error updating user:', error);
  });
// [END update_user_unlink_federated]

// [START delete_user]
admin.auth().deleteUser(uid)
  .then(function() {
    console.log('Successfully deleted user');
  })
  .catch(function(error) {
    console.log('Error deleting user:', error);
  });
// [END delete_user]

// [START list_all_users]
function listAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        console.log('user', userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch(function(error) {
      console.log('Error listing users:', error);
    });
}
// Start listing users from the beginning, 1000 at a time.
listAllUsers();
// [END list_all_users]
