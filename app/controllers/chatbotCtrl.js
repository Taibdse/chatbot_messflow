const Controller = require(global.appRoot + '/core/controller');
//constant of this project
const constantObj = require('../../config/constants');

const Chatbot = require('../../service/chatbot.service');

const pageAccessToken = constantObj.pageAccessToken;
const appID = constantObj.appID;
const appSecret = constantObj.appSecret
const serverUrl = constantObj.serverUrl;
const verify_token = constantObj.verify_token;

const commonCore = require(global.appRoot + '/core/common');

const images = [
    'images/pexels-photo-247835.jpeg',
    'images/pexels-photo-666988.jpeg',
    'images/pexels-photo-699466.jpeg',
    'images/pexels-photo-714059.jpeg',
    'images/pexels-photo-753994.jpeg',
    'images/pexels-photo-920041.jpeg',
    'images/pexels-photo-994883.jpeg',
    'images/pexels-photo-997664.jpeg',
    'images/pexels-photo-998242.jpeg',
    'images/pexels-photo-1019980.jpeg',
]

const { MessengerClient } = require('messaging-api-messenger');
const client = MessengerClient.connect(pageAccessToken);

class ChatbotController extends Controller {

    //this function is to verify if webhook has been connected
    static verifycation(req, res) {
        console.log('started webhook');
        if (
            req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === verify_token
        ) {
            res.send(req.query['hub.challenge']);
        } else {
            console.error('Failed validation. Make sure the validation tokens match.');
            res.sendStatus(403);
        }
    }

    //this function is to handle post method when user inbox chatbot
    static async messageWebhook(req, res) {
        const event = req.body.entry[0].messaging[0];
        const userId = event.sender.id;

        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    if (event.message && event.message.text) {

                        const {
                            recipient,
                            sender,
                            timestamp,
                            message
                        } = event;

                        if (sender.id) {
                            let data = {
                                time: timestamp,
                                who: 'guest',
                                message: message.text
                            }

                            let content = {
                                type: 'messager',
                                uid: sender.id,
                                data: data,
                                tag:[]
                            }

                            //get data from user before sending message
                            let url = `https://graph.facebook.com/v2.6/${sender.id}?fields=first_name,last_name,gender&access_token=${pageAccessToken}`;

                            commonCore.doRequest(url).then(res => {
                                    res = JSON.parse(res);
                                    content.gender = res.gender;
                                    content.fullname = res.first_name + ' ' + res.last_name;
                                    Chatbot.addCom(content);
                                })
                                .catch(err => console.log(err.message));
                        }

                        //get user's message
                        let text = event.message.text.toLowerCase();

                        //send user bot's message
                        if (text.indexOf('image') > -1 || text.indexOf('img') > -1){
                            ChatbotController.sendImageToUser(client, userId);
                        }     
                        else if (text.indexOf('template') > -1){
                            ChatbotController.sendTemplateToUser(client, userId);
                        }
                        else{
                            ChatbotController.sendTextToUser(client, userId, event.message.text);
                        }
                    }
                });
            });
            res.status(200).end();
        }
    }

    //send text to user
    static sendTextToUser(client, userId, text) {
        client.sendText(userId, text);
    }
    //send image to user
    static sendImageToUser(client, userId) {
        let index = Math.floor(Math.random() * images.length);
        client.sendImage(userId, `${serverUrl}/${images[index]}`);
    }
    //send template to user
    static sendTemplateToUser(client, userId) {

        client.sendGenericTemplate(
            userId, [{
                title: `Title`,
                image_url: 'https://res.cloudinary.com/twenty20/private_images/t_watermark-criss-cross-10/v1523811421000/photosp/5f374c18-674a-4267-a6e7-72329a8571e7/stock-photo-illustration-technology-futuristic-security-artificial-robot-computer-intelligence-virtual-5f374c18-674a-4267-a6e7-72329a8571e7.jpg',
                subtitle: "We've got the right hat for everyone.",
                buttons: [{
                        type: "web_url",
                        url: "https://google.com",
                        title: "Start shopping"
                    },
                    {
                        type: "web_url",
                        url: "https://youtube.com",
                        title: "Call us"
                    }
                ]
            }], {
                image_aspect_ratio: 'square'
            }
        )
    }
}

module.exports = ChatbotController;