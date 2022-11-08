export function createCustomer(firstName, lastName, phoneNumber, email, accountId){
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  return new Promise((resolve, reject) =>{
    fetch(`https://interaction-history-2893.twil.io/createCustomerRecord?phoneNumber=${phoneNumber}&firstName=${firstName}&lastName=${lastName}&email=${email}&accountId=${accountId}`, options)
    .then(data => {
      resolve(data);
    })
  })
}

export function addInteractionHistory(phoneNumber, task, reason, agentComment){
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
      fetch(`https://interaction-history-2893.twil.io/addInteraction?phoneNumber=${phoneNumber}&queue=${task.queueName}&channel=${channel}&reason=${reason}&agentComment=${agentComment}`, options)
      .then(data => {
        resolve(data);
      })
    })
}

export function getInteractionHistory(phoneNumber){

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  return new Promise((resolve, reject) =>{
    //perform get request and return data
    fetch('https://interaction-history-2893.twil.io/fetchCustomerDetails?phoneNumber=' + phoneNumber, options)
    .then(response => response.json())
    .then(data => {
      resolve(data);
    })
  })
} 

export function deleteInteraction(phoneNumber, timestamp){

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
    fetch(`https://interaction-history-2893.twil.io/deleteInteraction?phoneNumber=${phoneNumber}&timestamp=${timestamp}`, options)
    .then(data => {
      resolve(data);
    })
  })
} 