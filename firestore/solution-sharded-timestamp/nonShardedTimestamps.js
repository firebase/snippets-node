const {Firestore} = require('@google-cloud/firestore');

// Create a new client
const fs = new Firestore();

// [START fs_sharded_timestamps_pre_insert]
async function insertData() {
  const instruments = [
    {
      symbol: 'AAA',
      price: {
        currency: 'USD',
        micros: 34790000
      },
      exchange: 'EXCHG1',
      instrumentType: 'commonstock',
      timestamp: Firestore.Timestamp.fromMillis(
          Date.parse('2019-01-01T13:45:23.010Z'))
    },
    {
      symbol: 'BBB',
      price: {
        currency: 'JPY',
        micros: 64272000000
      },
      exchange: 'EXCHG2',
      instrumentType: 'commonstock',
      timestamp: Firestore.Timestamp.fromMillis(
          Date.parse('2019-01-01T13:45:23.101Z'))
    },
    {
      symbol: 'Index1 ETF',
      price: {
        currency: 'USD',
        micros: 473000000
      },
      exchange: 'EXCHG1',
      instrumentType: 'etf',
      timestamp: Firestore.Timestamp.fromMillis(
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

// [END fs_sharded_timestamps_pre_insert]

// [START fs_sharded_timestamps_pre_query]
function createQuery(fieldName, fieldOperator, fieldValue, limit = 5) {
  return fs.collection('instruments')
      .where(fieldName, fieldOperator, fieldValue)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
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

// [END fs_sharded_timestamps_pre_query]

// [START fs_sharded_timestamps_pre_exec]
insertData()
    .then(() => {
      queryCommonStock()
          .then(
              (docs) => {
                console.log('--- queryCommonStock: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${JSON.stringify(doc)}`);
                });
              }
          );
      queryExchange1Instruments()
          .then(
              (docs) => {
                console.log('--- queryExchange1Instruments: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${JSON.stringify(doc)}`);
                });
              }
          );
      queryUSDInstruments()
          .then(
              (docs) => {
                console.log('--- queryUSDInstruments: ');
                docs.forEach((doc) => {
                  console.log(`doc = ${JSON.stringify(doc)}`);
                });
              }
          );
    });
// [END fs_sharded_timestamps_pre_exec]
