const functions = require('firebase-functions');
const { getFirestore } = require('firebase-admin/firestore');

const db = getFirestore();

// [START aggregate_function]
exports.aggregateRatings = functions.firestore
    .document('restaurants/{restId}/ratings/{ratingId}')
    .onWrite(async (change, context) => {
      // Get value of the newly added rating
      const ratingVal = change.after.data().rating;

      // Get a reference to the restaurant
      const restRef = db.collection('restaurants').doc(context.params.restId);

      // Update aggregations in a transaction
      await db.runTransaction(async (transaction) => {
        const restDoc = await transaction.get(restRef);
        
        // Compute new number of ratings
        const newNumRatings = restDoc.data().numRatings + 1;

        // Compute new average rating
        const oldRatingTotal = restDoc.data().avgRating * restDoc.data().numRatings;
        const newAvgRating = (oldRatingTotal + ratingVal) / newNumRatings;

        // Update restaurant info
        transaction.update(restRef, {
          avgRating: newAvgRating,
          numRatings: newNumRatings
        });
      });
    });
// [END aggregate_function]
