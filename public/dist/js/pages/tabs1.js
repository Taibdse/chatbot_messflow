$(() => {
  //bind and handdle event

  $('.btn-show-upload-img').click(showUploadContent);
  $('.btn-show-gallery').click(showGallery);

})

function uploadImage() {
  event.preventDefault();

  let formData = new FormData();
  let file = $('#inputUploadFileImg')[0].files[0];
  formData.append('imgUploadToServer', file);

  $.ajax({
      url: '/uploadImg',
      method: 'post',
      data: formData,
      processData: false,
      contentType: false
    })
    .then(res => {
      if (res.success) alert('success');
      else alert(res.msg);
      this.reset();
    })
}

function renderUploadForm() {
  return `
    <div class="row">
      <div class="col-12 text-center">
        <form action="/uploadImg" encType="multipart/form-data" method="POST" id="formUploadImage">
          <label class="btn btn-default" style="width: 400px; padding-bottom: 20px">
            <img src="images/upload-512.png" alt="" style="width: 50px">
            <br>
            <span class="btn btn-success">Choose file to upload</span>
            <br>
            <input type="file" hidden class="form-control" style="margin-top: 20px" name="imgUploadToServer" id="inputUploadFileImg">
            <br>
            <span class="text-center">or drag and drop them here</span>
          </label>
          <br><br>
          <button class="btn btn-success" type="submit">Upload to server</button>
        </form>
      </div>
    </div>
    `
}

function chooseImg() {
  $ele = $(event.target);
  $ele.parent('.well').toggleClass('chosen-img');
}

function saveImgHiddenField() {
  // save img to hidden field
  let selectedImg = '';
  $('.chosen-img').each((index, ele) => {
    selectedImg += $(ele).children('img').attr('src') + ', ';
  })
  selectedImg = selectedImg.substring(0, selectedImg.length - 2);
  $('.popup-selected-image').val(selectedImg);
  //hide popup
  $('#modalUploadImg').modal('hide');
}

function showUploadContent() {
  let html = renderUploadForm();
  $('#modalUploadImg').find('.modal-body').html(html);
  $('#formUploadImage').submit(uploadImage);
}

function showGallery() {
  let html = renderGalleryContent();
  $('#modalUploadImg').find('.modal-body').html(html);
  $('.img-show').click(chooseImg);
  $('.btn-select-img').click(saveImgHiddenField);
}

function renderGalleryContent() {
  return `
    <div class="row">
      <div class="col-sm-10"></div>
      <div class="col-sm-2">
        <button class="btn btn-primary btn-block btn-select-img">Select</button>
      </div>
    </div>
    <div class="row mt-5" style="margin-top: 15px;">
      <div class="col-sm-3">
        <div class="well">
          <img src="images/pexels-photo-247835.jpeg" alt="" class="img-responsive img-show">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="well">
          <img src="images/pexels-photo-666988.jpeg" alt="" class="img-responsive img-show">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="well">
          <img src="images/pexels-photo-699466.jpeg" alt="" class="img-responsive img-show">
        </div>
      </div>
      <div class="col-sm-3">
        <div class="well">
          <img src="images/pexels-photo-714059.jpeg" alt="" class="img-responsive img-show">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-8 mx-auto">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">2</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">3</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">4</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">5</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    `
}