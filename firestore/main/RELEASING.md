# Releasing a Firestore SDK

## Creating the archive

1. Clone the repo `git clone git@github.com:FirebasePrivate/gcloud-node-private.git`
1. Change into the directory `cd gcloud-node-private`
1. Switch to the firestore branch `git pull origin firestore:firestore && git checkout firestore`
1. Find the Firestore package `cd packages/`
1. Modify `firestore/package.json`'s `version` field appropriately
1. Create a tarball `tar -cvf "firestore-$(cat firestore/package.json | jq ".version" -r).tgz" firestore/`
1. Move that tarball into your project directory `mv firestore*.tgz $YOUR_PROJECT_DIR`
1. Move your project directory `cd $YOUR_PROJECT_DIR`
1. Remove any existing `node_modules` by running `rm -rf node_modules/`
1. Install your build `npm install firestore-*.tgz --save`
1. Install testing dependencies `npm install`
1. Run the tests `npm run test`
1. Update the `package.json` version to the next point release on the `firestore` branch

If all test's pass you're ready to move on!

## Upload the archive

1. Open the [firebase-preview-drop](https://pantheon.corp.google.com/storage/browser/firebase-preview-drop/node/firestore/) bucket.
1. Upload your `.tgz`

## Update the docs
1. Edit the node version listed in [_local_variables.html](https://cs.corp.google.com/piper///depot/google3/googledata/devsite/_common/en/_shared/firestore/_local_variables.html)
1. Perform a CL
1. Publish the changes

## Email firestore-trusted-testers

Email the group `firestore-trusted-testers@googlegroups.com ` with an email tagged `[Announce]` with a link to the new version and setup guide with notable changes [using this format](https://groups.google.com/forum/?utm_medium=email&utm_source=footer#!msg/firestore-trusted-testers/86gt0Fjy-nA/JKndOSqCBgAJ).
