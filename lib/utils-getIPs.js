/*!
 * lib/utils-getIPs.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


// Required Moduls
const os = require('os');

function getIPs () {
  let interfaces = os.networkInterfaces();
  let addresses = {};
  for (var k in interfaces) {
    for (var m in interfaces[k]) {
      var address = interfaces[k][m];
      if (address.family === 'IPv4') {
        addresses[k] = address.address;
      }
    }
  }
  //console.log(addresses);
  return addresses;
}

module.exports = getIPs;