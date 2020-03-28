/*!
 * index.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

const http = require('http');
const WebSocket = require('ws');

const getIPs = require('./lib/utils-getIPs');
const controller = require('./lib/controller');

let port = 8080;
let wsport = 8080;
let host = 'localhost';
if (getIPs()['en0']) {
	host = getIPs()['en0'];
} else if (getIPs()['wlo1']) {
	host = getIPs()['wlo1'];
} else if (getIPs()['eth0']) {
	host = getIPs()['eth0'];
	wsport = 80;
}
console.log('Available network devices: ');
console.log(getIPs());

const server = http.createServer( function (request, response) {
  sendResponse(controller(request, wss, wsport), response);
}).listen(port, host, () => console.log('DDS-FamilyChat is online: http://'+host+':'+port+' (wsport:'+wsport+')'));

const wss = new WebSocket.Server({
	server,
	clientTracking: true
});


// Additional function

function sendResponse (sendObj, response) {
  response.writeHead(sendObj.statusCode, {
      location: sendObj.location,
      'set-cookie': sendObj.cookie,
      'content-type': sendObj.contentType });
  response.end(sendObj.data);
}
