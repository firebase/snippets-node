const debug = require('debug')('firestore-snippets-node');

// [START firestore_deps]
const admin = require('firebase-admin');
// [END firestore_deps]

// We supress these logs when not in NODE_ENV=debug for cleaner Mocha output
let console = {log: debug};

function initializeApp() {
  process.env.GCLOUD_PROJECT = 'firestorebeta1test2';
  // [START initialize_app]

  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

  const db = admin.firestore();
  // [START_EXCLUDE]
  const settings = {timestampsInSnapshots: true};
  db.settings(settings);
  // [END_EXCLUDE]

  // [END initialize_app]
  return db;
}

function initializeAppFunctions() {
  process.env.GCLOUD_PROJECT = 'firestorebeta1test2';
  // [START initialize_app_functions]
  const admin = require('firebase-admin');  
  admin.initializeApp();

  let db = admin.firestore();

  // [END initialize_app_functions]
  return db;
}

function initializeAppSA() {
  // [START initialize_app_service_account]

  let serviceAccount = require('./path/to/serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  let db = admin.firestore();

  // [END initialize_app_service_account]
  return db;
}

function demoInitialize(db) {
  // [START demo_initialize]
  // Fetch data from Firestore
  db.collection('cities').get()
    .then(documentSet => {
      // Print the ID and contents of each document
      documentSet.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
      });
    })
    .catch(err => {
      // Error fetching documents
      console.log('Error', err);
    });
  // [END demo_initialize]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/quickstart
// ============================================================================

function quickstartAddData(db) {
  // [START add_lovelace]
  let docRef = db.collection('users').doc('alovelace');

  let setAda = docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });
  // [END add_lovelace]

  // [START add_turing]
  let aTuringRef = db.collection('users').doc('aturing');

  let setAlan = aTuringRef.set({
    'first': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 1912
  });
  // [END add_turing]

  return Promise.all([setAda, setAlan]);
}

function quickstartQuery(db) {
  // [START quickstart_query]
  // Realtime listens are not yet supported in the Node.js SDK
  let query = db.collection('users').where('born', '<', 1900)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  // [END quickstart_query]

  return query;
}

