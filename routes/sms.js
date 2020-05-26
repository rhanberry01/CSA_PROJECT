var express = require('express');
var router = express.Router();

router.get('/sendsms', function(req, res,next){

// require the Twilio module and RequestClient
const twilio = require('twilio');


// Twilio Credentials
var accountSid = 'AC847201b012590141a7d88d2d5acd8693'; // Your Account SID from www.twilio.com/console
var authToken = 'd5acfae427c9de7909e9274b1dc5242c';   // Your Auth Token from www.twilio.com/console

const client = twilio(accountSid, authToken, {
    // Custom HTTP Client

});

client.messages
    .create({
        to: '+19167135696',
        from: '+639151768930',
        body: 'Hey there!',
    })
    .then(message => console.log(`Message SID ${message.sid}`));

  console.log('you run.');

  res.send("Welcome to this page for the first time!");
});

module.exports = router;