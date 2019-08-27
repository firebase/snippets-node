const util = require('util');
const admin = require('firebase-admin');
admin.initializeApp();

// Create a new client
const fs = admin.firestore();

// [START fs_sharded_timestamps_define_shards]
// Define our 'K' shard values
const shards = ['x', 'y', 'z'];

// Add a convenience function to select a random shard
function randomShard() {
  return shards[Math.floor(Math.random() * Math.floor(shards.length))];
}

// [END fs_sharded_timestamps_define_shards]

// [START fs_sharded_timestamps_post_insert]
async function insertData() {
  const instruments = [
    {
      shard: randomShard(),  // add the new shard field to the document
      symbol: 'AAA',
      price: {
        currency: 'USD',
        micros: 34790000
      },
      exchange: 'EXCHG1',
      instrumentType: 'commonstock',
      timestamp: admin.firestore.Timestamp.fromMillis(
          Date.parse('2019-01-01T13:45:23.010Z'))
    },
    {
      shard: randomShard(),  // add the new shard field to the document
      symbol: 'BBB',
      price: {
        currency: 'JPY',
        micros: 64272000000
      },
      exchange: 'EXCHG2',
      instrumentType: 'commonstock',
      timestamp: admin.firestore.Timestamp.fromMillis(
          Date.parse('2019-01-01T13:45:23.101Z'))
    },
    {
      shard: randomShard(),  // add the new shard field to the document
      symbol: 'Index1 ETF',
      price: {
        currency: 'USD',
        micros: 473000000
      },
      exchange: 'EXCHG1',
      instrumentType: 'etf',
      timestamp: admin.firestore.Timestamp.fromMillis(
          Date.parse('2019-01-01T13:45:23.001Z'))
    }
  ];

  const batch = fs.batch();
  for (const inst of instruments) {
    const ref = fs.collection('instruments').doc();
    batch.set(ref, inst);
  }

  await batch.commit();
}

// [END fs_sharded_timestamps_post_insert]

// [START fs_sharded_timestamps_post_query]
function createQuery(fieldName, fieldOperator, fieldValue, limit = 5) {
  // For each shard value, map it to a new query which adds an additional
  // where clause specifying the shard value.
  return Promise.all(shards.map(s => {
        return fs.collection('instruments')
            .where('shard', '==', s)  // new shard condition
            .where(fieldName, fieldOperator, fieldValue)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
      }))
      // Now that we have a promise of multiple query results, we need to
      // merge the results from all of the queries into a single result set.
      .then((snapshots) => {
        // Create a new container for 'all' results
        const docs = [];
        snapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // append each document to the new all container
            docs.push(doc);
          });
        });
        // since we're wanting the `limit` newest values, sort the array
        // descending and take the first `limit` values. By returning negated
        // values we can easily get a descending value.
        docs.sort((a, b) => {
          let aT = a.data().timestamp;
          let bT = b.data().timestamp;
          let secondsDiff = aT.seconds - bT.seconds;
          if (secondsDiff === 0) {
            return -(aT.nanoseconds - bT.nanoseconds);
          } else {
            return -secondsDiff;
          }
        });
        return docs.slice(0, limit);
      });
}

function queryCommonStock() {
  return createQuery('instrumentType', '==', 'commonstock');
}

function queryExchange1Instruments() {
  return createQuery('exchange', '==', 'EXCHG1');
}

function queryUSDInstruments() {
  return createQuery('price.currency', '==', 'USD');
}

// [END fs_sharded_timestamps_post_query]

// [START fs_sharded_timestamps_post_exec]
insertData()
    .then(async () => {
      await queryCommonStock()
          .then(
              (docs) => {
                console.log('--- queryCommonStock: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${util.inspect(doc.data(), {depth: 4})}`);
                });
              }
          );
      await queryExchange1Instruments()
          .then(
              (docs) => {
                console.log('--- queryExchange1Instruments: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${util.inspect(doc.data(), {depth: 4})}`);
                });
              }
          );
      await queryUSDInstruments()
          .then(
              (docs) => {
                console.log('--- queryUSDInstruments: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${util.inspect(doc.data(), {depth: 4})}`);
                });
              }
          );
    });
// [END fs_sharded_timestamps_post_exec]