function quickstartListen(db) {
  // [START quickstart_listen]
  db.collection('users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
  // [END quickstart_listen]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/data-model
// ============================================================================

function basicReferences(db) {
  // [START doc_ref]
  let alovelaceDocumentRef = db.collection('users').doc('alovelace');
  // [END doc_ref]

  // [START collection_ref]
  let usersCollectionRef = db.collection('users');
  // [END collection_ref]
}

function advancedReferences(db) {
  // [START doc_ref_alternate]
  let alovelaceDocumentRef = db.doc('users/alovelace');
  // [END doc_ref_alternate]

  // [START subcollection_ref]
  let messageRef = db.collection('rooms').doc('roomA')
    .collection('messages').doc('message1');
  // [END subcollection_ref]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/save-data
// ============================================================================

function setDocument(db) {
  // [START set_document]
  let data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
  };

  // Add a new document in collection "cities" with ID 'LA'
  let setDoc = db.collection('cities').doc('LA').set(data);
  // [END set_document]

  return setDoc.then(res => {
    console.log('Set: ', res);
  });
}

function dataTypes(db) {
  // [START data_types]
  let data = {
    stringExample: 'Hello, World!',
    booleanExample: true,
    numberExample: 3.14159265,
    dateExample: admin.firestore.Timestamp.fromDate(new Date('December 10, 1815')),
    arrayExample: [5, true, 'hello'],
    nullExample: null,
    objectExample: {
      a: 5,
      b: true
    }
  };

  let setDoc = db.collection('data').doc('one').set(data);
  // [END data_types]

  return setDoc.then(res => {
    console.log('Set: ', res);
  });
}

function addDocument(db) {
  // [START add_document]
  // Add a new document with a generated id.
  let addDoc = db.collection('cities').add({
    name: 'Tokyo',
    country: 'Japan'
  }).then(ref => {
    console.log('Added document with ID: ', ref.id);
  });
  // [END add_document]

  return addDoc.then(res => {
    console.log('Add: ', res);
  });
}

function addDocumentWithId(db) {
  let data = {foo: 'bar '};

  // [START add_document_id]
  db.collection('cities').doc('new-city-id').set(data);
  // [END add_document_id]
}

function addLater(db) {
  // [START add_later]
  let newCityRef = db.collection('cities').doc();

  // Later...
  let setDoc = newCityRef.set({
    // ...
  });
  // [END add_later]

  return setDoc.then(res => {
    console.log('Add: ', res);
  });
}

function updateDocument(db) {
  // [START update_document]
  let cityRef = db.collection('cities').doc('DC');

  // Set the 'capital' field of the city
  let updateSingle = cityRef.update({capital: true});
  // [END update_document]

  return Promise.all([updateSingle]).then(res => {
    console.log('Update: ', res);
  });
}

function updateDocumentArray(db) {
  // [START update_document_array]
  let admin = require('firebase-admin');
  // ...
  let washingtonRef = db.collection('cities').doc('DC');

  // Atomically add a new region to the "regions" array field.
  let arrUnion = washingtonRef.update({
    regions: admin.firestore.FieldValue.arrayUnion('greater_virginia')
  });
  // Atomically remove a region from the "regions" array field.
  let arrRm = washingtonRef.update({
    regions: admin.firestore.FieldValue.arrayRemove('east_coast')
  });
  // [END update_document_array]

  return Promise.all([arrUnion, arrRm]).then(res => {
    console.log('Update array: ', res);
  });
}

function updateDocumentIncrement(db) {
  // [START update_document_increment]
  let admin = require('firebase-admin');
  // ...
  let washingtonRef = db.collection('cities').doc('DC');

  // Atomically increment the population of the city by 50.
  let popIncrement = washingtonRef.update({
    population: admin.firestore.FieldValue.increment(50)
  });
  // [END update_document_increment]

  return popIncrement.then(res => {
    console.log('Increment: ' + res);
  });
}

function updateDocumentMany(db) {
  // [START update_document_many]
  let cityRef = db.collection('cities').doc('DC');

  let updateMany = cityRef.update({
    name: 'Washington D.C.',
    country: 'USA',
    capital: true
  });
  // [END update_document_many]

  return updateMany.then(res => {
    console.log('Update: ', res);
  });
}

function updateCreateIfMissing(db) {
  // [START update_create_if_missing]
  let cityRef = db.collection('cities').doc('BJ');

  let setWithOptions = cityRef.set({
    capital: true
  }, {merge: true});
  // [END update_create_if_missing]

  return setWithOptions.then(res => {
    console.log('Update: ', res);
  });
}

async function updateServerTimestamp(db) {
  // Create the object before updating it
  await db.collection('objects').doc('some-id').set({});

  // [START update_with_server_timestamp]
  // Get the `FieldValue` object
  let FieldValue = require('firebase-admin').firestore.FieldValue;

  // Create a document reference
  let docRef = db.collection('objects').doc('some-id');

  // Update the timestamp field with the value from the server
  let updateTimestamp = docRef.update({
    timestamp: FieldValue.serverTimestamp()
  });
  // [END update_with_server_timestamp]

  return updateTimestamp.then(res => {
    console.log('Update: ', res);
  });
}

function updateDeleteField(db) {
  // [START update_delete_field]
  // Get the `FieldValue` object
  let FieldValue = require('firebase-admin').firestore.FieldValue;

  // Create a document reference
  let cityRef = db.collection('cities').doc('BJ');

  // Remove the 'capital' field from the document
  let removeCapital = cityRef.update({
    capital: FieldValue.delete()
  });
  // [END update_delete_field]

  return removeCapital.then(res => {
    console.log('Update: ', res);
  });
}

async function updateNested(db) {
  // [START update_nested]
  let initialData = {
    name: 'Frank',
    age: 12,
    favorites: {
      food: 'Pizza',
      color: 'Blue',
      subject: 'recess'
    }
  };

  // [START_EXCLUDE]
  await db.collection('users').doc('Frank').set(initialData);
  // [END_EXCLUDE]
  let updateNested = db.collection('users').doc('Frank').update({
    age: 13,
    'favorites.color': 'Red'
  });
  // [END update_nested]

  return updateNested.then(res => {
    console.log('Update: ', res);
  });
}

function deleteDocument(db) {
  // [START delete_document]
  let deleteDoc = db.collection('cities').doc('DC').delete();
  // [END delete_document]

  return deleteDoc.then(res => {
    console.log('Delete: ', res);
  });
}

function transaction(db) {
  // [START transaction]
  // Initialize document
  let cityRef = db.collection('cities').doc('SF');
  let setCity = cityRef.set({
    name: 'San Francisco',
    state: 'CA',
    country: 'USA',
    capital: false,
    population: 860000
  });

  let transaction = db.runTransaction(t => {
    return t.get(cityRef)
      .then(doc => {
        // Add one person to the city population.
        // Note: this could be done without a transaction
        //       by updating the population using FieldValue.increment()
        let newPopulation = doc.data().population + 1;
        t.update(cityRef, {population: newPopulation});
      });
  }).then(result => {
    console.log('Transaction success!');
  }).catch(err => {
    console.log('Transaction failure:', err);
  });
  // [END transaction]

  return transaction;
}

function transactionWithResult(db) {
  // [START transaction_with_result]
  let cityRef = db.collection('cities').doc('SF');
  let transaction = db.runTransaction(t => {
    return t.get(cityRef)
      .then(doc => {
        let newPopulation = doc.data().population + 1;
        if (newPopulation <= 1000000) {
          t.update(cityRef, {population: newPopulation});
          return Promise.resolve('Population increased to ' + newPopulation);
        } else {
          return Promise.reject('Sorry! Population is too big.');
        }
      });
  }).then(result => {
    console.log('Transaction success', result);
  }).catch(err => {
    console.log('Transaction failure:', err);
  });
  // [END transaction_with_result]

  return transaction;
}

function updateBatch(db) {
  // [START update_data_batch]
  // Get a new write batch
  let batch = db.batch();

  // Set the value of 'NYC'
  let nycRef = db.collection('cities').doc('NYC');
  batch.set(nycRef, {name: 'New York City'});

  // Update the population of 'SF'
  let sfRef = db.collection('cities').doc('SF');
  batch.update(sfRef, {population: 1000000});

  // Delete the city 'LA'
  let laRef = db.collection('cities').doc('LA');
  batch.delete(laRef);

  // Commit the batch
  return batch.commit().then(function () {
    // [START_EXCLUDE]
    console.log('Batched.');
    // [END_EXCLUDE]
  });
  // [END update_data_batch]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/retrieve-data
// ============================================================================

function exampleData(db) {
  // [START example_data]
  let citiesRef = db.collection('cities');

  let setSf = citiesRef.doc('SF').set({
    name: 'San Francisco', state: 'CA', country: 'USA',
    capital: false, population: 860000,
    regions: ['west_coast', 'norcal']
  });
  let setLa = citiesRef.doc('LA').set({
    name: 'Los Angeles', state: 'CA', country: 'USA',
    capital: false, population: 3900000,
    regions: ['west_coast', 'socal']
  });
  let setDc = citiesRef.doc('DC').set({
    name: 'Washington, D.C.', state: null, country: 'USA',
    capital: true, population: 680000,
    regions: ['east_coast']
  });
  let setTok = citiesRef.doc('TOK').set({
    name: 'Tokyo', state: null, country: 'Japan',
    capital: true, population: 9000000,
    regions: ['kanto', 'honshu']
  });
  let setBj = citiesRef.doc('BJ').set({
    name: 'Beijing', state: null, country: 'China',
    capital: true, population: 21500000,
    regions: ['jingjinji', 'hebei']
  });
  // [END example_data]

  return Promise.all([setSf, setLa, setDc, setTok, setBj]);
}

function exampleDataTwo(db) {
  // [START example_data_two]
  const citiesRef = db.collection('cities');

  let setSf = citiesRef.doc('SF').set({
    name: 'San Francisco', state: 'CA', country: 'USA',
    capital: false, population: 860000
  });
  let setLa = citiesRef.doc('LA').set({
    name: 'Los Angeles', state: 'CA', country: 'USA',
    capital: false, population: 3900000
  });
  let setDc = citiesRef.doc('DC').set({
    name: 'Washington, D.C.', state: null, country: 'USA',
    capital: true, population: 680000
  });
  let setTok = citiesRef.doc('TOK').set({
    name: 'Tokyo', state: null, country: 'Japan',
    capital: true, population: 9000000
  });
  let setBj = citiesRef.doc('BJ').set({
    name: 'Beijing', state: null, country: 'China',
    capital: true, population: 21500000
  });
  // [END example_data_two]

  return Promise.all([setSf, setLa, setDc, setTok, setBj]);
}

function getDocument(db) {
  // [START get_document]
  let cityRef = db.collection('cities').doc('SF');
  let getDoc = cityRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  // [END get_document]

  return getDoc;
}

function getDocumentEmpty(db) {
  let cityRef = db.collection('cities').doc('Amexico');
  let getDoc = cityRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
      }
    });

  return getDoc;
}

