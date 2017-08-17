const debug = require('debug')("firestore-snippets-node");

// [START firestore_deps]
const GoogleAuth = require('google-auth-library');
const firebase = require('firebase');
const Firestore = require('@google-cloud/firestore');
// [END firestore_deps]

// We supress these logs when not in NODE_ENV=debug for cleaner Mocha output
var console = {log: debug};

function initializeApp() {
    // [START initialize_app]
    // Get project ID from environment
    var firestoreId = process.env.GCLOUD_PROJECT;

    // Initialize Firestore
    var firestoreOptions = {
        projectId: firestoreId,
        keyFilename: __dirname + '/keyfile.json'
    }

    var db = new Firestore(firestoreOptions);
    // [END initialize_app]
    return db;
}

function demoInitialize() {
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
// https://firebase.google.com/docs/firestore/server/quickstart
// ============================================================================

function quickstartAddData(db) {
    // [START add_lovelace]
    var docRef = db.collection('users').doc('alovelace');

    var setAda = docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    });
    // [END add_lovelace]

    // [START add_turing]
    var aTuringRef = db.collection('users').doc('aturing')

    var setAlan = aTuringRef.set({
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
    var query = db.collection('users').where('born', '<', 1900)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

    // RESULT:
    // alovelace => { last: 'Lovelace', first: 'Ada', born: '1815' }
    // [END quickstart_query]

    return query;
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/save-data
// ============================================================================

function setDocument(db) {
    // [START set_document]
    var data = {
        name: 'Los Angeles',
        weather: 'sunny'
    };

    // Add a new document in collection "cities" with ID 'DC'
    var setDoc = db.collection('cities').doc('LA').set(data);
    // [END set_document]

    return setDoc.then(res => {
        console.log('Set: ', res);
    });
}

function dataTypes(db){
    // [START data_types]
    var data = {
        name: 'New York City',
        capital: false,
        areaInSquareMiles: 468.9,
        airports: ['JFK', 'LGA'],
        country: 'USA',
        weather: null,
        coordinates: {
          latitude: 40.73,
          longitude: -73.93
        }
    };

    // Add a new document in collection "cities" with ID 'NYC'
    var setDoc = db.collection('cities').doc('NYC').set(data);
    // [END data_types]

    return setDoc.then(res => {
        console.log('Set: ', res);
    });
}

function addDocument(db) {
    // [START add_document]
    // Add a new document with a generated id.
    var addDoc = db.collection('cities').add({
        name: 'Tokyo',
        weather: 'rainy'
    }).then(ref => {
        console.log('Added document with ID: ', ref.id);
    });
    // [END add_document]

    return addDoc.then(res => {
        console.log('Add: ', res);
    });
}

function addLater(db) {
    // [START add_later]
    var newCityRef = db.collection('cities').doc();

    // Later...
    var setDoc = newCityRef.set({
        // ...
    })
    // [END add_later]

    return setDoc.then(res => {
        console.log('Add: ', res);
    });
}

function updateDocument(db) {
    // [START update_document]
    var cityRef = db.collection('cities').doc('LA');

    // Set the 'capital' field of the city
    var updateSingle = cityRef.update({ capital: true });

    // Set the 'capital' and 'population' fields
    var updateMultiple = cityRef.update({
        capital: true,
        population: 3884000
    });
    // [END update_document]

    return Promise.all([updateSingle, updateMultiple]).then(res => {
        console.log('Update: ', res);
    });
}

function updateDocumentMany(db) {
    // [START update_document_many]
    var cityRef = db.collection('cities').doc('LA');

    var updateMany = cityRef.update({
        capital: false,
        country: 'USA',
        population: 3929000,
        squareMiles: 503.0
    });
    // [END update_document_many]

    return updateMany.then(res => {
        console.log('Update: ', res);
    });
}

function updateCreateIfMissing(db) {
    // [START update_create_if_missing]
    var cityRef = db.collection('cities').doc('Delhi');

    var updateWithOptions = cityRef.update({
        capital: true,
        country: 'India'
    }, { createIfMissing: true });
    // [END update_create_if_missing]

    return updateWithOptions.then(res => {
        console.log('Update: ', res);
    });
}

function updateServerTimestamp(db) {
    // Create the object before updating it (racy on first run, oh well)
    db.collection('objects').doc('some-id').set({});

    // [START update_with_server_timestamp]
    var docRef = db.collection('objects').doc('some-id');

    // Update the timestamp field with the value from the server
    var updateTimestamp = docRef.update({
        timestamp: Firestore.FieldValue.serverTimestamp()
    });
    // [END update_with_server_timestamp]

    return updateTimestamp.then(res => {
        console.log('Update: ', res);
    });
}

function updateDeleteField(db) {
    // [START update_delete_field]
    var cityRef = db.collection('cities').doc('Beijing');

    // Remove the 'capital' field from the document
    var removeCapital = cityRef.update({
        capital: Firestore.FieldValue.delete()
    });
    // [END update_delete_field]

    return removeCapital.then(res => {
        console.log('Update: ', res);
    });
}

function updateNested(db) {
    // [START update_nested]
    var updateNested = db.collection('cities').doc('Beijing').update({
        capital: true,
        coordinates: {
          latitude: 39.9042,
          longitude: 116.4074
        }
    });
    // [END update_nested]

    return updateNested.then(res => {
        console.log('Update: ', res);
    });
}

function deleteDocument(db) {
    // [START delete_document]
    var deleteDoc = db.collection('cities').doc('LA').delete();
    // [END delete_document]

    return deleteDoc.then(res => {
        console.log('Delete: ', res);
    });
}

function transaction(db) {
    // [START transaction]
    // Initialize document
    var cityRef = db.collection('cities').doc('Sao Paulo');
    var setCity = cityRef.set({
        name: 'Sao Paulo',
        country: 'Brazil',
        capital: true,
        population: 12038175
    });

    var transaction = db.runTransaction(t => {
        return t.get(cityRef)
            .then(doc => {
                // Add one person to the city population
                var newPopulation = doc.data().population + 1;
                t.update(cityRef, { population: newPopulation });
            });
    })
    .then(result => {
        console.log('Transaction success!');
    })
    .catch(err => {
        console.log('Transaction failure:', err);
    });
    // [END transaction]

    return transaction;
}

function transactionWithResult(db) {
    // [START transaction_with_result]
    var cityRef = db.collection('cities').doc('Sao Paulo');
    var transaction = db.runTransaction(t => {
        return t.get(cityRef)
            .then(doc => {
                var newPopulation = doc.data().population + 1;
                if (newPopulation <= 1000000) {
                    t.update(cityRef, { population: newPopulation });
                    return Promise.resolve('Population increased to ' + newPopulation);
                } else {
                    return Promise.reject('Sorry! Population is too big.');
                }
            });
    })
    .then(result => {
        console.log('Transaction success', result);
    })
    .catch(err => {
        console.log('Transaction failure:', err);
    });
    // [END transaction_with_result]

    return transaction;
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/retrieve-data
// ============================================================================

function exampleData(db) {
    // [START example_data]
    var citiesRef = db.collection('cities');

    var setSp = citiesRef.doc('Sao Paulo').set({
        name: 'Sao Paulo', country: 'Brazil', capital: true, population: 12038175 });
    var setSyd = citiesRef.doc('Sydney').set({
        name: 'Sydney', country: 'Australia', capital: true, population: 4921000 });
    var setPar = citiesRef.doc('Paris').set({
        name: 'Paris', country: 'France', capital: true, population: 2229621 });
    var setNy = citiesRef.doc('NYC').set({
        name: 'New York City', country: 'USA', capital: false, population: 8550405 });
    // [END example_data]

    return Promise.all([setSp, setSyd, setPar, setNy]);
}

function exampleDataTwo(db) {
    // [START example_data_two]
    var citiesRef = db.collection('cities');

    var setTok = citiesRef.doc('Tokyo').set({
        name: 'Tokyo', country: 'Japan', capital: true, population: 13617445 });
    var setNy = citiesRef.doc('NYC').set({
        name: 'New York City', country: 'USA', capital: false, population: 8550405 });
    var setBj = citiesRef.doc('Beijing').set({
        name: 'Beijing', country: 'China', capital: true, population: 21700000 });
    var setLon = citiesRef.doc('London').set({
        name: 'London', country: 'UK', capital: true, population: 672228 });
    // [END example_data_two]

    return Promise.all([setTok, setNy, setBj, setLon]);
}

function getDocument(db) {
    // [START get_document]
    var cityRef = db.collection('cities').doc('Beijing');
    var getDoc = cityRef.get()
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

    // RESULT:
    // Document data: { capital: true, name: 'Beijing', country: 'China', population: '21700000' }
    // [END get_document]

    return getDoc;
}

function getDocumentEmpty(db) {
    var cityRef = db.collection('cities').doc('Amexico');
    var getDoc = cityRef.get()
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
    var citiesRef = db.collection('cities');
    var query = citiesRef.where('capital', '==', true).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

    // RESULT:
    // Beijing => { name: 'Beijing', country: 'China', population: '21700000', capital: true }
    // London => { population: '672228', capital: true, name: 'London', country: 'UK' }
    // Tokyo => { name: 'Tokyo', country: 'Japan', population: '13617445', capital: true }
    // [END get_multiple]

    return query;
}

function getAll(db) {
    // [START get_all]
    var citiesRef = db.collection('cities');
    var allCities = citiesRef.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

    // RESULT:
    // Beijing => { population: '21700000',  capital: true,  name: 'Beijing',  country: 'China' }
    // London => { population: '672228',  capital: true,  name: 'London',  country: 'UK' }
    // Tokyo => { population: '13617445',  capital: true,  name: 'Tokyo',  country: 'Japan' }
    // NYC => { population: '8550405', capital: false, name: 'New York City', country: 'USA' }
    // [END get_all]

    return allCities;
}

// ============================================================================
// https://firebase.google.com/docs/firestore/server/query-data
// ============================================================================

function queryAndFilter(db) {
    // [START create_query]
    // Create a reference to the cities collection
    var citiesRef = db.collection('cities');

    // Create a query against the collection
    var queryRef = citiesRef.where('capital', '==', true);
    // [END create_query]

    // [START example_filters]
    var brazilCities = citiesRef.where('country', '==', 'Brazil');
    var smallCities = citiesRef.where('population', '<', 8550405);
    var afterParis = citiesRef.where('name', '>=', 'Paris');
    // [END example_filters]

    return Promise.all([brazilCities.get(), smallCities.get(), afterParis.get()]).then(res => {
        res.forEach(r => {
            r.forEach(d => {
                console.log('Get:', d);
            });
            console.log();
        });
    });
}

function orderAndLimit(db) {
    var citiesRef = db.collection('cities');
    // [START order_limit]
    var firstThree = citiesRef.orderBy('name').limit(3);
    // [END order_limit]

    // [START order_limit_desc]
    var lastThree = citiesRef.orderBy('name', 'desc').limit(3);
    // [END order_limit_desc]

    // [START where_and_order]
    var biggest = citiesRef.where('population', '>', 2500000).orderBy('population').limit(2);
    // [END where_and_order]

    return Promise.all([firstThree.get(), lastThree.get(), biggest.get()]).then(res => {
        res.forEach(r => {
            r.forEach(d => {
                console.log('Get:', d);
            });
            console.log();
        });
    });
}

function validInvalidQueries() {
    var citiesRef = db.collection('cities');

    // [START valid_chained]
    citiesRef.where('country', '==', 'Australia').where('name', '==', 'Sydney');
    // [END valid_chained]

    // [START invalid_chained]
    citiesRef.where('country', '==', 'USA').where('population', '>', 5000000);
    // [END invalid_chained]

    // [START valid_range]
    citiesRef.where("country", ">=", "Brazil").where("country", "<", "USA");
    // [END valid_range]

    // [START invalid_range]
    citiesRef.where("country", ">=", "Brazil").where("population", ">", 1000000);
    // [END invalid_range]

    // [START valid_order_by]
    citiesRef.where("population", ">", 2500000).orderBy("population");
    // [END valid_order_by]

    // [START invalid_order_by]
    citiesRef.where("population", ">", 2500000).orderBy("country");
    // [END invalid_order_by]
}

function streamSnapshot(db, done) {
  // [START query_realtime]
  var query = db.collection("cities");

  var observer = query.onSnapshot(querySnapshot => {
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

function streamDocument(db, done) {
    // [START doc_realtime]
    var doc = db.collection('cities').doc('NYC');

    var observer = doc.onSnapshot(docSnapshot => {
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

// ============================================================================
// https://firebase.google.com/docs/firestore/query-data/query-cursors
// ============================================================================

function simpleCursors(db) {
    // [START cursor_simple_start_at]
    var startAt = db.collection('cities')
        .orderBy('population')
        .startAt(1000000);
    // [END cursor_simple_start_at]

    // [START cursor_simple_end_at]
    var endAt = db.collection('cities')
        .orderBy('population')
        .endAt(1000000);
    // [END cursor_simple_end_at]

    return Promise.all([
        startAt.limit(10).get(),
        endAt.limit(10).get()
    ]);
}

function paginateQuery(db) {
    // [START cursor_paginate]
    var first = db.collection('cities')
        .orderBy('population')
        .limit(3);

    var paginate = first.get()
        .then((snapshot) => {
            // ...

            // Get the last document
            var last = snapshot.docs[snapshot.docs.length - 1];

            // Construct a new query starting at this document.
            // Note: this will not have the desired effect if multiple
            // cities have the exact same population value.
            var next = db.collection('cities')
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
    var startAtName = db.collection("cities")
            .orderBy("name")
            .orderBy("state")
            .startAt("Springfield");
    // [END cursor_multiple_one_start]

    // [START cursor_multiple_two_start]
    // Will return "Springfield, Missouri" and "Springfield, Wisconsin"
    var startAtNameAndState = db.collection("cities")
            .orderBy("name")
            .orderBy("state")
            .startAt("Springfield", "Missouri");
    // [END cursor_multiple_two_start]

    return Promise.all([
        startAtName.get(),
        startAtNameAndState.get()
    ]);
}

// ============================================================================
// MAIN
// ============================================================================


function deleteCollection(db, name) {
    var coll = db.collection(name);
    return coll.get()
        .then(res => {
            var promises = []
            res.forEach(doc => {
                var id = doc.id;
                promises.push(coll.doc(id).delete());
            });

            console.log('Deleting ', promises.length, ' documents.');
            return Promise.all(promises);
        });
}

describe("Firestore Smoketests", () => {
  var db;

  before(() => { db = initializeApp(); });

  it("should get an empty document", () => {
    return getDocumentEmpty(db)
  });

  it("should delete existing documents", () => {
    return deleteCollection(db, 'cities')
  });

  it("should store example data", () => {
    return exampleData(db)
  });

  it("should add quickstart data", () => {
    return quickstartAddData(db)
  });

  it("should query quickstart data", () => {
    return quickstartQuery(db)
  });

  it("should set a document", () => {
    return setDocument(db)
  });

  it("should manage data types", () => {
    return dataTypes(db)
  });

  it("should add a document", () => {
    return addDocument(db)
  });

  it("should add a document later", () => {
    return addLater(db);
  });

  it("should update a document", () => {
    return updateDocument(db)
  });

  it("should update many document", () => {
    return updateDocumentMany(db)
  });

  it("should update a missing doc", () => {
    return updateCreateIfMissing(db)
  });

  it("should update with server timestamp", () => {
    return updateServerTimestamp(db)
  });

  it("should handle transactions", () => {
    return transaction(db)
  });

  it("should handle transaction with a result", () => {
    return transactionWithResult(db).then(res => {
        // Delete data set
        return deleteCollection(db, 'cities')
    });
  });

  it("should set more example data", () => {
    return exampleDataTwo(db)
  });

  it("should get document", () => {
    return getDocument(db)
  });

  it("should get multiple documents", () => {
    return getMultiple(db)
  });

  it("should get all documents", () => {
    return getAll(db)
  });

  it("should query and filter", () => {
    return queryAndFilter(db)
  });

  it("should order and limit", () => {
    return orderAndLimit(db)
  });

  it("should update and delete a field", () => {
    return updateDeleteField(db)
  });

  it("should update nested fields", () => {
    return updateNested(db);
  });

  it("should delete doucment", () => {
    return deleteDocument(db)
  });

  it("should stream query data", (done) => {
    return streamSnapshot(db, done)
  });

  it("should stream doc data", (done) => {
    return streamDocument(db, done)
  });

  it("should support simple cursors", () => {
    return simpleCursors(db);
  });

  it("should support pagination", () => {
    return paginateQuery(db);
  });

  it("should support multiple cursor conditions", () => {
    return multipleCursorConditions(db);
  });
})
