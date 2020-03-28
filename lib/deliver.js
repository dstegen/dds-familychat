/*!
 * lib/deliver.js
 * i-n-v-e-n-t-u-r-a (https://github.com/dstegen/i-n-v-e-n-t-u-r-a)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/i-n-v-e-n-t-u-r-a/blob/master/LICENSE)
 */


// Required Moduls
const fs = require('fs');
const path = require('path');
const mimetype = require('mimetype');


function deliver (request) {
  let procDir = path.join(__dirname, '../');
  let sendObj = {
    statusCode: 200,
    contentType: mimetype.lookup(request.url.substr(1)),
    cookie: [],
    location: '/',
    data: ''
  };
  sendObj = getMyFile(sendObj, path.join(procDir, request.url));
  return sendObj;
}

// Additional function
function getMyFile (sendObjLocal, pathLocal) {
  try {
    sendObjLocal.data = fs.readFileSync(pathLocal.split('?')[0]);
  } catch (e) {
    sendObjLocal.statusCode = 404;
    sendObjLocal.data = null;
  }
  return sendObjLocal;
}

module.exports = deliver;
