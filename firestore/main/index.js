const debug = require('debug')('firestore-snippets-node');

// [START firestore_deps]
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
// [END firestore_deps]


// We supress these logs when not in NODE_ENV=debug for cleaner Mocha output
const console = {log: debug};

async function initializeAppWithProjectId() {
  // [START firestore_setup_client_create]
  const admin = require('firebase-admin');

  initializeApp({
    // The `projectId` parameter is optional and represents which project the
    // client will act on behalf of. If not supplied, it falls back to the default
    // project inferred from the environment.
    projectId: 'my-project-id',
  });
  const db = getFirestore();
  // [END firestore_setup_client_create]
  return db;
}

async function initializeAppDefault() {
  process.env.GCLOUD_PROJECT = 'firestorebeta1test2';
  // [START initialize_app]

  initializeApp({
    credential: applicationDefault()
  });

  const db = getFirestore();
  // [END initialize_app]
  await db.terminate();
  // Destroy connection so we can run other tests that initialize the default app.
  return db;
}

async function initializeAppFunctions() {
  process.env.GCLOUD_PROJECT = 'firestorebeta1test2';
  // [START initialize_app_functions]
  initializeApp();

  const db = getFirestore();

  // [END initialize_app_functions]
  return db;
}

async function initializeAppSA() {
  // [START initialize_app_service_account]

  const serviceAccount = require('./path/to/serviceAccountKey.json');

  initializeApp({
    credential: cert(serviceAccount)
  });

  const db = getFirestore();

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
  // [START firestore_setup_dataset_pt1]
  const docRef = db.collection('users').doc('alovelace');

  await docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
  });
  // [END firestore_setup_dataset_pt1]

  // [START firestore_setup_dataset_pt2]
  const aTuringRef = db.collection('users').doc('aturing');

  await aTuringRef.set({
    'first': 'Alan',
    'middle': 'Mathison',
    'last': 'Turing',
    'born': 1912
  });
  // [END firestore_setup_dataset_pt2]
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
  // [START firestore_setup_dataset_read]
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END firestore_setup_dataset_read]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/data-model
// ============================================================================

async function basicReferences(db) {
  // [START firestore_data_reference_document]
  const alovelaceDocumentRef = db.collection('users').doc('alovelace');
  // [END firestore_data_reference_document]

  // [START firestore_data_reference_collection]
  const usersCollectionRef = db.collection('users');
  // [END firestore_data_reference_collection]
}

