const Communications = require('../app/models/entities/commuications');
const ConfigChat = require('../app/models/entities/configsChatbot');
const chatbotTemplate = require('../app/models/entities/chatbotTemplate');


class Chatbot {

    static async addCom(content) {
        const com = await Communications.findOne({
            uid: content.uid
        })

        if (com) {
            const newContent = await Communications.findOneAndUpdate({
                uid: content.uid
            }, {
                $push: {
                    data: content.data
                }
            }, {
                new: true
            });

            const newLastmessage = [
                content.data,
                {
                    time: content.data.time,
                    who: 'bot',
                    message: content.data.message
                }
            ]

            const configUpdate = await ConfigChat.findOneAndUpdate({
                name: 'last-message',
                'data._id': newContent._id
            }, {
                $set: {
                    'data.$.data': newLastmessage
                }
            });

            if (configUpdate) {
                console.log('success');
            } else console.log('error');

        } else {

            let data = Object.assign({}, content.data);
            content.data = [data];

            const newUser = new Communications(content);
            await newUser.save();

            const lastMessageData = {
                _id: newUser._id,
                type: 'message',
                uid: newUser.uid,
                fullname: newUser.fullname,
                gender: newUser.gender,
                data: [{
                        time: newUser.data[0].time,
                        who: 'guest',
                        message: newUser.data[0].message
                    },
                    {
                        time: newUser.data[0].time,
                        who: 'bot',
                        message: newUser.data[0].message
                    }
                ]
            }

            let config = await ConfigChat.findOne({
                name: 'last-message'
            })

            if (!config) {
                const lastMessage = {
                    data: [lastMessageData]
                }
                const newConfig = new ConfigChat(lastMessage);
                let success = await newConfig.save();
                if(!success) console.log('error');
            } else {
                await ConfigChat.findOneAndUpdate({
                    name: 'last-message'
                }, {
                    $push: {
                        data: lastMessageData
                    }
                });
            }
        }
    }

    static async convertTemplateJson(document) {
        const jsonTemplate = {
            title: `${document.title}`,
            image_url: 'https://res.cloudinary.com/twenty20/private_images/t_watermark-criss-cross-10/v1523811421000/photosp/5f374c18-674a-4267-a6e7-72329a8571e7/stock-photo-illustration-technology-futuristic-security-artificial-robot-computer-intelligence-virtual-5f374c18-674a-4267-a6e7-72329a8571e7.jpg',
            subtitle: `${document.subtitle}`,
            buttons: [{
                    type: "web_url",
                    url: `${document['button_url'][0]}`,
                    title: `${document['button_label'][0]}`
                },
                {
                    type: "web_url",
                    url: `${document['button_url'][1]}`,
                    title: `${document['button_label'][1]}`
                }
            ]
        };
        return jsonTemplate;
    }
    //save communication
    //save last msg
    static async saveMsgBotSendToUser(uidArr, message) {

        uidArr.forEach(async (uid) => {
            let dataCom = {
                time: Date.now(),
                who: 'bot',
                message
            };
            
            let com = await Communications.findOneAndUpdate({
                uid
            }, {
                $push: {
                    data: dataCom
                }
            }, {
                new: true
            });

            if (!com) return console.log('err');
            let config = await ConfigChat.findOne({
                name: 'last-message'
            });
            if (config) {
                ConfigChat.update({
                        name: 'last-message',
                        'data.uid': uid,
                        'data.data.who': 'bot'
                    }, {
                        $set: {
                            'data.$.data.$$.message': message,
                            'data.$.data.$$.time': dataCom.time
                        }
                    })
                    .then(success => console.log('success'))
                    .catch(err => console.log('err ' + err.message));
            } else {
                console.log('Do not have this user');
            }
        })
    }
    
}

module.exports = Chatbot;