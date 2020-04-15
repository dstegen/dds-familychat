/*!
 * index.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

'use strict';

// Name the process
process.title = 'dds-familychat';

// Required modules
const http = require('http');
const WebSocket = require('ws');
const {getIPs} = require('webapputils-ds');
const router = require('./lib/router');

let port = 8080;
let wsport = 8080;
let host = 'localhost';
if (getIPs()['en0']) {
	host = getIPs()['en0'];
} else if (getIPs()['wlo1']) {
	host = getIPs()['wlo1'];
} else if (getIPs()['eth0']) {
	host = getIPs()['eth0'];
}

try {
	if (process.argv[2] && process.argv[2].includes('port')) {
		port = Number(process.argv[2].split('=')[1]);
		wsport = Number(process.argv[2].split('=')[1]);
	}
} catch (e) {
	console.log('ERROR reading port number from command line: '+e);
}

console.log('Available network devices: ');
console.log(getIPs());

const server = http.createServer( function (request, response) {
  router(request, response, wss, wsport);
}).listen(port, host, () => console.log('DDS-FamilyChat is online: http://'+host+':'+port+' (wsport:'+wsport+')'));

const wss = new WebSocket.Server({
	server,
	clientTracking: true
});

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
});
