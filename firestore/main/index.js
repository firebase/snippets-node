const debug = require('debug')('firestore-snippets-node');

// [START firestore_deps]
const admin = require('firebase-admin');
// [END firestore_deps]

// We supress these logs when not in NODE_ENV=debug for cleaner Mocha output
const console = {log: debug};

async function initializeApp() {
  process.env.GCLOUD_PROJECT = 'firestorebeta1test2';
  // [START initialize_app]

  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

  const db = admin.firestore();
  // [END initialize_app]
  return db;
}

async function initializeAppFunctions() {
  process.env.GCLOUD_PROJECT = 'firestorebeta1test2';
  // [START initialize_app_functions]
  admin.initializeApp();

  const db = admin.firestore();

  // [END initialize_app_functions]
  return db;
}

async function initializeAppSA() {
  // [START initialize_app_service_account]

  const serviceAccount = require('./path/to/serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();

  // [END initialize_app_service_account]
  return db;
}

async function demoInitialize(db) {
  // [START demo_initialize]
  // Fetch data from Firestore
  const snapshot = await db.collection('cities').get();

  // Print the ID and contents of each document
  snapshot.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
  });
  // [END demo_initialize]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/quickstart
// ============================================================================

async function quickstartAddData(db) {
  // [START add_lovelace]
  const docRef = db.collection('users').doc('alovelace');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });
  // [END add_lovelace]

  // [START add_turing]
  const aTuringRef = db.collection('users').doc('aturing');

  await aTuringRef.set({
    'first': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 1912
  });
  // [END add_turing]
}

async function quickstartQuery(db) {
  // [START quickstart_query]
  // Realtime listens are not yet supported in the Node.js SDK
  const snapshot = await db.collection('users').where('born', '<', 1900).get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END quickstart_query]
}

async function quickstartListen(db) {
  // [START quickstart_listen]
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END quickstart_listen]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/data-model
// ============================================================================

async function basicReferences(db) {
  // [START doc_ref]
  const alovelaceDocumentRef = db.collection('users').doc('alovelace');
  // [END doc_ref]

  // [START collection_ref]
  const usersCollectionRef = db.collection('users');
  // [END collection_ref]
}

async function advancedReferences(db) {
  // [START doc_ref_alternate]
  const alovelaceDocumentRef = db.doc('users/alovelace');
  // [END doc_ref_alternate]

  // [START subcollection_ref]
  const messageRef = db.collection('rooms').doc('roomA')
    .collection('messages').doc('message1');
  // [END subcollection_ref]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/save-data
// ============================================================================

async function setDocument(db) {
  // [START set_document]
  const data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
  };

  // Add a new document in collection "cities" with ID 'LA'
  const res = await db.collection('cities').doc('LA').set(data);
  // [END set_document]

  console.log('Set: ', res);
}

