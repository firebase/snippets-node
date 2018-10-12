# Cloud Firestore Scheduled Backups

This sample demonstrates using AppEngine cron jobs to run nightly backups
of data in Cloud Firestore.

## Setup

### 1 - Create a Project
If you haven't already, create a new Firebase project and create a Cloud
Firestore database within the project.

### 2 - Configure IAM
This sample will use the AppEngine default service account to perform
backups of your Cloud Firestore data. To do this, you will need to give
the service account permission to access your data and save it to
google cloud storage.

Make the service account a Datastore Import/Export Admin:

```shell
$ gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com --role roles/datastore.importExportAdmin
```

Give the service account permission to write to the GCS bucket you
are going to use. Here, we will use the default bucket:

```shell
$ gsutil iam ch \
  serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com:objectCreator \
  gs://YOUR_PROJECT_ID.appspot.com
```

### 3 - Configure Cron
Open `cron.yaml` and edit this line:

```
/cloud-firestore-export?outputUriPrefix=gs://BUCKET_NAME[/PATH]&collections=test1,test2
```

You should change `gs://BUCKET_NAME[/PATH]` to the Google Cloud Storage
path where your data should be backed up. If you only want to back up certain
collections, change `test1,test2` to a comma-separated list of those collections.
Otherwise, delete the `&collections=test1,test2` param.

## Deploy

To deploy the project, run:

```
$ gcloud app deploy app.yaml cron.yaml
```

To make sure it deployed correctly, navigate to https://YOUR_PROJECT_ID.appspot.com/

## Test

To test the backup, navigate to the following URL:
https://YOUR_PROJECT_ID.appspot.com/cloud-firestore-export?outputUriPrefix=gs://YOUR_PROJECT_ID.appspot.com

You should see some output like this, letting you know that a backup
was started:

```js
{
  name: "projects/YOUR_PROJECT_ID/databases/(default)/operations/ASA2NDIwNjI3ODQJGnRsdWFmZWQHEmxhcnRuZWNzdS1zYm9qLW5pbWRhFAosEg",
  metadata: {
    @type: "type.googleapis.com/google.firestore.admin.v1beta1.ExportDocumentsMetadata",
    startTime: "2018-10-11T22:47:15.473517Z",
    operationState: "PROCESSING",
    outputUriPrefix: "gs://YOUR_PROJECT_ID.appspot.com/2018-10-11-22-47-15"
  }
}
```
