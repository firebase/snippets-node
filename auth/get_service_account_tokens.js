/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
// [START get_service_account_tokens]
const admin = require('firebase-admin');

const serviceAccount = require('./path/to/serviceAccountKey.json');
const credential = admin.credential.cert(serviceAccount);

credential.getAccessToken().then((accessTokenInfo) => {
  const accessToken = accessTokenInfo.access_token;
  const expirationTime = accessTokenInfo.expires_in;

  // Attach accessToken to HTTPS request in the "Authorization: Bearer" header
  // After expirationTime, you must generate a new access token
  // [START_EXCLUDE]
  console.log(`The token ${accessToken} expires in ${expirationTime}`);
  // [END_EXCLUDE]
});
// [END get_service_account_tokens]