async function dataTypes(db) {
  // [START data_types]
  const data = {
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

  const res = await db.collection('data').doc('one').set(data);
  // [END data_types]

  console.log('Set: ', res);
}

async function addDocument(db) {
  // [START add_document]
  // Add a new document with a generated id.
  const res = await db.collection('cities').add({
    name: 'Tokyo',
    country: 'Japan'
  });

  console.log('Added document with ID: ', res.id);
  // [END add_document]

  console.log('Add: ', res);
}

async function addDocumentWithId(db) {
  const data = {foo: 'bar '};

  // [START add_document_id]
  await db.collection('cities').doc('new-city-id').set(data);
  // [END add_document_id]
}

async function addLater(db) {
  // [START add_later]
  const newCityRef = db.collection('cities').doc();

  // Later...
  const res = await newCityRef.set({
    // ...
  });
  // [END add_later]
  console.log('Add: ', res);
}

async function updateDocument(db) {
  // [START update_document]
  const cityRef = db.collection('cities').doc('DC');

  // Set the 'capital' field of the city
  const res = await cityRef.update({capital: true});
  // [END update_document]

  console.log('Update: ', res);
}

async function updateDocumentArray(db) {
  // [START update_document_array]
  const admin = require('firebase-admin');
  // ...
  const washingtonRef = db.collection('cities').doc('DC');

  // Atomically add a new region to the "regions" array field.
  const unionRes = await washingtonRef.update({
    regions: admin.firestore.FieldValue.arrayUnion('greater_virginia')
  });
  // Atomically remove a region from the "regions" array field.
  const removeRes = await washingtonRef.update({
    regions: admin.firestore.FieldValue.arrayRemove('east_coast')
  });
  // [END update_document_array]

  console.log('Update array: ', unionRes, removeRes);
}

async function updateDocumentIncrement(db) {
  // [START update_document_increment]
  const admin = require('firebase-admin');
  // ...
  const washingtonRef = db.collection('cities').doc('DC');

  // Atomically increment the population of the city by 50.
  const res = await washingtonRef.update({
    population: admin.firestore.FieldValue.increment(50)
  });
  // [END update_document_increment]

  console.log('Increment: ' + res);
}

async function updateDocumentMany(db) {
  // [START update_document_many]
  const cityRef = db.collection('cities').doc('DC');

  const res = await cityRef.update({
    name: 'Washington D.C.',
    country: 'USA',
    capital: true
  });
  // [END update_document_many]

  console.log('Update: ', res);
}

async function updateCreateIfMissing(db) {
  // [START update_create_if_missing]
  const cityRef = db.collection('cities').doc('BJ');

  const res = await cityRef.set({
    capital: true
  }, { merge: true });
  // [END update_create_if_missing]

  console.log('Update: ', res);
}

async function updateServerTimestamp(db) {
  const admin = require('firebase-admin');

  // Create the object before updating it
  await db.collection('objects').doc('some-id').set({});

  // [START update_with_server_timestamp]
  // Get the `FieldValue` object
  const FieldValue = admin.firestore.FieldValue;

  // Create a document reference
  const docRef = db.collection('objects').doc('some-id');

  // Update the timestamp field with the value from the server
  const res = await docRef.update({
    timestamp: FieldValue.serverTimestamp()
  });
  // [END update_with_server_timestamp]

  console.log('Update: ', res);
}

async function updateDeleteField(db) {
  const admin = require('firebase-admin');
  // [START update_delete_field]
  // Get the `FieldValue` object
  const FieldValue = admin.firestore.FieldValue;

  // Create a document reference
  const cityRef = db.collection('cities').doc('BJ');

  // Remove the 'capital' field from the document
  const res = await cityRef.update({
    capital: FieldValue.delete()
  });
  // [END update_delete_field]

  console.log('Update: ', res);
}

async function updateNested(db) {
  // [START update_nested]
  const initialData = {
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
  const res = await db.collection('users').doc('Frank').update({
    age: 13,
    'favorites.color': 'Red'
  });
  // [END update_nested]

  console.log('Update: ', res);
}

async function deleteDocument(db) {
  // [START delete_document]
  const res = await db.collection('cities').doc('DC').delete();
  // [END delete_document]

  console.log('Delete: ', res);
}

async function transaction(db) {
  // [START transaction]
  // Initialize document
  const cityRef = db.collection('cities').doc('SF');
  await cityRef.set({
    name: 'San Francisco',
    state: 'CA',
    country: 'USA',
    capital: false,
    population: 860000
  });

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(cityRef);
  
      // Add one person to the city population.
      // Note: this could be done without a transaction
      //       by updating the population using FieldValue.increment()
      const newPopulation = doc.data().population + 1;
      t.update(cityRef, {population: newPopulation});
    });

    console.log('Transaction success!');
  } catch (e) {
    console.log('Transaction failure:', e);
  }
  // [END transaction]
}

async function transactionWithResult(db) {
  // [START transaction_with_result]
  const cityRef = db.collection('cities').doc('SF');
  try {
    const res = await db.runTransaction(async t => {
      const doc = await t.get(cityRef);
      const newPopulation = doc.data().population + 1;
      if (newPopulation <= 1000000) {
        await t.update(cityRef, { population: newPopulation });
        return `Population increased to ${newPopulation}`;
      } else {
        throw 'Sorry! Population is too big.';
      }
    });
    console.log('Transaction success', res);
  } catch (e) {
    console.log('Transaction failure:', e);
  }
  // [END transaction_with_result]

  return transaction;
}