async function advancedReferences(db) {
  // [START firestore_data_reference_document_path]
  const alovelaceDocumentRef = db.doc('users/alovelace');
  // [END firestore_data_reference_document_path]

  // [START firestore_data_reference_subcollection]
  const messageRef = db.collection('rooms').doc('roomA')
    .collection('messages').doc('message1');
  // [END firestore_data_reference_subcollection]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/save-data
// ============================================================================

async function setDocument(db) {
  // [START firestore_data_set_from_map]
  const data = {
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA'
  };

  // Add a new document in collection "cities" with ID 'LA'
  const res = await db.collection('cities').doc('LA').set(data);
  // [END firestore_data_set_from_map]

  console.log('Set: ', res);
}

async function dataTypes(db) {
  // [START firestore_data_set_from_map_nested]
  const data = {
    stringExample: 'Hello, World!',
    booleanExample: true,
    numberExample: 3.14159265,
    dateExample: Timestamp.fromDate(new Date('December 10, 1815')),
    arrayExample: [5, true, 'hello'],
    nullExample: null,
    objectExample: {
      a: 5,
      b: true
    }
  };

  const res = await db.collection('data').doc('one').set(data);
  // [END firestore_data_set_from_map_nested]

  console.log('Set: ', res);
}

async function addDocument(db) {
  // [START firestore_data_set_id_random_collection]
  // Add a new document with a generated id.
  const res = await db.collection('cities').add({
    name: 'Tokyo',
    country: 'Japan'
  });

  console.log('Added document with ID: ', res.id);
  // [END firestore_data_set_id_random_collection]

  console.log('Add: ', res);
}

async function addDocumentWithId(db) {
  const data = {foo: 'bar '};

  // [START firestore_data_set_id_specified]
  await db.collection('cities').doc('new-city-id').set(data);
  // [END firestore_data_set_id_specified]
}

async function addLater(db) {
  // [START firestore_data_set_id_random_document_ref]
  const newCityRef = db.collection('cities').doc();

  // Later...
  const res = await newCityRef.set({
    // ...
  });
  // [END firestore_data_set_id_random_document_ref]
  console.log('Add: ', res);
}

async function updateDocument(db) {
  // [START firestore_data_set_field]
  const cityRef = db.collection('cities').doc('DC');

  // Set the 'capital' field of the city
  const res = await cityRef.update({capital: true});
  // [END firestore_data_set_field]

  console.log('Update: ', res);
}

async function updateDocumentArray(db) {
  // [START firestore_data_set_array_operations]
  // ...
  const washingtonRef = db.collection('cities').doc('DC');

  // Atomically add a new region to the "regions" array field.
  const unionRes = await washingtonRef.update({
    regions: FieldValue.arrayUnion('greater_virginia')
  });
  // Atomically remove a region from the "regions" array field.
  const removeRes = await washingtonRef.update({
    regions: FieldValue.arrayRemove('east_coast')
  });

  // To add or remove multiple items, pass multiple arguments to arrayUnion/arrayRemove
  const multipleUnionRes = await washingtonRef.update({
    regions: FieldValue.arrayUnion('south_carolina', 'texas')
    // Alternatively, you can use spread operator in ES6 syntax
    // const newRegions = ['south_carolina', 'texas']
    // regions: FieldValue.arrayUnion(...newRegions)
  });
  // [END firestore_data_set_array_operations]

  console.log('Update array: ', unionRes, removeRes);
}

async function updateDocumentIncrement(db) {
  // [START firestore_data_set_numeric_increment]
  // ...
  const washingtonRef = db.collection('cities').doc('DC');

  // Atomically increment the population of the city by 50.
  const res = await washingtonRef.update({
    population: FieldValue.increment(50)
  });
  // [END firestore_data_set_numeric_increment]

  console.log('Increment: ' + res);
}

async function updateDocumentMany(db) {
  // [START firestore_update_document_many]
  // [START update_document_many]
  const cityRef = db.collection('cities').doc('DC');

  const res = await cityRef.update({
    name: 'Washington D.C.',
    country: 'USA',
    capital: true
  });
  // [END update_document_many]
  // [END firestore_update_document_many]

  console.log('Update: ', res);
}

async function updateCreateIfMissing(db) {
  // [START firestore_data_set_doc_upsert]
  const cityRef = db.collection('cities').doc('BJ');

  const res = await cityRef.set({
    capital: true
  }, { merge: true });
  // [END firestore_data_set_doc_upsert]

  console.log('Update: ', res);
}

async function updateServerTimestamp(db) {
  // Create the object before updating it
  await db.collection('objects').doc('some-id').set({});

  // [START firestore_data_set_server_timestamp]
  // Create a document reference
  const docRef = db.collection('objects').doc('some-id');

  // Update the timestamp field with the value from the server
  const res = await docRef.update({
    timestamp: FieldValue.serverTimestamp()
  });
  // [END firestore_data_set_server_timestamp]

  console.log('Update: ', res);
}

async function updateDeleteField(db) {
  const admin = require('firebase-admin');
  // [START firestore_data_delete_field]
  // Create a document reference
  const cityRef = db.collection('cities').doc('BJ');

  // Remove the 'capital' field from the document
  const res = await cityRef.update({
    capital: FieldValue.delete()
  });
  // [END firestore_data_delete_field]

  console.log('Update: ', res);
}

async function updateNested(db) {
  // [START firestore_data_set_nested_fields]
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
  // [END firestore_data_set_nested_fields]

  console.log('Update: ', res);
}

async function deleteDocument(db) {
  // [START firestore_data_delete_doc]
  const res = await db.collection('cities').doc('DC').delete();
  // [END firestore_data_delete_doc]

  console.log('Delete: ', res);
}

async function transaction(db) {
  // [START firestore_transaction_document_update]
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
  // [END firestore_transaction_document_update]
}

async function transactionWithResult(db) {
  // [START firestore_transaction_document_update_conditional]
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
  // [END firestore_transaction_document_update_conditional]

  return transaction;
}

async function updateBatch(db) {
  // [START firestore_data_batch_writes]
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
  // [END firestore_data_batch_writes]

  console.log('Batched.');
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/retrieve-data
// ============================================================================

async function exampleData(db) {
  // [START firestore_query_filter_dataset]
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
  // [END firestore_query_filter_dataset]
}

async function exampleDataTwo(db) {
  // [START firestore_data_get_dataset]
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
  // [END firestore_data_get_dataset]
}

async function getDocument(db) {
  // [START firestore_data_get_as_map]
  const cityRef = db.collection('cities').doc('SF');
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
  // [END firestore_data_get_as_map]
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
  // [START firestore_data_query]
  const citiesRef = db.collection('cities');
  const snapshot = await citiesRef.where('capital', '==', true).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }  

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END firestore_data_query]
}

