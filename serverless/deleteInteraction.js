const fs = require('firebase-admin');

exports.handler = async function(context, event, callback) {

  // Access the NodeJS Helper Library by calling context.getTwilioClient()
  const client = context.getTwilioClient();

  // Create a custom Twilio Response
  const response = new Twilio.Response();
  // Set the CORS headers to allow Flex to make an error-free HTTP request to this Function
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const assets = Runtime.getAssets();
  const creds = await assets["/keyfile.json"].open().trim();
  const serviceAccount = JSON.parse(creds);
  let result = {};

  let phoneNumber = event.phoneNumber;
  let entryTime = event.timestamp;

  
  //console.log("Received delete request for number: " + event.phoneNumber);

  //avoid initialising app if already initialised in a function
  if (!fs.apps.length) {
    fs.initializeApp({
      credential: fs.credential.cert(serviceAccount)
    });
  }else {
    fs.app(); // if already initialized, use that one
  }

  const db = fs.firestore();
  const FieldValue = fs.firestore.FieldValue;

  //if the phoneNumber contains a whatsapp prefix we need to remove it
  phoneNumber = phoneNumber.replace('whatsapp:','');
  // check if the phone number includes + otherwise add + sign if there is none (i.e. url parameter invocation)
  if(phoneNumber[0] != '+'){
    phoneNumber = '+'.concat(parseInt(phoneNumber)); //parseInt to remove space
    //console.log("changed number: " + phoneNumber);
  }
  
  const customerDetails = await db.collection('Customers').doc(phoneNumber).update({
    ['interactionHistory.' + entryTime] : FieldValue.delete()
  }, { merge: true }).then(function(resp) {
          // handle success 
          //response.appendHeader('Content-Type', 'application/json');
          response.setStatusCode(200);
          //console.log(response);
          return callback(null, response);
  })
  .catch(function(error) {
    // handle error
      console.log(`Error: ${error}`);
      response.appendHeader('Content-Type', 'plain/text');
      response.setBody(error.message);
      response.setStatusCode(500);
      return callback(null, response);
  });
  fs.app().delete();
  // This callback is what is returned in response to this function being invoked.
  return callback();
};