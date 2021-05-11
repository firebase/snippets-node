const admin = require('firebase-admin');

function subscribeToTopic() {
  const topic = 'test';

  // [START fcm_subscribe_to_topic]
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'YOUR_REGISTRATION_TOKEN_1',
    // ...
    'YOUR_REGISTRATION_TOKEN_n'
  ];

  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  admin.messaging().subscribeToTopic(registrationTokens, topic)
    .then((response) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });
  // [END fcm_subscribe_to_topic]
}

function unsubscribeFromTopic() {
  const topic = 'test';

  // [START fcm_unsubscribe_from_topic]
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'YOUR_REGISTRATION_TOKEN_1',
    // ...
    'YOUR_REGISTRATION_TOKEN_n'
  ];

  // Unsubscribe the devices corresponding to the registration tokens from
  // the topic.
  admin.messaging().unsubscribeFromTopic(registrationTokens, topic)
    .then((response) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully unsubscribed from topic:', response);
    })
    .catch((error) => {
      console.log('Error unsubscribing from topic:', error);
    });
  // [END fcm_unsubscribe_from_topic]
}

function sendMessageToken() {
  // [START fcm_send_message_token]
  // This registration token comes from the client FCM SDKs.
  const registrationToken = 'YOUR_REGISTRATION_TOKEN';

  const message = {
    data: {
      score: '850',
      time: '2:45'
    },
    token: registrationToken
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_send_message_token]
}

function sendMessageTopic() {
  // [START fcm_send_message_topic]
  // The topic name can be optionally prefixed with "/topics/".
  const topic = 'highScores';

  const message = {
    data: {
      score: '850',
      time: '2:45'
    },
    topic: topic
  };

  // Send a message to devices subscribed to the provided topic.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_send_message_topic]
}

function sendMessageCondition() {
  // [START fcm_send_message_condition]
  // Define a condition which will send to devices which are subscribed
  // to either the Google stock or the tech industry topics.
  const condition = '\'stock-GOOG\' in topics || \'industry-tech\' in topics';

  // See documentation on defining a message payload.
  const message = {
    notification: {
      title: '$FooCorp up 1.43% on the day',
      body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    condition: condition
  };

  // Send a message to devices subscribed to the combination of topics
  // specified by the provided condition.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_send_message_condition]
}

function sendMessageMultipleDevices() {
  // [START fcm_send_message_multiple_devices]
  // Create a list containing up to 500 registration tokens.
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'YOUR_REGISTRATION_TOKEN_1',
    // …
    'YOUR_REGISTRATION_TOKEN_N',
  ];

  const message = {
    data: {score: '850', time: '2:45'},
    tokens: registrationTokens,
  };

  admin.messaging().sendMulticast(message)
    .then((response) => {
      console.log(response.successCount + ' messages were sent successfully');
    });
  // [END fcm_send_message_multiple_devices]
}

function sendMulticast() {
  // [START fcm_send_multicast]
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'YOUR_REGISTRATION_TOKEN_1',
    // …
    'YOUR_REGISTRATION_TOKEN_N',
  ];

  const message = {
    data: {score: '850', time: '2:45'},
    tokens: registrationTokens,
  };

  admin.messaging().sendMulticast(message)
    .then((response) => {
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          }
        });
        console.log('List of tokens that caused failures: ' + failedTokens);
      }
    });
  // [END fcm_send_multicast]
}

function sendAll() {
  const registrationToken = '...';

  // [START fcm_send_all]
  // Create a list containing up to 500 messages.
  const messages = [];
  messages.push({
    notification: { title: 'Price drop', body: '5% off all electronics' },
    token: registrationToken,
  });
  messages.push({
    notification: { title: 'Price drop', body: '2% off all books' },
    topic: 'readers-club',
  });

  admin.messaging().sendAll(messages)
    .then((response) => {
      console.log(response.successCount + ' messages were sent successfully');
    });
  // [END fcm_send_all]
}

function notificationMessage() {
  // [START fcm_notification_message]
  const topicName = 'industry-tech';

  const message = {
    notification: {
      title: '`$FooCorp` up 1.43% on the day',
      body: 'FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    android: {
      notification: {
        icon: 'stock_ticker_update',
        color: '#7e55c3'
      }
    },
    topic: topicName,
  };

  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_notification_message]
}