async function updateBatch(db) {
  // [START update_data_batch]
  // Get a new write batch
  const batch = db.batch();

  // Set the value of 'NYC'
  const nycRef = db.collection('cities').doc('NYC');
  batch.set(nycRef, {name: 'New York City'});

  // Update the population of 'SF'
  const sfRef = db.collection('cities').doc('SF');
  batch.update(sfRef, {population: 1000000});

  // Delete the city 'LA'
  const laRef = db.collection('cities').doc('LA');
  batch.delete(laRef);

  // Commit the batch
  await batch.commit();
  // [END update_data_batch]

  console.log('Batched.');
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/retrieve-data
// ============================================================================

async function exampleData(db) {
  // [START example_data]
  const citiesRef = db.collection('cities');

  await citiesRef.doc('SF').set({
    name: 'San Francisco', state: 'CA', country: 'USA',
    capital: false, population: 860000,
    regions: ['west_coast', 'norcal']
  });
  await citiesRef.doc('LA').set({
    name: 'Los Angeles', state: 'CA', country: 'USA',
    capital: false, population: 3900000,
    regions: ['west_coast', 'socal']
  });
  await citiesRef.doc('DC').set({
    name: 'Washington, D.C.', state: null, country: 'USA',
    capital: true, population: 680000,
    regions: ['east_coast']
  });
  await citiesRef.doc('TOK').set({
    name: 'Tokyo', state: null, country: 'Japan',
    capital: true, population: 9000000,
    regions: ['kanto', 'honshu']
  });
  await citiesRef.doc('BJ').set({
    name: 'Beijing', state: null, country: 'China',
    capital: true, population: 21500000,
    regions: ['jingjinji', 'hebei']
  });
  // [END example_data]
}

async function exampleDataTwo(db) {
  // [START example_data_two]
  const citiesRef = db.collection('cities');

  await citiesRef.doc('SF').set({
    name: 'San Francisco', state: 'CA', country: 'USA',
    capital: false, population: 860000
  });
  await citiesRef.doc('LA').set({
    name: 'Los Angeles', state: 'CA', country: 'USA',
    capital: false, population: 3900000
  });
  await citiesRef.doc('DC').set({
    name: 'Washington, D.C.', state: null, country: 'USA',
    capital: true, population: 680000
  });
  await citiesRef.doc('TOK').set({
    name: 'Tokyo', state: null, country: 'Japan',
    capital: true, population: 9000000
  });
  await citiesRef.doc('BJ').set({
    name: 'Beijing', state: null, country: 'China',
    capital: true, population: 21500000
  });
  // [END example_data_two]
}

async function getDocument(db) {
  // [START get_document]
  const cityRef = db.collection('cities').doc('SF');
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
  // [END get_document]
}

async function getDocumentEmpty(db) {
  const cityRef = db.collection('cities').doc('Amexico');
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
}

async function getMultiple(db) {
  // [START get_multiple]
  const citiesRef = db.collection('cities');
  const snapshot = await citiesRef.where('capital', '==', true).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }  

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END get_multiple]
}

async function getAll(db) {
  // [START get_all]
  const citiesRef = db.collection('cities');
  const snapshot = await citiesRef.get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END get_all]
}

async function getCollections(db) {
  // [START get_collections]
  const sfRef = db.collection('cities').doc('SF');
  const collections = await sfRef.listCollections();
  collections.forEach(collection => {
    console.log('Found subcollection with id:', collection.id);
  });
  // [END get_collections]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/query-data
// ============================================================================

async function simpleQuery(db) {
  // [START simple_query]
  // Create a reference to the cities collection
  const citiesRef = db.collection('cities');

  // Create a query against the collection
  const queryRef = citiesRef.where('state', '==', 'CA');
  // [END simple_query]

  const res = await queryRef.get();
  res.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
  });
}