function getMultiple(db) {
  // [START get_multiple]
  let citiesRef = db.collection('cities');
  let query = citiesRef.where('capital', '==', true).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  
      
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  // [END get_multiple]

  return query;
}

function getAll(db) {
  // [START get_all]
  let citiesRef = db.collection('cities');
  let allCities = citiesRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  // [END get_all]

  return allCities;
}

function getCollections(db) {
  // [START get_collections]
  let sfRef = db.collection('cities').doc('SF');
  sfRef.listCollections().then(collections => {
    collections.forEach(collection => {
      console.log('Found subcollection with id:', collection.id);
    });
  });
  // [END get_collections]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/query-data
// ============================================================================

function simpleQuery(db) {
  // [START simple_query]
  // Create a reference to the cities collection
  let citiesRef = db.collection('cities');

  // Create a query against the collection
  let queryRef = citiesRef.where('state', '==', 'CA');
  // [END simple_query]

  return queryRef.get()
    .then(res => {
      res.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
      });
    });
}

function queryAndFilter(db) {
  // [START create_query]
  // Create a reference to the cities collection
  let citiesRef = db.collection('cities');

  // Create a query against the collection
  let queryRef = citiesRef.where('capital', '==', true);
  // [END create_query]

  // [START example_filters]
  let stateQuery = citiesRef.where('state', '==', 'CA');
  let populationQuery = citiesRef.where('population', '<', 1000000);
  let nameQuery = citiesRef.where('name', '>=', 'San Francisco');
  // [END example_filters]

  return Promise.all([stateQuery.get(), populationQuery.get(), nameQuery.get()])
    .then(res => {
      res.forEach(r => {
        r.forEach(d => {
          console.log('Get:', d);
        });
        console.log();
      });
    });
}

