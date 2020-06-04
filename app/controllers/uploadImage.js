var Controller = require(global.appRoot + '/core/controller');

class ImgUploadController extends Controller {
  static uploadImg(req, res) {

    if (!req.files)
      return res.send({success: false, msg: 'No files uploaded'});

    let imgUploadToServer = req.files.imgUploadToServer;

    if(!imgUploadToServer)
      return res.send({success: false, msg: 'No files uploaded'});

    if (checkImg(imgUploadToServer.mimetype)) {
      let filename = imgUploadToServer.name;
      // Use the mv() method to place the file somewhere on your server
      imgUploadToServer.mv(`./public/images/${filename}`, function (err) {
        if (err)  
        return res.send({success: false, msg: 'File can not be saved'});
        return res.send({success:true});
      });
    }else{
      return res.send({success:false, msg:'Image only!'});
    }
  }

  static renderView(req, res){
    res.render('pages/imageUpload/tabs1');
  }
}

function checkImg(mimeType) {
  if(mimeType == null || mimeType == undefined) return false;
  if(mimeType.indexOf('jpeg') > -1 || mimeType.indexOf('png') > -1) return true;
  return false;
}

module.exports = ImgUploadController;