import React, { Component } from 'react';
import {createCustomer} from '../../helpers/firestoreUtils';
import './CreateCustomerComponent.css';
import {Notifications, NotificationType, NotificationBar} from "@twilio/flex-ui";

//notification used when creating a new customer record - if require fields are mossing
Notifications.registerNotification({
  id: "fieldsMissing",
  closeButton: true,
  content: "One or more fields need to be filled in.",
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

class CreateCustomerComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        phoneNumber : props.phoneNumber,
        firstName : "",
        lastName : "",
        email : "",
        accountId : "",
        showInterface: true
      };
      // this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange = (e) => {
      this.setState({
        [e.target.name] : e.target.value
      })
    }

    //before we create a customer we need to verify fields have ANY input, probably need to be more thorough here
    async createCustomerAttempt(firstName, lastName, phoneNumber, email, accountId){
        if(firstName.length > 0 && lastName.length > 0 && phoneNumber.length > 0 && email.length > 0 && accountId.length > 0){
            await createCustomer(firstName, lastName, phoneNumber, email, accountId);
            this.setState({
              showInterface : false
            })
            this.props.handler();
        }      
        else {
            Notifications.showNotification("fieldsMissing");
        }   
    }
  
    render() {
      if(this.state.showInterface){
        return (
          <div>
              <table>
                <tr>
                <td><label class="labelz">Phone number </label></td><td><input type="text" id="phoneNumberId" name="phoneNumber" value={this.state.phoneNumber} placeholder="Phone number" onChange={this.handleChange} /></td>   
                </tr>
                <tr>
                <td><label class="labelz">First name </label></td><td><input type="text" id="firstNameId" name="firstName" value={this.state.firstName} placeholder="First name" onChange={this.handleChange} /></td>
                </tr>
                <tr>
                <td><label class="labelz">Last name </label></td><td><input type="text" id="lastNameId" name="lastName" value={this.state.lastName} placeholder="Last name" onChange={this.handleChange} /></td>
                </tr>
                <tr>
                <td><label class="labelz">Email </label></td><td><input type="text" id="emailId" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} /></td>
                </tr>
                <tr>
                <td><label class="labelz">Account ID </label></td><td><input type="text" id="accountIdId" name="accountId" value={this.state.accountId} placeholder="Account ID" onChange={this.handleChange} /></td>
                </tr>
                <tr>
                <td><button class="CreateCustomerButton" onClick={ () => {this.createCustomerAttempt(this.state.firstName, this.state.lastName, this.state.phoneNumber, this.state.email, this.state.accountId); {this.props.handleCreateCustomer}}}>Create customer</button></td> <td></td>
                </tr>
              </table>
              <br></br>
          </div>
        );
      }
      else return (
        <div>Loading...</div>
      )
      
    }
  }
  export default CreateCustomerComponent;
  