async function queryAndFilter(db) {
  // [START create_query]
  // Create a reference to the cities collection
  const citiesRef = db.collection('cities');

  // Create a query against the collection
  const allCapitalsRes = await citiesRef.where('capital', '==', true).get();
  // [END create_query]

  // [START example_filters]
  const stateQueryRes = await citiesRef.where('state', '==', 'CA').get();
  const populationQueryRes = await citiesRef.where('population', '<', 1000000).get();
  const nameQueryRes = await citiesRef.where('name', '>=', 'San Francisco').get();
  // [END example_filters]

  // [START simple_query_not_equal]
  const capitalNotFalseRes = await citiesRef.where("capital", "!=", false);
  // [END simple_query_not_equal]

  for (const q of [stateQueryRes, populationQueryRes, nameQueryRes, capitalNotFalseRes]) {
    q.forEach(d => {
      console.log('Get: ', d);
    });
  }
}

async function arrayFilter(db) {
  const citiesRef = db.collection('cities');
  // [START array_contains_filter]
  const westCoastCities = citiesRef.where('regions', 'array-contains',
    'west_coast').get();
  // [END array_contains_filter]

  console.log('West Coast get: ', westCoastCities);
}

async function arrayContainsAnyQueries(db) {
  const citiesRef = db.collection('cities');
  // [START array_contains_any_filter]
  const coastalCities = await citiesRef.where('regions', 'array-contains-any',
      ['west_coast', 'east_coast']).get();
  // [END array_contains_any_filter]

  console.log('Coastal cities get: ', coastalCities);
}

async function inQueries(db) {
  const citiesRef = db.collection('cities');
  // [START in_filter]
  const usaOrJapan = await citiesRef.where('country', 'in', ['USA', 'Japan']).get();
  // [END in_filter]

  // [START not_in_filter]
  const notUsaOrJapan = await citiesRef.whereNotIn("country", ["USA", "Japan"]);s
  // [END not_in_filter]

  // [START in_filter_with_array]
  const exactlyOneCoast = await citiesRef.where('region', 'in',
      [['west_coast', 'east_coast']]).get();
  // [END in_filter_with_array]

  console.log('USA or Japan get: ', usaOrJapan);
  console.log('Not USA or Japan get: ', notUsaOrJapan);
  console.log('Exactly One Coast get: ', exactlyOneCoast);
}

async function orderAndLimit(db) {
  const citiesRef = db.collection('cities');
  // [START order_limit]
  const firstThreeRes = await citiesRef.orderBy('name').limit(3).get();
  // [END order_limit]

  // [START order_limit_desc]
  const lastThreeRes = await citiesRef.orderBy('name', 'desc').limit(3).get();
  // [END order_limit_desc]

  // [START order_multi_field]
  const byStateByPopRes = await citiesRef.orderBy('state').orderBy('population', 'desc').get();
  // [END order_multi_field]

  // [START where_and_order]
  const biggestRes = await citiesRef.where('population', '>', 2500000)
    .orderBy('population').limit(2).get();
  // [END where_and_order]

  for (const res of [firstThreeRes, lastThreeRes, byStateByPopRes, biggestRes]) {
    res.forEach(d => {
      console.log('Get:', d);
    });
  }
}