function notificationMessageImage() {
  // [START fcm_notification_message_image]
  const topicName = 'industry-tech';

  const message = {
    notification: {
      title: 'Sparky says hello!'
    },
    android: {
      notification: {
        imageUrl: 'https://foo.bar.pizza-monster.png'
      }
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1
        }
      },
      fcm_options: {
        image: 'https://foo.bar.pizza-monster.png'
      }
    },
    webpush: {
      headers: {
        image: 'https://foo.bar.pizza-monster.png'
      }
    },
    topic: topicName,
  };

  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_notification_message_image]
}

function notificationMessageClick() {
  // [START fcm_notification_message_click]
  const topicName = 'industry-tech';

  const message = {
    notification: {
      title: 'Breaking News....'
    },
    android: {
      notification: {
        clickAction: 'news_intent'
      }
    },
    apns: {
      payload: {
        aps: {
          'category': 'INVITE_CATEGORY'
        }
      }
    },
    webpush: {
      fcmOptions: {
        link: 'breakingnews.html'
      }
    },
    topic: topicName,
  };

  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_notification_message_click]
}

function notificationMessageLocalization() {
  // [START fcm_notification_message_localization]
  var topicName = 'industry-tech';

  var message = {
    android: {
      ttl: 3600000,
      notification: {
        bodyLocKey: 'STOCK_NOTIFICATION_BODY',
        bodyLocArgs: ['FooCorp', '11.80', '835.67', '1.43']
      }
    },
    apns: {
      payload: {
        aps: {
          alert: {
            locKey: 'STOCK_NOTIFICATION_BODY',
            locArgs: ['FooCorp', '11.80', '835.67', '1.43']
          }
        }
      }
    },
    topic: topicName,
  };

  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_notification_message_localization]
}

function sendToDevice() {
  // [START fcm_send_to_device]
  // This registration token comes from the client FCM SDKs.
  const registrationToken = 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...';

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  const payload = {
    data: {
      score: '850',
      time: '2:45'
    }
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken, payload)
    .then((response) => {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_send_to_device]
}

function sendToDeviceMultiple() {
  // [START fcm_send_to_device_multiple]
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = [
    'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...',
    // ...
    'ecupwIfBy1w:APA91bFtuMY7MktgxA3Au_Qx7cKqnf...'
  ];

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  const payload = {
    data: {
      score: '850',
      time: '2:45'
    }
  };

  // Send a message to the devices corresponding to the provided
  // registration tokens.
  admin.messaging().sendToDevice(registrationTokens, payload)
    .then((response) => {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_send_to_device_multiple]
}

function sendToDeviceGroup() {
  // [START fcm_send_to_device_group]
  // See the "Managing device groups" link above on how to generate a
  // notification key.
  const notificationKey = 'some-notification-key';

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  const payload = {
    data: {
      score: '850',
      time: '2:45'
    }
  };

  // Send a message to the device group corresponding to the provided
  // notification key.
  admin.messaging().sendToDeviceGroup(notificationKey, payload)
    .then((response) => {
      // See the MessagingDeviceGroupResponse reference documentation for
      // the contents of response.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_send_to_device_group]
}

function payloadNoticication() {
  // [START fcm_payload_notification]
  const payload = {
    notification: {
      title: '$FooCorp up 1.43% on the day',
      body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    }
  };
  // [END fcm_payload_notification]
}

function payloadData() {
  // [START fcm_payload_data]
  const payload = {
    data: {
      score: '850',
      time: '2:45'
    }
  };
  // [END fcm_payload_data]
}

function payloadCombined() {
  // [START fcm_payload_combined]
  const payload = {
    notification: {
      title: '$FooCorp up 1.43% on the day',
      body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    data: {
      stock: 'GOOG',
      open: '829.62',
      close: '635.67'
    }
  };
  // [END fcm_payload_combined]
}

function messageOptions() {
  // [START fcm_message_options]
  // This registration token comes from the client FCM SDKs.
  const registrationToken = 'bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...';

  // See the "Defining the message payload" section above for details
  // on how to define a message payload.
  const payload = {
    notification: {
      title: 'Urgent action needed!',
      body: 'Urgent action is needed to prevent your account from being disabled!'
    }
  };

  // Set the message as high priority and have it expire after 24 hours.
  const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
  };

  // Send a message to the device corresponding to the provided
  // registration token with the provided options.
  admin.messaging().sendToDevice(registrationToken, payload, options)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  // [END fcm_message_options]
}
