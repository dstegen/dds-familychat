/*!
 * public/scripts.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

$('#chat.current').keyup( function(event) {
  if (event.keyCode === 13) {
    // start your submit function
    console.log('submit form');
    $.ajax({
      url: '/chat', // url where to submit the request
      type : 'GET', // type of action POST || GET
      dataType : 'json', // data type
      data : { 'id': $('#id.current').val(), 'chat': $('#chat.current').val()}, // post data || get data
      success : function(result) {
          // you can see the result from the console
          // tab of the developer tools
          console.log(result);
          location.reload()
      }
    });
  }
  return true;
});
