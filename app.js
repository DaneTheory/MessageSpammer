var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var colors = require('colors');

//ENTER YOUR TWILIO CREDENTIALS
var client = require('twilio')('ACCOUNT SID', 'AUTH TOKEN');


app.use(bodyParser());
app.set('view engine', 'ejs');
app.listen('3000', function(){
      console.log('========================'.red);
      console.log(' Listening on PORT 3000'.green);
      console.log('========================'.red);

});

    //////////////////////////////////////
   //  Below Code - The home page.     //
  //////////////////////////////////////

app.get('/', function(req,res){
      res.render('index');

    });

  //////////////////////////////////////
 //  Below Code - Sending A message. //
//////////////////////////////////////
 app.get('/sent', function(req,res){

  var maskedNumb = req.query.masked;
  var enemyNumb = req.query.enemy;
  var messageSent = req.query.message;
  var numberOfTexts = req.query.texts;
  var texts = Number(numberOfTexts);

if(isNaN(texts) === true){
  console.log('NOT A NUMBER');
  client.sendMessage({

      to: enemyNumb, // Any number Twilio can deliver to
      from: maskedNumb, // (13475279764)
      body: messageSent// body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) {

          console.log('Sent from --> ' + responseData.from); // outputs "+14506667788"
          console.log('Message: ' + responseData.body); // outputs "word to your mother."

      }else{
        console.log(err);//Prints out the error that you have.
      }

  });
}else{
  console.log('ITS A NUMBER');
        //Send an SMS text message

  for(var i = 0 ; i < texts ; i++){
    client.sendMessage({

        to: enemyNumb, // Any number Twilio can deliver to
        from: maskedNumb, // (13475279764)
        body: messageSent// body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) {

            console.log('Sent from --> ' + responseData.from); // outputs "+14506667788"
            console.log('Message: ' + responseData.body); // outputs "word to your mother."

        }else{
          console.log(err);//Prints out the error that you have.
        }

    });

  }
}
   res.render('sent', {maskedNumb : maskedNumb, enemyNumb : enemyNumb, messageSent : messageSent});

  });

/////////////////////////////////////////////////////////
// Below Code - Creating an Account and Getting a #.  //
///////////////////////////////////////////////////////

app.get('/createAccount', function(req,res){
  res.render('account');
});

     /////////////////////////////////////////////
    //  Below Code - Verifying a phone number. //
   /////////////////////////////////////////////

app.get('/verifyNumber', function(req,res){
  var numberEntered = req.query.realNumber;
  var nameEntered = req.query.myName;

        //FIRST YOU CREATE A SUB ACCOUNT.

  client.accounts.create({
      friendlyName: nameEntered
  }, function(err, account) {
    if(err){
  console.log(err);
    }else{
    //Create the Sub Account
      process.stdout.write(account.sid);
      console.log('SUB ACCOUNT CREATED');

      //Find a way to verify the number entered via a text.
      client.outgoingCallerIds.create({
          phoneNumber: numberEntered
      }, function(err, callerId) {
        if(err){
          console.log(err);
          res.redirect('/createAccount');
        }else{
          //process.stdout.write(callerId);
          console.log(callerId);
          var code = callerId.validation_code;
          console.log(code);
          res.render('verify', {numberEntered : numberEntered, code : code});
         }
       });
     }
  });
});

   //////////////////////////////////////////////
  //  Below Code - Giving you a masked number //
 //////////////////////////////////////////////

app.get('/findNumber', function(req,res){
  client.availablePhoneNumbers("US").local.list({areaCode : '347'},

  function(err, data) {

    if(err){

      console.log(err);

    }else{
    console.log(data.availablePhoneNumbers[0].phoneNumber);

    client.incomingPhoneNumbers.create({

      phoneNumber : data.availablePhoneNumbers[0].phoneNumber

    }, function(err,number){

      if(err){
        console.log(err);

      }else{
      // ---> Phone Number Created  <---- //
      var phoneNumb = number.phone_number //The Newly Created #
      console.log(number.phone_number);
      res.render('index2', {number : phoneNumb});
      }
    });
  }

  });

});