function arrayFilter(db) {
  let citiesRef = db.collection('cities');
  // [START array_contains_filter]
  let westCoastCities = citiesRef.where('regions', 'array-contains',
    'west_coast');
  // [END array_contains_filter]

  return westCoastCities.get()
    .then(res => {
      console.log('West Coast get: ', res);
    });
}

function arrayContainsAnyQueries(db) {
  const citiesRef = db.collection('cities');
  // [START array_contains_any_filter]
  const coastalCities = citiesRef.where('regions', 'array-contains-any',
      ['west_coast', 'east_coast']);
  // [END array_contains_any_filter]

  return coastalCities.get()
    .then(res => {
      console.log('Coastal cities get: ', res);
    });
}

function inQueries(db) {
  const citiesRef = db.collection('cities');
  // [START in_filter]
  const usaOrJapan = citiesRef.where('country', 'in', ['USA', 'Japan']);
  // [END in_filter]

  // [START in_filter_with_array]
  const exactlyOneCoast = citiesRef.where('region', 'in',
      [['west_coast', 'east_coast']]);
  // [END in_filter_with_array]

  const inGet = usaOrJapan.get()
      .then(res => {
        console.log('USA or Japan get: ', res);
      });

  const inArrayGet = exactlyOneCoast.get()
    .then(res => {
      console.log('Exactly One Coast get: ', res);
    });

  return Promise.all([inGet, inArrayGet]);
}

