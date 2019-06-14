const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.firestore();
// [START_EXCLUDE]
const settings = {timestampsInSnapshots: true};
db.settings(settings);
// [END_EXCLUDE]

// [START aggregate_function]
exports.aggregateRatings = functions.firestore
  .document('restaurants/{restId}/ratings/{ratingId}')
  .onWrite((change, context) => {
    // Get value of the newly added rating
    const ratingVal = change.after.data().rating;

    // Get a reference to the restaurant
    const restRef = db.collection('restaurants').doc(context.params.restId);

    // Update aggregations in a transaction
    return db.runTransaction((transaction) => {
      return transaction.get(restRef).then((restDoc) => {
        // Compute new number of ratings
        const newNumRatings = restDoc.data().numRatings + 1;

        // Compute new average rating
        const oldRatingTotal =
          restDoc.data().avgRating * restDoc.data().numRatings;
        const newAvgRating = (oldRatingTotal + ratingVal) / newNumRatings;

        // Update restaurant info
        return transaction.update(restRef, {
          avgRating: newAvgRating,
          numRatings: newNumRatings,
        });
      });
    });
  });
// [END aggregate_function]
