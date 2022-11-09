# Your custom Twilio Flex Plugin

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## Setup

This plugin uses the following:
- Google Firestore as a NoSQL document database - this is where all the interaction history is currently stored
- Twilio Serverless functions - these functions implement Create / Read / Update / Delete (CRUD) operations on the data stored
- a Flex plugin, that provides the interface to the agent

## Google Firestore setup

You will need to create a new Google Project on GCP with Firestore enabled. You should then create a collection called "Customers". So that our Twilio functions can access Firestore, you will also need to create a service account with Firebase Admin SDK Administrator Service Agent role. More specifically, we will need the following permissions:
- datastore.entities.create
- datastore.entities.get
- datastore.entities.update

Make sure you download the json key for that service account as we will need it in the next step.

## Twilio Serverless functions

Go to your Twilio console and create 4 new functions based on the files in root/serverless. You will need their full paths to setup the environment variables on the plugin. Make the functions public and feel free to harden the CORS policy, specially when placing this in production.

## Plugin

Download and install - npm install

Please make sure you edit the environment variables, rename the .env.example to .env and fill these in:
CREATE_CUSTOMER_URL= url of your Twilio function /createCustomerRecord
ADD_INT_URL= url of your Twilio function /addInteraction
GET_INT_URL=url of your Twilio function /addInteraction
DEL_INT_URL= url of your Twilio function /deleteInteraction
MAX_RECORDS_PRESENTED: defines the maximum number of records shown, ordered by date (most recent X records are shown)

## Editing reason codes 

Reason codes are defined on AgentReasonSelectionComponent.

## Make fields optional

To make customer record fields optional please edit the CreateCustomerComponent.
