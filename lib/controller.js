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
    //console.log(curCookie);
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
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('myfamily')) {
		return deliver(request);
	} else if (request.url.includes('login')) {
    if (obj.activeMembers.filter( member => member.name == fields.name).length > 0) {
      sendObj.cookie = ['chatterId='+obj.activeMembers.filter( member => member.name == fields.name)[0].id];
      obj.activeMembers.filter( member => member.name == fields.name)[0].active = true;
    }
    sendObj.statusCode = 302;
    wsFeddback(wss, 'update');
    return sendObj;
  } else if (request.url.includes('logout')) {
    if (obj.activeMembers.filter( member => member.id == fields.id).length > 0) {
      obj.activeMembers.filter( member => member.id == fields.id)[0].active = false;
    }
    sendObj.cookie = ['chatterId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'];
    sendObj.statusCode = 302;
    wsFeddback(wss, 'update');
    return sendObj;
  } else if(obj.activeMembers.map( member => { return member.id }).includes(parseInt(curCookie.chatterId))) {
    obj.activeMembers.filter( member => member.id === parseInt(curCookie.chatterId))[0].active = true;
    sendObj.data = view(request, wss, wsport, model.updateModel(obj, fields), parseInt(curCookie.chatterId), fields);
    if (request.url.includes('chat')) wsFeddback(wss, 'update');
    return sendObj;
  } else {
    sendObj.data = viewLogin();
    return sendObj;
  }
}

// Additional functions

function wsFeddback (wss, txt) {
  if (txt == undefined || txt == '') txt ='test';
  wss.clients.forEach(client => {
    //console.log(client.readyState);
    setTimeout(function () {
      client.send(txt)
    }, 100);
  });
}

module.exports = controller;