function orderAndLimit(db) {
  let citiesRef = db.collection('cities');
  // [START order_limit]
  let firstThree = citiesRef.orderBy('name').limit(3);
  // [END order_limit]

  // [START order_limit_desc]
  let lastThree = citiesRef.orderBy('name', 'desc').limit(3);
  // [END order_limit_desc]

  // [START order_multi_field]
  let byStateByPop = citiesRef.orderBy('state').orderBy('population', 'desc');
  // [END order_multi_field]

  // [START where_and_order]
  let biggest = citiesRef.where('population', '>', 2500000)
    .orderBy('population').limit(2);
  // [END where_and_order]

  return Promise.all([firstThree.get(), lastThree.get(), biggest.get()])
    .then(res => {
      res.forEach(r => {
        r.forEach(d => {
          console.log('Get:', d);
        });
        console.log();
      });
    });
}

function validInvalidQueries(db) {
  let citiesRef = db.collection('cities');

  // [START valid_chained]
  citiesRef.where('state', '==', 'CO').where('name', '==', 'Denver');
  // [END valid_chained]

  // [START invalid_chained]
  citiesRef.where('state', '==', 'CA').where('population', '<', 1000000);
  // [END invalid_chained]

  // [START valid_range]
  citiesRef.where('state', '>=', 'CA').where('state', '<=', 'IN');
  citiesRef.where('state', '==', 'CA').where('population', '>', 1000000);
  // [END valid_range]

  // [START invalid_range]
  citiesRef.where('state', '>=', 'CA').where('population', '>', 1000000);
  // [END invalid_range]

  // [START valid_order_by]
  citiesRef.where('population', '>', 2500000).orderBy('population');
  // [END valid_order_by]

  // [START invalid_order_by]
  citiesRef.where('population', '>', 2500000).orderBy('country');
  // [END invalid_order_by]
}

function streamSnapshot(db, done) {
  // [START query_realtime]
  let query = db.collection('cities').where('state', '==', 'CA');

  let observer = query.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    // [START_EXCLUDE]
    observer();
    done();
    // [END_EXCLUDE]
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
  // [END query_realtime]
}

function listenDiffs(db, done) {
  // [START listen_diffs]
  let observer = db.collection('cities').where('state', '==', 'CA')
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('New city: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Modified city: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed city: ', change.doc.data());
        }
      });
      // [START_EXCLUDE silent]
      observer();
      done();
      // [END_EXCLUDE]
    });
  // [END listen_diffs]
}