async function getAll(db) {
  // [START firestore_data_get_all_documents]
  const citiesRef = db.collection('cities');
  const snapshot = await citiesRef.get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });
  // [END firestore_data_get_all_documents]
}

async function getCollections(db) {
  // [START firestore_data_get_sub_collections]
  const sfRef = db.collection('cities').doc('SF');
  const collections = await sfRef.listCollections();
  collections.forEach(collection => {
    console.log('Found subcollection with id:', collection.id);
  });
  // [END firestore_data_get_sub_collections]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/query-data
// ============================================================================

async function simpleQuery(db) {
  // [START firestore_query_filter_eq_string]
  // Create a reference to the cities collection
  const citiesRef = db.collection('cities');

  // Create a query against the collection
  const queryRef = citiesRef.where('state', '==', 'CA');
  // [END firestore_query_filter_eq_string]

  const res = await queryRef.get();
  res.forEach(doc => {
    console.log(doc.id, ' => ', doc.data());
  });
}

async function queryAndFilter(db) {
  // [START firestore_query_filter_eq_boolean]
  // Create a reference to the cities collection
  const citiesRef = db.collection('cities');

  // Create a query against the collection
  const allCapitalsRes = await citiesRef.where('capital', '==', true).get();
  // [END firestore_query_filter_eq_boolean]

  // [START firestore_query_filter_single_examples]
  const stateQueryRes = await citiesRef.where('state', '==', 'CA').get();
  const populationQueryRes = await citiesRef.where('population', '<', 1000000).get();
  const nameQueryRes = await citiesRef.where('name', '>=', 'San Francisco').get();
  // [END firestore_query_filter_single_examples]

  // [START firestore_query_filter_not_eq]
  const capitalNotFalseRes = await citiesRef.where('capital', '!=', false).get();
  // [END firestore_query_filter_not_eq]

  for (const q of [stateQueryRes, populationQueryRes, nameQueryRes, capitalNotFalseRes]) {
    q.forEach(d => {
      console.log('Get: ', d);
    });
  }
}

async function arrayFilter(db) {
  const citiesRef = db.collection('cities');
  // [START firestore_query_filter_array_contains]
  const westCoastCities = citiesRef.where('regions', 'array-contains',
    'west_coast').get();
  // [END firestore_query_filter_array_contains]

  console.log('West Coast get: ', westCoastCities);
}

async function arrayContainsAnyQueries(db) {
  const citiesRef = db.collection('cities');
  // [START firestore_query_filter_array_contains_any]
  const coastalCities = await citiesRef.where('regions', 'array-contains-any',
      ['west_coast', 'east_coast']).get();
  // [END firestore_query_filter_array_contains_any]

  console.log('Coastal cities get: ', coastalCities);
}

async function inQueries(db) {
  const citiesRef = db.collection('cities');
  // [START firestore_query_filter_in]
  const usaOrJapan = await citiesRef.where('country', 'in', ['USA', 'Japan']).get();
  // [END firestore_query_filter_in]

  // [START firestore_query_filter_not_in]
  const notUsaOrJapan = await citiesRef.where('country', 'not-in', ['USA', 'Japan']).get();
  // [END firestore_query_filter_not_in]

  // [START firestore_query_filter_in_with_array]
  const exactlyOneCoast = await citiesRef.where('regions', 'in',
      [['west_coast', 'east_coast']]).get();
  // [END firestore_query_filter_in_with_array]

  console.log('USA or Japan get: ', usaOrJapan);
  console.log('Not USA or Japan get: ', notUsaOrJapan);
  console.log('Exactly One Coast get: ', exactlyOneCoast);
}

async function orderAndLimit(db) {
  const citiesRef = db.collection('cities');
  // [START firestore_query_order_limit]
  const firstThreeRes = await citiesRef.orderBy('name').limit(3).get();
  // [END firestore_query_order_limit]

  // [START firestore_query_order_desc_limit]
  const lastThreeRes = await citiesRef.orderBy('name', 'desc').limit(3).get();
  // [END firestore_query_order_desc_limit]

  // [START firestore_query_order_multi]
  const byStateByPopRes = await citiesRef.orderBy('state').orderBy('population', 'desc').get();
  // [END firestore_query_order_multi]

  // [START firestore_query_order_limit_field_valid]
  const biggestRes = await citiesRef.where('population', '>', 2500000)
    .orderBy('population').limit(2).get();
  // [END firestore_query_order_limit_field_valid]

  for (const res of [firstThreeRes, lastThreeRes, byStateByPopRes, biggestRes]) {
    res.forEach(d => {
      console.log('Get:', d);
    });
  }
}

async function validInvalidQueries(db) {
  const citiesRef = db.collection('cities');

  // [START firestore_query_filter_compound_multi_eq]
  citiesRef.where('state', '==', 'CO').where('name', '==', 'Denver');
  // [END firestore_query_filter_compound_multi_eq]

  // [START firestore_query_filter_compound_multi_eq]
  citiesRef.where('state', '==', 'CA').where('population', '<', 1000000);
  // [END firestore_query_filter_compound_multi_eq]

  // [START firestore_query_filter_range_valid]
  citiesRef.where('state', '>=', 'CA').where('state', '<=', 'IN');
  citiesRef.where('state', '==', 'CA').where('population', '>', 1000000);
  // [END firestore_query_filter_range_valid]

  // [START firestore_query_filter_range_invalid]
  citiesRef.where('state', '>=', 'CA').where('population', '>', 1000000);
  // [END firestore_query_filter_range_invalid]

  // [START firestore_query_order_with_filter]
  citiesRef.where('population', '>', 2500000).orderBy('population');
  // [END firestore_query_order_with_filter]

  // [START firestore_query_order_field_invalid]
  citiesRef.where('population', '>', 2500000).orderBy('country');
  // [END firestore_query_order_field_invalid]
}

async function streamSnapshot(db, done) {
  // [START firestore_listen_query_snapshots]
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
  // [END firestore_listen_query_snapshots]
}

async function listenDiffs(db, done) {
  // [START firestore_listen_query_changes]
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
  // [END firestore_listen_query_changes]
}

async function streamDocument(db, done) {
  // [START firestore_listen_document]
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
  // [END firestore_listen_document]
}

async function detatchListener(db) {
  // [START firestore_listen_detach]
  const unsub = db.collection('cities').onSnapshot(() => {
  });

  // ...

  // Stop listening for changes
  unsub();
  // [END firestore_listen_detach]
}

async function listenErrors(db) {
  // [START firestore_listen_handle_error]
  db.collection('cities')
    .onSnapshot((snapshot) => {
      //...
    }, (error) => {
      //...
    });
  // [END firestore_listen_handle_error]
}

async function collectionGroupQuery(db) {
  // [START firestore_query_collection_group_dataset]
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
  // [END firestore_query_collection_group_dataset]

  // [START firestore_query_collection_group_filter_eq]
  const querySnapshot = await db.collectionGroup('landmarks').where('type', '==', 'museum').get();
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data());
  });
  // [END firestore_query_collection_group_filter_eq]
}

