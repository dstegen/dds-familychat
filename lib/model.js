/*!
 * lib/model.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

const fs = require('fs');
const path = require('path');

function getModel () {
  let obj = {
    activeMembers: [
      { name: 'Emmanuel',
        photo: 'media/portrait-woman-1.jpg',
        chat: 'Hello I\'m Emmanuel...\n',
        id: 0,
        active: false
      },
      { name: 'Philip',
        photo: 'media/portrait-man-1.jpg',
        chat: 'Hello I\'m Philip...\n',
        id: 1,
        active: false
      },
      { name: 'Anna',
        photo: 'media/portrait-woman-2.jpg',
        chat: 'Hello I\'m Anna...\n',
        id: 2,
        active: false
      },
      { name: 'Dave',
        photo: 'media/portrait-man-2.jpg',
        chat: 'Hello I\'m Dave...\n',
        id: 3,
        active: false
      },
      { name: 'Lisa',
        photo: 'media/portrait-woman-3.jpg',
        chat: 'Hello I\'m Lisa...\n',
        id: 4,
        active: false
      }
    ]
  }
  return obj;
}

function updateModel (obj, fields) {
  if (fields != '' && fields.chat != '' && fields.id != '' && obj.activeMembers.filter( member => member.id == fields.id)[0] != undefined) {
    obj.activeMembers.filter( member => member.id == fields.id)[0].chat = decodeURIComponent(fields.chat).replace(/\+/g,' ');
    console.log(obj);
  }
  return obj;
}

module.exports = { getModel, updateModel }
