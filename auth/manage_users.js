'use strict';
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
initializeApp();

const uid = 'some_uid_1234';
const uid1 = 'some_uid_1';
const uid2 = 'some_uid_2';
const uid3 = 'some_uid_3';
const email = 'someone@example.com';
const phoneNumber = '+15558675309';

// [START get_user_by_id]
getAuth()
  .getUser(uid)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
// [END get_user_by_id]

// [START get_user_by_email]
getAuth()
  .getUserByEmail(email)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
// [END get_user_by_email]

// [START get_user_by_phone]
getAuth()
  .getUserByPhoneNumber(phoneNumber)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data:  ${userRecord.toJSON()}`);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
// [END get_user_by_phone]

// [START bulk_get_users]
getAuth()
  .getUsers([
    { uid: 'uid1' },
    { email: 'user2@example.com' },
    { phoneNumber: '+15555550003' },
    { providerId: 'google.com', providerUid: 'google_uid4' },
  ])
  .then((getUsersResult) => {
    console.log('Successfully fetched user data:');
    getUsersResult.users.forEach((userRecord) => {
      console.log(userRecord);
    });

    console.log('Unable to find users corresponding to these identifiers:');
    getUsersResult.notFound.forEach((userIdentifier) => {
      console.log(userIdentifier);
    });
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
// [END bulk_get_users]

// [START create_user]
getAuth()
  .createUser({
    email: 'user@example.com',
    emailVerified: false,
    phoneNumber: '+11234567890',
    password: 'secretPassword',
    displayName: 'John Doe',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  });
// [END create_user]

// [START create_user_with_uid]
getAuth()
  .createUser({
    uid: 'some-uid',
    email: 'user@example.com',
    phoneNumber: '+11234567890',
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully created new user:', userRecord.uid);
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
  });
// [END create_user_with_uid]

// [START update_user]
getAuth()
  .updateUser(uid, {
    email: 'modifiedUser@example.com',
    phoneNumber: '+11234567890',
    emailVerified: true,
    password: 'newPassword',
    displayName: 'Jane Doe',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: true,
  })
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch((error) => {
    console.log('Error updating user:', error);
  });
// [END update_user]

// [START delete_user]
getAuth()
  .deleteUser(uid)
  .then(() => {
    console.log('Successfully deleted user');
  })
  .catch((error) => {
    console.log('Error deleting user:', error);
  });
// [END delete_user]

// [START bulk_delete_users]
getAuth()
  .deleteUsers([uid1, uid2, uid3])
  .then((deleteUsersResult) => {
    console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
    console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
    deleteUsersResult.errors.forEach((err) => {
      console.log(err.error.toJSON());
    });
  })
  .catch((error) => {
    console.log('Error deleting users:', error);
  });
// [END bulk_delete_users]

// [START list_all_users]
const listAllUsers = (nextPageToken) => {
  // List batch of users, 1000 at a time.
  getAuth()
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        console.log('user', userRecord.toJSON());
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
};
// Start listing users from the beginning, 1000 at a time.
listAllUsers();
// [END list_all_users]
