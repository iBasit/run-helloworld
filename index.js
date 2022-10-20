// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START cloudrun_helloworld_service]
// [START run_helloworld_service]
const express = require('express');
const app = express();
const {OAuth2Client} = require('google-auth-library');



app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';

  const iapJwt = req.header['x-goog-iap-jwt-assertion']; // JWT from the "x-goog-iap-jwt-assertion" header
  console.log(iapJwt)

  const oAuth2Client = new OAuth2Client();

  let expectedAudience = `/projects/689674144422/global/backendServices/4725503496770607205`;

  async function verify(iapJwt) {
    // Verify the id_token, and access the claims.
    const response = await oAuth2Client.getIapPublicKeys();
    const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
        iapJwt,
        response.pubkeys,
        expectedAudience,
        ['https://cloud.google.com/iap']
    );
    // Print out the info contained in the IAP ID token
    console.log(ticket);
  }
  verify(iapJwt).catch(console.error);

  res.send(`Hello ${name}! 2`);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
// [END run_helloworld_service]
// [END cloudrun_helloworld_service]

// Exports for testing purposes.
module.exports = app;
