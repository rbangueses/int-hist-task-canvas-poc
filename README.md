# Interaction History on Task Canvas Tab   

This sample plugin presents interaction history within the Flex Task Canvas Tab. In the current implementation, the data is stored in a Google Firestore NoSQL document database. All customers will be identified by the phone number, i.e. the unique identifier for a customer interaciton record will be the phone number.

This plugin provides the following capabilities:
- Present the interaction history of the caller phone number to the agent by default. The agent can then select a reason for the contact and leave a comment for future reference. In the event there is no customer interaction history record, the agent can create a new customer record. The agent can also search for a different number.
- Create a new customer: an agent can create a new customer when dealing with an interaction. For example, if the caller phone number is not on the database, the interface to create a new customer is presented, as well as the ability to search for another phone number.
- Search for a different customer: an agent can search for a different customer record based on the phone number at any time. This can be used in a scenario where someone is calling from someone else's phone. If a different customer is found, when the agent selects a reason and leaves a comment, this information will be stored in the searched customer record.

This plugin will notify users if they forget to select a reason code and they won't be able to complete the task if they don't. The reason code is stored as a task attribute (outcome) and you can create a Flex Insights report that will surface this data. 

This plugin won't allow the agent to create a customer with empty fields like the name, it will notify the agent.

The delete functionality has been implemented but has been commented out. You can make it appear by removing the respective comments on InteractionHistoryComponent.js . For GDPR purposes (right to be forgotten) it's probably best to deal with deletions manually via the Firestore GUI, as agents generally should not have the ability to delete customer records.


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