function streamDocument(db, done) {
  // [START doc_realtime]
  let doc = db.collection('cities').doc('SF');

  let observer = doc.onSnapshot(docSnapshot => {
    console.log(`Received doc snapshot: ${docSnapshot}`);
    // [START_EXCLUDE]
    observer();
    done();
    // [END_EXCLUDE]
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
  // [END doc_realtime]
}

function detatchListener(db) {
  // [START detach_listener]
  let unsub = db.collection('cities').onSnapshot(() => {
  });

  // ...

  // Stop listening for changes
  unsub();
  // [END detach_listener]
}

function listenErrors(db) {
  // [START listen_errors]
  db.collection('cities')
    .onSnapshot((snapshot) => {
      //...
    }, (error) => {
      //...
    });
  // [END listen_errors]
}

function collectionGroupQuery(db) {
  // [START fs_collection_group_query_data_setup]
  let citiesRef = db.collection('cities');

  let landmarks = Promise.all([
    citiesRef.doc('SF').collection('landmarks').doc().set({
      name: 'Golden Gate Bridge',
      type: 'bridge'
    }),
    citiesRef.doc('SF').collection('landmarks').doc().set({
      name: 'Legion of Honor',
      type: 'museum'
    }),
    citiesRef.doc('LA').collection('landmarks').doc().set({
      name: 'Griffith Park',
      type: 'park'
    }),
    citiesRef.doc('LA').collection('landmarks').doc().set({
      name: 'The Getty',
      type: 'museum'
    }),
    citiesRef.doc('DC').collection('landmarks').doc().set({
      name: 'Lincoln Memorial',
      type: 'memorial'
    }),
    citiesRef.doc('DC').collection('landmarks').doc().set({
      name: 'National Air and Space Museum',
      type: 'museum'
    }),
    citiesRef.doc('TOK').collection('landmarks').doc().set({
      name: 'Ueno Park',
      type: 'park'
    }),
    citiesRef.doc('TOK').collection('landmarks').doc().set({
      name: 'National Museum of Nature and Science',
      type: 'museum'
    }),
    citiesRef.doc('BJ').collection('landmarks').doc().set({
      name: 'Jingshan Park',
      type: 'park'
    }),
    citiesRef.doc('BJ').collection('landmarks').doc().set({ 
      name: 'Beijing Ancient Observatory',
      type: 'museum'
    })
  ]);
  // [END fs_collection_group_query_data_setup]
  landmarks.then((l) => console.log(l));

  // [START fs_collection_group_query]
  let museums = db.collectionGroup('landmarks').where('type', '==', 'museum');
  museums.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
  // [END fs_collection_group_query]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/query-data/query-cursors
// ============================================================================

function simpleCursors(db) {
  // [START cursor_simple_start_at]
  let startAt = db.collection('cities')
    .orderBy('population')
    .startAt(1000000);
  // [END cursor_simple_start_at]

  // [START cursor_simple_end_at]
  let endAt = db.collection('cities')
    .orderBy('population')
    .endAt(1000000);
  // [END cursor_simple_end_at]

  return Promise.all([
    startAt.limit(10).get(),
    endAt.limit(10).get()
  ]);
}

function snapshotCursors(db) {
  // [START fs_start_at_snapshot_query_cursor]
  let docRef = db.collection('cities').doc('SF');
  return docRef.get().then(snapshot => {
    let startAtSnapshot = db.collection('cities')
      .orderBy('population')
      .startAt(snapshot);

    return startAtSnapshot.limit(10).get();
  });
  // [END fs_start_at_snapshot_query_cursor]
}

function paginateQuery(db) {
  // [START cursor_paginate]
  let first = db.collection('cities')
    .orderBy('population')
    .limit(3);

  let paginate = first.get()
    .then((snapshot) => {
      // ...

      // Get the last document
      let last = snapshot.docs[snapshot.docs.length - 1];

      // Construct a new query starting at this document.
      // Note: this will not have the desired effect if multiple
      // cities have the exact same population value.
      let next = db.collection('cities')
        .orderBy('population')
        .startAfter(last.data().population)
        .limit(3);

      // Use the query for pagination
      // [START_EXCLUDE]
      return next.get().then((snapshot) => {
        console.log('Num results:', snapshot.docs.length);
      });
      // [END_EXCLUDE]
    });
  // [END cursor_paginate]

  return paginate;
}

function multipleCursorConditions(db) {
  // [START cursor_multiple_one_start]
  // Will return all Springfields
  let startAtName = db.collection('cities')
    .orderBy('name')
    .orderBy('state')
    .startAt('Springfield');
  // [END cursor_multiple_one_start]

  // [START cursor_multiple_two_start]
  // Will return 'Springfield, Missouri' and 'Springfield, Wisconsin'
  let startAtNameAndState = db.collection('cities')
    .orderBy('name')
    .orderBy('state')
    .startAt('Springfield', 'Missouri');
  // [END cursor_multiple_two_start]

  return Promise.all([
    startAtName.get(),
    startAtNameAndState.get()
  ]);
}

// [START delete_collection]
function deleteCollection(db, collectionPath, batchSize) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve, reject);
  });
}

