const bsadmin = require('../app/controllers/bsadmin');
const content = require('../app/controllers/content');
const chatbot = require('../app/controllers/chatbotCtrl');
const chatbotMsg = require('../app/controllers/chatbotMsgCtrl');
const broadCase = require('../app/controllers/broadCase');
const tag = require('../app/controllers/tagCtrl');
const uploadImg = require('../app/controllers/uploadImage');

module.exports = function (app, passport) {

    // handle verification chatbot FB
    // app.get('/', chatbot.verifycation);
    // app.post('/', chatbot.messageWebhook);

    //handle chatbot messnger
    app.get('/chatbotMsg', chatbotMsg.renderView);
    app.post('/getAllLastMsg', chatbotMsg.getAllLastMsg);
    app.post('/getDataOneUser', chatbotMsg.getDataOneUser);

    //handle broadcase route
    app.get('/broadcase', broadCase.renderView);
    app.post('/addBroadcase', broadCase.addBroadcaseData);
    app.post('/getBroadcaseData', broadCase.getBroadcaseData);
    app.post('/getFullnameUser', broadCase.getFullnameUser);

    //handle tag route
    app.get('/tags_list', tag.renderTagList);
    app.get('/input_tag', tag.renderInputtagView);
    app.get('/edit_tag/:tagName', tag.renderEdittagView);
    app.get('/getTagsList', tag.getTagsList);
    app.get('/getAllUser', tag.getAllUser);
    app.post('/getAllUsersByTagname', tag.getAllUsersByTagname);
    app.post('/removeTag', tag.removeTag);
    app.post('/removeUserTag', tag.removeUserTag);
    app.post('/updateTagName', tag.updateTagName);
    app.post('/addTagToUsers', tag.addTagToUsers);

    //handle upload and show image gallery
    app.post('/uploadImg', uploadImg.uploadImg);
    app.get('/uploadImg', uploadImg.renderView);

    //handle render json menu
    app.get('/json', bsadmin.menu);

    // app.get('/', (req, res) => {
    //     res.render('pages/content');
    // })

    // app.get('/login', bsadmin.login);
    // app.get('/signup', bsadmin.signup);

    // app.get('/', bsadmin.loggedIn, bsadmin.home);//home
    // app.get('/bs-admin/home', bsadmin.loggedIn, bsadmin.home);//home
    
    

    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/bs-admin/home', // redirect to the secure profile section
    //     failureRedirect: '/signup', // redirect back to the signup page if there is an error
    //     failureFlash: true // allow flash messages
    // }));
    // // process the login form
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect: '/bs-admin/home', // redirect to the secure profile section
    //     failureRedirect: '/login', // redirect back to the signup page if there is an error
    //     failureFlash: true // allow flash messages
    // }));


    app.get('/bs-admin/content/show',  content.contentdetail);//content
    // app.get('/bs-admin/content/edit',  bsadmin.loggedIn, content.editdetail);//content
    // app.post("/bs-admin/content/save",  content.save); // save the information  
    // app.post("/bs-admin/content/show",  content.show); //show data to content table
    // app.post("/bs-admin/content/delete",  content.delete); //delete record
    // app.post("/bs-admin/content/edit",  content.edit); //get the found and send GET request to render the found
    
}