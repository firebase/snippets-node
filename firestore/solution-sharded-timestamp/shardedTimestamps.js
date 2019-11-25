const util = require('util');
const admin = require('firebase-admin');
admin.initializeApp();

// Create a new client
const fs = admin.firestore();
const MAX_IN_VALUES = 10;

// [START fs_sharded_timestamps_define_shards]
// Define our 'K' shard values
const shards = ['x', 'y', 'z'];
// Define a function to help 'chunk' our shards for use in queries.
// When using the 'in' query filter there is a max number of values that can be
// included in the value. If our number of shards is higher than that limit
// break down the shards into the fewest possible number of chunks.
function shardChunks() {
  const chunks = [];
  let start = 0;
  while (start < shards.length) {
    const elements = Math.min(MAX_IN_VALUES, shards.length - start);
    const end = start + elements;
    chunks.push(shards.slice(start, end));
    start = end;
  }
  return chunks;
}

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
  return Promise.all(shardChunks().map(shardChunk => {
        return fs.collection('instruments')
            .where('shard', 'in', shardChunk)  // new shard condition
            .where(fieldName, fieldOperator, fieldValue)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
      }))
      // Now that we have a promise of multiple possible query results, we need
      // to merge the results from all of the queries into a single result set.
      .then((snapshots) => {
        // Create a new container for 'all' results
        const docs = [];
        snapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // append each document to the new all container
            docs.push(doc);
          });
        });
        if (snapshots.length === 1) {
          // if only a single query was returned skip manual sorting as it is
          // taken care of by the backend.
          return docs;
        } else {
          // When multiple query results are returned we need to sort the
          // results after they have been concatenated.
          // 
          // since we're wanting the `limit` newest values, sort the array
          // descending and take the first `limit` values. By returning negated
          // values we can easily get a descending value.
          docs.sort((a, b) => {
            const aT = a.data().timestamp;
            const bT = b.data().timestamp;
            const secondsDiff = aT.seconds - bT.seconds;
            if (secondsDiff === 0) {
              return -(aT.nanoseconds - bT.nanoseconds);
            } else {
              return -secondsDiff;
            }
          });
          return docs.slice(0, limit);
        }
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
    .then(() => {
      const commonStock = queryCommonStock()
          .then(
              (docs) => {
                console.log('--- queryCommonStock: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${util.inspect(doc.data(), {depth: 4})}`);
                });
              }
          );
      const exchange1Instruments = queryExchange1Instruments()
          .then(
              (docs) => {
                console.log('--- queryExchange1Instruments: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${util.inspect(doc.data(), {depth: 4})}`);
                });
              }
          );
      const usdInstruments = queryUSDInstruments()
          .then(
              (docs) => {
                console.log('--- queryUSDInstruments: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${util.inspect(doc.data(), {depth: 4})}`);
                });
              }
          );
      return Promise.all([commonStock, exchange1Instruments, usdInstruments]);
    });
// [END fs_sharded_timestamps_post_exec]
