function clearErrorMessage() {
  for(let i = 0; i < $('.error-msg').length; i++) {
    id = $('.error-msg')[0].id;
    $("#" +id + "").text();
  }
}

function showErrorMessage(error) {
  for(let i = 0; i < error.length; i++) {
    id = "error-" + error[i].param;
    $("#" +id + "").text(error[i].msg);
  }
}

//3 functions is for show modal message
function getTimePassed(time){
  let now = Date.now();
  let passed = parseInt((now - time) / 1000);

  if(passed < 60){
      return `${passed} ${passed == 1 ? 'second' : 'seconds'} ago`;
  }
  if(passed < 3600){
      let t = parseInt(passed / 60);
      return `${t} ${t == 1 ? 'minute' : 'minutes'} ago`;
  } 
  if(passed < 3600 * 24){
      let t = parseInt(passed / 3600);
      return `${t} ${t == 1 ? 'hour' : 'hours'} ago`;
  }
  if(passed < 3600 * 24 * 7){
      let t = parseInt(passed / (3600 * 24));
      return `${t} ${t == 1 ? 'day' : 'days'} ago`;
  }

  if(passed < 3600 * 24 * 30){
      let t = parseInt(passed / (3600 * 24 * 7));
      return `${t} ${t == 1 ? 'week' : 'weeks'} ago`;
  }
  if(passed < 3600 * 24 * 365){
      let t = parseInt(passed / (3600 * 24 * 30));
      return `${t} ${t == 1 ? 'month' : 'months'} ago`;
  }
  else{
      let t = parseInt(passed / (3600 * 24 * 365));
      return `${t} ${t == 1 ? 'year' : 'years'} ago`;
  } 
}

function renderModelUserMsg(data, name) {

  let html = '';

  data.forEach((msg, index) => {
      html += `
          <li class="right clearfix">
              <span class="chat-img pull-right">
                  <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
              </span>
              <div class="chat-body clearfix">
                  <div class="header">
                      <small class=" text-muted">
                          <span class="glyphicon glyphicon-time"></span>${getTimePassed(msg.time)}</small>
                      <strong class="pull-right primary-font">${name}</strong>
                  </div>
                  <p>${msg.message} </p>
              </div>
          </li>
          <li class="left clearfix">
              <span class="chat-img pull-left">
                  <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />
              </span>
              <div class="chat-body clearfix">
                  <div class="header">
                      <strong class="primary-font">Chatbot</strong>
                      <small class="pull-right text-muted">
                          <span class="glyphicon glyphicon-time"></span>${getTimePassed(msg.time)}</small>
                  </div>
                  <p>${msg.message} </p>
              </div>
          </li>
      `
  })

  $('#modelUserMsg').find('.chat').html(html);
  $('#modelUserMsg').modal('show');
 
}

function closeModalMsg(){
  $('#modelUserMsg').modal('hide');
}

function renderModalFrame(){
  $('#modelUserMsg').remove();
  
  $('.content-wrapper').append(`
    <div class="modal fade" id="modelUserMsg" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="panel panel-primary">

                <div class="panel-heading">
                    <span class="glyphicon glyphicon-comment"></span> Chat
                    <div class="btn-group pull-right text-right">
                        <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" onClick="closeModalMsg()">
                            <span class="glyphicon glyphicon-remove"></span>
                        </button>

                    </div>
                </div>

                <div class="panel-body">

                    <ul class="chat">

                    </ul>

                </div>

            </div>
        </div>
    </div>
  </div>
  `)
}