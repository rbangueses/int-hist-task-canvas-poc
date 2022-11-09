import {Notifications, NotificationType, NotificationBar} from "@twilio/flex-ui";
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

Notifications.registerNotification({
  id: "customerAlreadyExists",
  closeButton: true,
  content: "This phone number is already assigned to an existing customer record.",
  timeout: 3000,
  type: NotificationType.warning,
  actions: [
      <NotificationBar.Action
          onClick={(_, notification) => {
              Flex.Notifications.dismissNotification(notification);
          }}
          label="Creating new customer"
          icon="Bell"
      />
  ]
});

export async function createCustomer(firstName, lastName, phoneNumber, email, accountId){
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  //check if there is a customer with this number first
  const prevHistory = await getInteractionHistory(phoneNumber);
  if(typeof prevHistory.firstName !== 'undefined'){
    console.log("This phone number is already assigned to a customer.");
    Notifications.showNotification("customerAlreadyExists");
    return;
  }
  else {
    return new Promise((resolve, reject) =>{
      fetch(`${process.env.CREATE_CUSTOMER_URL}?phoneNumber=${phoneNumber}&firstName=${firstName}&lastName=${lastName}&email=${email}&accountId=${accountId}`, options)
      .then(data => {
        resolve(data);
      })
    })
  }
}

export async function addInteractionHistory(phoneNumber, task, reason, agentComment){
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    //channelType indicates either sms or whatsapp. If undefined then we check the channel unique name i.e. voice case
    var channel = task.attributes.channelType;
    if (typeof channel === 'undefined')
      channel = task.taskChannelUniqueName;

    if(reason === 'select')
      reason = 'No Selection';
  
    return new Promise((resolve, reject) =>{
      fetch(`${process.env.ADD_INT_URL}?phoneNumber=${phoneNumber}&queue=${task.queueName}&channel=${channel}&reason=${reason}&agentComment=${agentComment}`, options)
      .then(data => {
        resolve(data);
      })
    })
}

export async function getInteractionHistory(phoneNumber){
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  return new Promise((resolve, reject) =>{
    //perform get request and return data
    fetch(`${process.env.GET_INT_URL}?phoneNumber=${phoneNumber}`, options)
    .then(response => response.json())
    .then(data => {
      resolve(data);
    })
  })
} 

export async function deleteInteraction(phoneNumber, timestamp){

  // console.log("called function deleteInteraction");
  // console.log(phoneNumber);
  // console.log(timestamp);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  return new Promise((resolve, reject) =>{
    fetch(`${process.env.DEL_INT_URL}?phoneNumber=${phoneNumber}&timestamp=${timestamp}`, options)
    .then(data => {
      resolve(data);
    })
  })
} 