/*!
 * index.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

'use strict';

// Required modules
const {ServerDS} = require('webapputils-ds');
const router = require('./lib/router');


// Name the process
process.title = 'dds-familychat';

let port = 8080;

try {
	if (process.argv[2] && process.argv[2].includes('port')) {
		port = Number(process.argv[2].split('=')[1]);
	}
} catch (e) {
	console.log('ERROR reading port number from command line: '+e);
}

const server = new ServerDS('dds-familychat', port);
server.setCallback(router);
server.startServer();
