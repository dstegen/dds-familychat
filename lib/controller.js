/*!
 * lib/controller.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

const deliver = require('./deliver');
const model = require('./model');
let obj = model.getModel();
const view = require('./view');
const viewLogin = require('./viewlogin');

function controller (request, wss, wsport) {
  let fields = {};
  let curCookie = {};
  if (request.headers.cookie) {
    request.headers.cookie.split(';').forEach( cookie => {
      curCookie[cookie.split('=')[0].replace(/\s/,'')] = cookie.split('=')[1];
    });
    console.log(curCookie);
  }
  if (request.url.includes('?')) {
    request.url.split('?')[1].split('&').forEach( item => {
  			fields[item.split('=')[0]] = item.split('=')[1];
  	});
    console.log(fields);
  }
  let sendObj = {
    statusCode: 200,
    contentType: 'text/html; charset=UTF-8',
    cookie: [],
    location: '/',
    data: ''
  };
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public')) {
		return deliver(request);
	} else if (request.url.includes('login')) {
    if (obj.activeMembers.filter( member => member.name == fields.name).length > 0) {
      sendObj.cookie = ['chatterId='+obj.activeMembers.filter( member => member.name == fields.name)[0].id];
    }
    sendObj.statusCode = 302;
    return sendObj;
  } else if(obj.activeMembers.map( member => { return member.id }).includes(parseInt(curCookie.chatterId))) {
    sendObj.data = view(request, wss, wsport, model.updateModel(obj, fields), curCookie.chatterId);
    return sendObj;
  } else {
    sendObj.data = viewLogin();
    return sendObj;
  }
}

module.exports = controller;