async function validInvalidQueries(db) {
  const citiesRef = db.collection('cities');

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

async function streamSnapshot(db, done) {
  // [START query_realtime]
  const query = db.collection('cities').where('state', '==', 'CA');

  const observer = query.onSnapshot(querySnapshot => {
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

async function listenDiffs(db, done) {
  // [START listen_diffs]
  const observer = db.collection('cities').where('state', '==', 'CA')
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

async function streamDocument(db, done) {
  // [START doc_realtime]
  const doc = db.collection('cities').doc('SF');

  const observer = doc.onSnapshot(docSnapshot => {
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

async function detatchListener(db) {
  // [START detach_listener]
  const unsub = db.collection('cities').onSnapshot(() => {
  });

  // ...

  // Stop listening for changes
  unsub();
  // [END detach_listener]
}

async function listenErrors(db) {
  // [START listen_errors]
  db.collection('cities')
    .onSnapshot((snapshot) => {
      //...
    }, (error) => {
      //...
    });
  // [END listen_errors]
}

async function collectionGroupQuery(db) {
  // [START fs_collection_group_query_data_setup]
  const citiesRef = db.collection('cities');

  await citiesRef.doc('SF').collection('landmarks').doc().set({
    name: 'Golden Gate Bridge',
    type: 'bridge'
  });
  await citiesRef.doc('SF').collection('landmarks').doc().set({
    name: 'Legion of Honor',
    type: 'museum'
  });
  await citiesRef.doc('LA').collection('landmarks').doc().set({
    name: 'Griffith Park',
    type: 'park'
  });
  await citiesRef.doc('LA').collection('landmarks').doc().set({
    name: 'The Getty',
    type: 'museum'
  });
  await citiesRef.doc('DC').collection('landmarks').doc().set({
    name: 'Lincoln Memorial',
    type: 'memorial'
  });
  await citiesRef.doc('DC').collection('landmarks').doc().set({
    name: 'National Air and Space Museum',
    type: 'museum'
  });
  await citiesRef.doc('TOK').collection('landmarks').doc().set({
    name: 'Ueno Park',
    type: 'park'
  });
  await citiesRef.doc('TOK').collection('landmarks').doc().set({
    name: 'National Museum of Nature and Science',
    type: 'museum'
  });
  await citiesRef.doc('BJ').collection('landmarks').doc().set({
    name: 'Jingshan Park',
    type: 'park'
  });
  await citiesRef.doc('BJ').collection('landmarks').doc().set({ 
    name: 'Beijing Ancient Observatory',
    type: 'museum'
  });
  // [END fs_collection_group_query_data_setup]

  // [START fs_collection_group_query]
  const querySnapshot = await db.collectionGroup('landmarks').where('type', '==', 'museum').get();
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });
  // [END fs_collection_group_query]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/query-data/query-cursors
// ============================================================================

async function simpleCursors(db) {
  // [START cursor_simple_start_at]
  const startAtRes = await db.collection('cities')
    .orderBy('population')
    .startAt(1000000)
    .get();
  // [END cursor_simple_start_at]

  // [START cursor_simple_end_at]
  const endAtRes = await db.collection('cities')
    .orderBy('population')
    .endAt(1000000)
    .get();
  // [END cursor_simple_end_at]
}

async function snapshotCursors(db) {
  // [START fs_start_at_snapshot_query_cursor]
  const docRef = db.collection('cities').doc('SF');
  const snapshot = await docRef.get();
  const startAtSnapshot = db.collection('cities')
    .orderBy('population')
    .startAt(snapshot);

  await startAtSnapshot.limit(10).get();
  // [END fs_start_at_snapshot_query_cursor]
}

async function paginateQuery(db) {
  // [START cursor_paginate]
  const first = db.collection('cities')
    .orderBy('population')
    .limit(3);

  const snapshot = await first.get();

  // Get the last document
  const last = snapshot.docs[snapshot.docs.length - 1];

  // Construct a new query starting at this document.
  // Note: this will not have the desired effect if multiple
  // cities have the exact same population value.
  const next = db.collection('cities')
    .orderBy('population')
    .startAfter(last.data().population)
    .limit(3);

  // Use the query for pagination
  // [START_EXCLUDE]
  const nextSnapshot = await next.get();
  console.log('Num results:', nextSnapshot.docs.length);
  // [END_EXCLUDE]
  // [END cursor_paginate]
}

async function multipleCursorConditions(db) {
  // [START cursor_multiple_one_start]
  // Will return all Springfields
  const startAtNameRes = await db.collection('cities')
    .orderBy('name')
    .orderBy('state')
    .startAt('Springfield')
    .get();
  // [END cursor_multiple_one_start]

  // [START cursor_multiple_two_start]
  // Will return 'Springfield, Missouri' and 'Springfield, Wisconsin'
  const startAtNameAndStateRes = await db.collection('cities')
    .orderBy('name')
    .orderBy('state')
    .startAt('Springfield', 'Missouri')
    .get();
  // [END cursor_multiple_two_start]
}

// [START delete_collection]
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
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
    streamSnapshot(db, done);
  });

  it('should listen with diffs', (done) => {
    listenDiffs(db, done);
  });

  it('should stream doc data', (done) => {
    streamDocument(db, done);
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
