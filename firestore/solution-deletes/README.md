# Solution: Recursive Deletes

This solution shows how to write a Cloud Function that deletes data
in Cloud Firestore and securely call this function from your
mobile app or website.

## Setup

### On your development machine

  1. Set up your Firebase project in the `solution-deletes` directory
     by running `firebase init`. This solution uses both Firebase Hosting
     and Cloud Functions for Firebase.
  1. Generate a Firebase token using the `firebase login:ci` command.
  1. Add the token to your Cloud Functions runtime configuration using the
     following command:
     ```
     firebase functions:config:set fb.token="YOUR_TOKEN_HERE"
     ```
  1. Run `firebase deploy --only functions` to deploy the Cloud Functions.
  1. Run `firebase serve --only hosting` to run a local version of the
     application.

### In your browser

  1. Enable the **Identity and Access Management (IAM)** API on your project
     in the Google Cloud console by visiting:
     https://console.developers.google.com/apis/api/iam.googleapis.com/overview
  1. In the [IAM page][iam-page] of the Google Cloud console, find the service account
     called the "App Engine default service account" and grant it the
     "Service Account Token Creator" role.

## Usage

  1. Visit `http://localhost:5000` to see the running sample.
  1. Click the **SIGN IN** button. This will call the Cloud Function
     you deployed to generate a custom sign in token, and then
     use that token to sign in on the client.
  1. Enter the path of the document or collection you would like
     to delete, for example `things/thing1`, then click **DELETE**.

[iam-page]: https://console.cloud.google.com/project/_/iam-admin