// ============================================================================
// https://firebase.google.com/docs/firestore/query-data/query-cursors
// ============================================================================

async function simpleCursors(db) {
  // [START firestore_query_cursor_start_at_field_value_single]
  const startAtRes = await db.collection('cities')
    .orderBy('population')
    .startAt(1000000)
    .get();
  // [END firestore_query_cursor_start_at_field_value_single]

  // [START firestore_query_cursor_end_at_field_value_single]
  const endAtRes = await db.collection('cities')
    .orderBy('population')
    .endAt(1000000)
    .get();
  // [END firestore_query_cursor_end_at_field_value_single]
}

async function snapshotCursors(db) {
  // [START firestore_query_cursor_start_at_document]
  const docRef = db.collection('cities').doc('SF');
  const snapshot = await docRef.get();
  const startAtSnapshot = db.collection('cities')
    .orderBy('population')
    .startAt(snapshot);

  await startAtSnapshot.limit(10).get();
  // [END firestore_query_cursor_start_at_document]
}

async function paginateQuery(db) {
  // [START firestore_query_cursor_pagination]
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
  // [END firestore_query_cursor_pagination]
}

async function multipleCursorConditions(db) {
  // [START firestore_query_cursor_start_at_field_value_multi]
  // Will return all Springfields
  const startAtNameRes = await db.collection('cities')
    .orderBy('name')
    .orderBy('state')
    .startAt('Springfield')
    .get();

  // Will return 'Springfield, Missouri' and 'Springfield, Wisconsin'
  const startAtNameAndStateRes = await db.collection('cities')
    .orderBy('name')
    .orderBy('state')
    .startAt('Springfield', 'Missouri')
    .get();
  // [END firestore_query_cursor_start_at_field_value_multi]
}

// [START firestore_data_delete_collection]
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

// [END firestore_data_delete_collection]

// ============================================================================
// MAIN
// ============================================================================

describe('Firestore Smoketests', () => {

  const app = initializeApp({}, 'tests');
  const db = getFirestore(app);

  it('should initialize a db with the default credential', () => {
    return initializeApp();
  });

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
