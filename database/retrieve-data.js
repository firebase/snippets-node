const admin = require('firebase-admin');

function readValue() {
  // [START rtdb_read_value]
  // Get a database reference to our posts
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on('value', (snapshot) => {
    console.log(snapshot.val());
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
  }); 
  // [END rtdb_read_value]
}

function childAdded() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  // [START rtdb_child_added]
  // Retrieve new posts as they are added to our database
  ref.on('child_added', (snapshot, prevChildKey) => {
    const newPost = snapshot.val();
    console.log('Author: ' + newPost.author);
    console.log('Title: ' + newPost.title);
    console.log('Previous Post ID: ' + prevChildKey);
  });
  // [END rtdb_child_added]
}

function childChanged() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  // [START rtdb_child_changed]
  // Get the data on a post that has changed
  ref.on('child_changed', (snapshot) => {
    const changedPost = snapshot.val();
    console.log('The updated post title is ' + changedPost.title);
  });
  // [END rtdb_child_changed]
}

function childRemoved() {
  const db = admin.database();

  // [START rtdb_child_removed]
  // Get a reference to our posts
  const ref = db.ref('server/saving-data/fireblog/posts');

  // Get the data on a post that has been removed
  ref.on('child_removed', (snapshot) => {
    const deletedPost = snapshot.val();
    console.log('The blog post titled \'' + deletedPost.title + '\' has been deleted');
  });
  // [END rtdb_child_removed]
}

function eventGuarantees() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  // [START rtdb_event_guarantees]
  let count = 0;

  ref.on('child_added', (snap) => {
    count++;
    console.log('added:', snap.key);
  });

  // length will always equal count, since snap.val() will include every child_added event
  // triggered before this point
  ref.once('value', (snap) => {
    console.log('initial data loaded!', snap.numChildren() === count);
  });
  // [END rtdb_event_guarantees]
}

function detatchCallbacks() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  const originalCallback = () => { 
    // ... 
  };

  // [START rtdb_detach_callbacks]
  ref.off('value', originalCallback);
  // [END rtdb_detach_callbacks]
}

function detatchCallbacksContext() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  const originalCallback = () => { 
    // ... 
  };

  /** {@type any} */
  let ctx;

  // [START rtdb_detach_callbacks_context]
  ref.off('value', originalCallback, ctx);
  // [END rtdb_detach_callbacks_context]
}

function detachAllCallbacks() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  // [START rtdb_detach_all_callbacks]
  // Remove all value callbacks
  ref.off('value');

  // Remove all callbacks of any type
  ref.off();
  // [END rtdb_detach_all_callbacks]
}

function readOnce() {
  const db = admin.database();
  const ref = db.ref('server/saving-data/fireblog/posts');

  // [START rtdb_read_once]
  ref.once('value', (data) => {
    // do some stuff once
  });
  // [END rtdb_read_once]
}

function orderByChild() {
  const db = admin.database();

  // [START rtdb_order_by_child]
  const ref = db.ref('dinosaurs');

  ref.orderByChild('height').on('child_added', (snapshot) => {
    console.log(snapshot.key + ' was ' + snapshot.val().height + ' meters tall');
  });
  // [END rtdb_order_by_child]
}

function orderByChildNested() {
  const db = admin.database();

  // [START rtdb_order_by_child_nested]
  const ref = db.ref('dinosaurs');
  ref.orderByChild('dimensions/height').on('child_added', (snapshot) => {
    console.log(snapshot.key + ' was ' + snapshot.val().height + ' meters tall');
  });
  // [END rtdb_order_by_child_nested]
}

function orderByKey() {
  const db = admin.database();

  // [START rtdb_order_by_key]
  var ref = db.ref('dinosaurs');
  ref.orderByKey().on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_order_by_key]
}

function orderByValue() {
  const db = admin.database();

  // [START rtdb_order_by_value]
  const scoresRef = db.ref('scores');
  scoresRef.orderByValue().on('value', (snapshot) => {
    snapshot.forEach((data) => {
      console.log('The ' + data.key + ' dinosaur\'s score is ' + data.val());
    });
  });
  // [END rtdb_order_by_value]
}

function limitToLast() {
  const db = admin.database();

  // [START rtdb_limit_to_last]
  const ref = db.ref('dinosaurs');
  ref.orderByChild('weight').limitToLast(2).on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_limit_to_last]
}

function limitToFirst() {
  const db = admin.database();

  // [START rtdb_limit_to_first]
  const ref = db.ref('dinosaurs');
  ref.orderByChild('height').limitToFirst(2).on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_limit_to_first]
}

function limitOrderValue() {
  const db = admin.database();

  // [START rtdb_limit_order_value]
  const scoresRef = db.ref('scores');
  scoresRef.orderByValue().limitToLast(3).on('value', (snapshot)  =>{
    snapshot.forEach((data) => {
      console.log('The ' + data.key + ' dinosaur\'s score is ' + data.val());
    });
  });
  // [END rtdb_limit_order_value]
}

function startAt() {
  const db = admin.database();

  // [START rtdb_start_at]
  const ref = db.ref('dinosaurs');
  ref.orderByChild('height').startAt(3).on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_start_at]
}

function endAt() {
  const db = admin.database();
  // [START rtdb_end_at]
  const ref = db.ref('dinosaurs');
  ref.orderByKey().endAt('pterodactyl').on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_end_at]
}

function startAtEndAt() {
  const db = admin.database();

  // [START rtdb_start_at_end_at]
  var ref = db.ref('dinosaurs');
  ref.orderByKey().startAt('b').endAt('b\uf8ff').on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_start_at_end_at]
}

function equalTo() {
  const db = admin.database();

  // [START rtdb_equal_to]
  const ref = db.ref('dinosaurs');
  ref.orderByChild('height').equalTo(25).on('child_added', (snapshot) => {
    console.log(snapshot.key);
  });
  // [END rtdb_equal_to]
}

function complexCombined() {
  const db = admin.database();

  // [START rtdb_complex_combined]
  const ref = db.ref('dinosaurs');
  ref.child('stegosaurus').child('height').on('value', (stegosaurusHeightSnapshot) => {
    const favoriteDinoHeight = stegosaurusHeightSnapshot.val();

    const queryRef = ref.orderByChild('height').endAt(favoriteDinoHeight).limitToLast(2);
    queryRef.on('value', (querySnapshot) => {
      if (querySnapshot.numChildren() === 2) {
        // Data is ordered by increasing height, so we want the first entry
        querySnapshot.forEach((dinoSnapshot) => {
          console.log('The dinosaur just shorter than the stegasaurus is ' + dinoSnapshot.key);

          // Returning true means that we will only loop through the forEach() one time
          return true;
        });
      } else {
        console.log('The stegosaurus is the shortest dino');
      }
    });
});
  // [END rtdb_complex_combined]
}