function deleteQueryBatch(db, query, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    }).then((numDeleted) => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, resolve, reject);
      });
    })
    .catch(reject);
}

// [END delete_collection]

// ============================================================================
// MAIN
// ============================================================================

describe('Firestore Smoketests', () => {

  admin.initializeApp();
  const db = admin.firestore();

  it('should get an empty document', () => {
    return getDocumentEmpty(db);
  });

  it('should delete existing documents', () => {
    return deleteCollection(db, 'cities', 50);
  });

  it('should store example data', () => {
    return exampleData(db);
  });

  it('should add quickstart data', () => {
    return quickstartAddData(db);
  });

  it('should query quickstart data', () => {
    return quickstartQuery(db);
  });

  it('should set a document', () => {
    return setDocument(db);
  });

  it('should manage data types', () => {
    return dataTypes(db);
  });

  it('should add a document', () => {
    return addDocument(db);
  });

  it('should add a document later', () => {
    return addLater(db);
  });

  it('should update a document', () => {
    return updateDocument(db);
  });

  it('should update array fields in a document', () => {
    return updateDocumentArray(db);
  });

  it('should update a document using numeric transforms', () => {
    return updateDocumentIncrement(db);
  });

  it('should update many documents', () => {
    return updateDocumentMany(db);
  });

  it('should update a missing doc', () => {
    return updateCreateIfMissing(db);
  });

  it('should update with server timestamp', () => {
    return updateServerTimestamp(db);
  });

  it('should handle transactions', () => {
    return transaction(db);
  });

  it('should handle transaction with a result', () => {
    return transactionWithResult(db).then(res => {
      // Delete data set
      return deleteCollection(db, 'cities', 50);
    });
  });

  it('should set more example data', () => {
    return exampleDataTwo(db);
  });

  it('should get document', () => {
    return getDocument(db);
  });

  it('should get multiple documents', () => {
    return getMultiple(db);
  });

  it('should get all documents', () => {
    return getAll(db);
  });

  it('should get all subcollections of a document', () => {
    getCollections(db);
  });

  it('should simple query', () => {
    return simpleQuery(db);
  });

  it('should query and filter', () => {
    return queryAndFilter(db);
  });

  it('should query and filter an array', () => {
    return arrayFilter(db);
  });

  it('should support array contains any', () => {
    return arrayContainsAnyQueries(db);
  });

  it('should support in queries', () => {
    return inQueries(db);
  });

  it('should order and limit', () => {
    return orderAndLimit(db);
  });

  it('should update and delete a field', () => {
    return updateDeleteField(db);
  });

  it('should update nested fields', () => {
    return updateNested(db);
  });

  it('should update in a batch', () => {
    updateBatch(db);
  });

  it('should delete doucment', () => {
    return deleteDocument(db);
  });

  it('should stream query data', (done) => {
    return streamSnapshot(db, done);
  });

  it('should listen with diffs', (done) => {
    return listenDiffs(db, done);
  });

  it('should stream doc data', (done) => {
    return streamDocument(db, done);
  });

  it('should support simple cursors', () => {
    return simpleCursors(db);
  });

  it('should support snapshot cursors', () => {
    return snapshotCursors(db);
  });

  it('should support pagination', () => {
    return paginateQuery(db);
  });

  it('should support multiple cursor conditions', () => {
    return multipleCursorConditions(db);
  });

  it('should delete the whole collection', () => {
    return deleteCollection(db, 'cities', 50);
  });

  it('should find all museums when querying a collection group', () => {
    return collectionGroupQuery(db);
  });
});
