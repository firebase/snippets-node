'use strict';
const admin = require('firebase-admin');
admin.initializeApp();

// [START build_user_list]
// Up to 1000 users can be imported at once.
const userImportRecords = [
  {
    uid: 'uid1',
    email: 'user1@example.com',
    passwordHash: Buffer.from('passwordHash1'),
    passwordSalt: Buffer.from('salt1'),
  },
  {
    uid: 'uid2',
    email: 'user2@example.com',
    passwordHash: Buffer.from('passwordHash2'),
    passwordSalt: Buffer.from('salt2'),
  },
  // ...
];
// [END build_user_list]

const userImportOptions = {
  hash: {
    algorithm: 'HMAC_SHA256',
    key: Buffer.from('secretKey'),
  },
};

// [START import_users]
admin
  .auth()
  .importUsers(userImportRecords, userImportOptions)
  .then(function(userImportResult) {
    // The number of successful imports is determined via: userImportResult.successCount.
    // The number of failed imports is determined via: userImportResult.failureCount.
    // To get the error details.
    userImportResult.forEach(function(indexedError) {
      // The corresponding user that failed to upload.
      console.log(
        userImportRecords[indexedError.index].uid + ' failed to import',
        indexedError.error
      );
    });
  })
  .catch(function(error) {
    // Some unrecoverable error occurred that prevented the operation from running.
  });
// [END import_users]

// [START import_with_hmac]
admin
  .auth()
  .importUsers(
    [
      {
        uid: 'some-uid',
        email: 'user@example.com',
        // Must be provided in a byte buffer.
        passwordHash: Buffer.from('password-hash'),
        // Must be provided in a byte buffer.
        passwordSalt: Buffer.from('salt'),
      },
    ],
    {
      hash: {
        algorithm: 'HMAC_SHA256',
        // Must be provided in a byte buffer.
        key: Buffer.from('secret'),
      },
    }
  )
  .then(function(results) {
    results.errors.forEach(function(indexedError) {
      console.log('Error importing user ' + indexedError.index);
    });
  })
  .catch(function(error) {
    console.log('Error importing users:', error);
  });
// [END import_with_hmac]

// [START import_with_pbkdf]
admin
  .auth()
  .importUsers(
    [
      {
        uid: 'some-uid',
        email: 'user@example.com',
        // Must be provided in a byte buffer.
        passwordHash: Buffer.from('password-hash'),
        // Must be provided in a byte buffer.
        passwordSalt: Buffer.from('salt'),
      },
    ],
    {
      hash: {
        algorithm: 'PBKDF2_SHA256',
        rounds: 100000,
      },
    }
  )
  .then(function(results) {
    results.errors.forEach(function(indexedError) {
      console.log('Error importing user ' + indexedError.index);
    });
  })
  .catch(function(error) {
    console.log('Error importing users:', error);
  });
// [END import_with_pbkdf]

// [START import_with_standard_scrypt]
admin
  .auth()
  .importUsers(
    [
      {
        uid: 'some-uid',
        email: 'user@example.com',
        // Must be provided in a byte buffer.
        passwordHash: Buffer.from('password-hash'),
        // Must be provided in a byte buffer.
        passwordSalt: Buffer.from('salt'),
      },
    ],
    {
      hash: {
        algorithm: 'STANDARD_SCRYPT',
        memoryCost: 1024,
        parallelization: 16,
        blockSize: 8,
        derivedKeyLength: 64,
      },
    }
  )
  .then(function(results) {
    results.errors.forEach(function(indexedError) {
      console.log('Error importing user ' + indexedError.index);
    });
  })
  .catch(function(error) {
    console.log('Error importing users:', error);
  });
// [END import_with_standard_scrypt]

// [START import_with_bcrypt]
admin
  .auth()
  .importUsers(
    [
      {
        uid: 'some-uid',
        email: 'user@example.com',
        // Must be provided in a byte buffer.
        passwordHash: Buffer.from('password-hash'),
      },
    ],
    {
      hash: {
        algorithm: 'BCRYPT',
      },
    }
  )
  .then(function(results) {
    results.errors.forEach(function(indexedError) {
      console.log('Error importing user ' + indexedError.index);
    });
  })
  .catch(function(error) {
    console.log('Error importing users:', error);
  });
// [END import_with_bcrypt]

// [START import_with_scrypt]
admin
  .auth()
  .importUsers(
    [
      {
        uid: 'some-uid',
        email: 'user@example.com',
        // Must be provided in a byte buffer.
        passwordHash: Buffer.from('base64-password-hash', 'base64'),
        // Must be provided in a byte buffer.
        passwordSalt: Buffer.from('base64-salt', 'base64'),
      },
    ],
    {
      hash: {
        algorithm: 'SCRYPT',
        // All the parameters below can be obtained from the Firebase Console's users section.
        // Must be provided in a byte buffer.
        key: Buffer.from('base64-secret', 'base64'),
        saltSeparator: Buffer.from('base64SaltSeparator', 'base64'),
        rounds: 8,
        memoryCost: 14,
      },
    }
  )
  .then(function(results) {
    results.errors.forEach(function(indexedError) {
      console.log('Error importing user ' + indexedError.index);
    });
  })
  .catch(function(error) {
    console.log('Error importing users:', error);
  });
// [END import_with_scrypt]

// [START import_without_password]
admin
  .auth()
  .importUsers([
    {
      uid: 'some-uid',
      displayName: 'John Doe',
      email: 'johndoe@gmail.com',
      photoURL: 'http://www.example.com/12345678/photo.png',
      emailVerified: true,
      phoneNumber: '+11234567890',
      // Set this user as admin.
      customClaims: {admin: true},
      // User with Google provider.
      providerData: [
        {
          uid: 'google-uid',
          email: 'johndoe@gmail.com',
          displayName: 'John Doe',
          photoURL: 'http://www.example.com/12345678/photo.png',
          providerId: 'google.com',
        },
      ],
    },
  ])
  .then(function(results) {
    results.errors.forEach(function(indexedError) {
      console.log('Error importing user ' + indexedError.index);
    });
  })
  .catch(function(error) {
    console.log('Error importing users:', error);
  });
// [END import_without_password]
