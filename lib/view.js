/*!
 * lib/view.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

let counter = -1;
let curMemberId = '';

function view (request, wss, wsport, obj, curMemberIdIn) {
  curMemberId = curMemberIdIn;
  const angle = Math.abs(360 / obj.activeMembers.filter( member => member.active === true).length);
  const startangle = {
    0: 180,
    1: 180,
    2: 180,
    3: 270,
    4: 225,
    5: 270,
    6: 225,
    7: 270
  }
  counter = -1;
  return `
    <!DOCTYPE HTML>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!-- Bootstrap, jquery and CSS -->
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/node_modules/jquery-ui-dist/jquery-ui.min.css">
        <link rel="stylesheet" href="/public/styles.css">
        <title>familyChat</title>
      </head>
      <body>

        <script>
          document.documentElement.style.setProperty('--startangle', '${startangle[obj.activeMembers.filter( member => member.active === true).length]}deg');
          document.documentElement.style.setProperty('--angle', '${angle}deg');
        </script>

        <div class="container d-block text-center w-100 h-100">
          <h1>familyChat</h1>

          <div class='circle-container'>
      			${obj.activeMembers.filter( member => member.active === true).map(createChatter).join('')}
      		</div>

          <!-- Footer -->
          <div class="footer">
            <div class="small text-center py-4 border-top">
              &copy; 2020 by Daniel Stegen
            </div>
          </div>
        </div>

        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script src="/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="/public/scripts.js"></script>

      </body>
    </html>
  `;
}

function createChatter (chatter) {
  counter++;
  let disabled = 'disabled';
  let addClass = '';
  if (chatter.id == curMemberId) {
    disabled = '';
    addClass = "current";
  }
  if (chatter.active) {
    return `
    <div class="chatter chatter${counter}">
      <img class="rounded-circle" src="${chatter.photo}" alt=""/>
      <small>${chatter.name}</small>
      <div class="speakbox">
        <form id="chatform_${chatter.id}" action="/chat" method="GET">
          <input type="texte" id="id" name="id" value="${chatter.id}" class="d-none ${addClass}" />
          <textarea class="form-control ${addClass}" id="chat" name="chat" rows="3" ${disabled}>${chatter.chat}</textarea>
          <input type="submit" class="d-none"/>
        </form>
      </div>
    </div>
    `;
  } else {
    return '';
  }
}

module.exports = view;
