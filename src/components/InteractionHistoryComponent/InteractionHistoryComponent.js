import React, { Component } from 'react';
import {getInteractionHistory, deleteInteraction} from '../../helpers/firestoreUtils';
import {compareNumbers, epochToDate} from '../../helpers/utilities';
import CreateCustomerComponent from '../CreateCustomerComponent/CreateCustomerComponent';
import CustomerSearchComponent from '../CustomerSearchComponent/CustomerSearchComponent';
import './InteractionHistoryComponent.css';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

class InteractionHistoryComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interactionHistory : '',
            interactionHistoryFetched: false,
            newCustomer: false,
            phoneNumber: '', //we use this one instead of the task attribute because the agent may assign this call to a different number for interaction history purposes
            originalNumber: ''
        }
    }  

    handleDelete(){
        this.setState({interactionHistoryFetched : false });
    }
    //used by child component to change newCustomer prop
    handler = () => {
        this.setState({
            newCustomer : false,
            interactionHistoryFetched: false
        })
    }
    //used by CustomerSearchComponent to change the phone number 
    handlePhoneChange = (searchNumber) =>{
        this.setState({
            phoneNumber: searchNumber,
            interactionHistoryFetched: false,
            newCustomer : false
        })
        this.setNumberOnTaskAttribute(searchNumber);
    }

    setNumberOnTaskAttribute = (number) => {
        const { task } = this.props.task;
        /** Set phone number on task attribute*/
        let attributes = task.attributes;
        // merge new attributes
        attributes = Object.assign(attributes, {
            phoneNumber: number
            }
        );
        // set new attributes on the task
        task.setAttributes(attributes);
        this.props.updateShowReasonAndNotes(true); 
    }

    async componentDidMount(){
        const { task } = this.props.task;
        if(typeof task.attributes.from !== 'undefined'){
            this.setState({
                phoneNumber : task.attributes.from
            })
            this.setNumberOnTaskAttribute(task.attributes.from);  
        }
    }

    async componentDidUpdate(){
        const { task } = this.props.task;
        //manage concurrent tasks
        //TODO
        console.log(task.attributes)
        console.log(task.attributes.phoneNumber);
        if(task.attributes.phoneNumber !== this.state.phoneNumber){
            console.log("time to search again");
            this.state.interactionHistoryFetched = false;
            //swap over
            this.state.phoneNumber = task.attributes.phoneNumber;
        }

        if(!this.state.interactionHistoryFetched){
            var interactionHistory = await getInteractionHistory(task.attributes.phoneNumber);
            if(typeof interactionHistory.firstName === 'undefined'){
                this.setState({newCustomer : true})
                this.setState({interactionHistoryFetched : true})
                this.props.updateShowReasonAndNotes(false); 
                //console.log("no customer found");
            }
            else{
                this.setState({interactionHistory: interactionHistory})
                this.setState({interactionHistoryFetched : true})
                this.props.updateShowReasonAndNotes(true);
                //console.log("customer found");

                /** Set phone number on task attribute*/
                //this.setNumberOnTaskAttribute(this.state.phoneNumber);
            }
        }
    }

    render() { 
        const { task } = this.props.task;
        if(this.state.newCustomer){
            return (
                <div>
                    <CustomerSearchComponent key='cust-search-key' handlePhoneChange={this.handlePhoneChange}></CustomerSearchComponent>
                    <CreateCustomerComponent key='create-cust-key' phoneNumber={this.state.phoneNumber} handler={this.handler}></CreateCustomerComponent>  
                </div>
            )
        }
        else if(this.state.interactionHistoryFetched){
            var interactionLogsArray = [];
            var limitedInteractionLogsArray = [];
            //check if there is any interaction history for this customer. If there is, we store it in an array to be iterated and presented. Otherwise we present
            //a message saying there is no interaction history for this customer yet.
            if(typeof this.state.interactionHistory.interactionHistory !== 'undefined' && Object.keys(this.state.interactionHistory.interactionHistory).length !== 0){
                var interactionLogsMap = new Map(Object.entries(this.state.interactionHistory.interactionHistory));       
                interactionLogsMap.forEach(function(value,key) {
                    interactionLogsArray.push(value);                 
                })
                interactionLogsArray.join();
                interactionLogsArray.sort(compareNumbers);
                //save a limited view of interaction history
                var maxRecords = process.env.MAX_RECORDS_PRESENTED;
                limitedInteractionLogsArray = interactionLogsArray.slice(0, maxRecords);
                
                return (
                    <div key='int-hist-canvas-div'>
                        <input type="text" id="intHistNumberId" value={this.state.phoneNumber} style={{visibility : "hidden"}}/>
                        <br></br>
                        <CustomerSearchComponent key='cust-search-key' handlePhoneChange={this.handlePhoneChange}></CustomerSearchComponent>
                        <br></br>
                        <table key='int-hist-canvas-table' className='InteractionHistoryCanvasTable'>
                            <tbody>
                            <tr>
                                <td>Name: {this.state.interactionHistory.firstName} {this.state.interactionHistory.lastName}</td>
                            </tr>
                            <tr>
                                <td>Account ID: {this.state.interactionHistory.accountId}</td>
                            </tr>
                            <tr>
                                <td>Email: {this.state.interactionHistory.email}</td>
                            </tr>
                            <tr>
                                <td>From: {this.state.interactionHistory.phoneNumber}</td>
                            </tr>
                            </tbody>
                        </table>
                        
                        <br></br>
                        <table key='int-hist-canvas-table-details' className='styled-table'>
                            <thead>
                            <tr><th>Date</th> <th>Channel</th> <th>Queue</th> <th>Reason </th> <th>Agent Comments</th> 
                            {/* <th></th> */}
                            </tr>
                            </thead>
                            <tbody>
                            
                            {
                            //iterate through the array and build the table with the interaction logs
                            limitedInteractionLogsArray.map(element => {
                                return (
                                <tr><td>{epochToDate(element.entryTime)}</td><td>{element.channel}</td><td>{element.queue}</td><td>{element.reason}</td><td>{element.agentComment}</td>
                                    {/* <td>
                                    <button class="DeleteButton" onClick={() => {deleteInteraction(this.state.interactionHistory.phoneNumber, element.entryTime);this.handleDelete()}}><i class="fa fa-trash-o"></i></button>
                                    </td> */}
                                </tr>) })
                            }
                            </tbody>
                        </table>
                    </div>
                )
            } 
            else{
                return (
                    <div key='int-hist-canvas-div'>
                        <br></br>
                        <CustomerSearchComponent key='cust-search-key' handlePhoneChange={this.handlePhoneChange}></CustomerSearchComponent>
                        <br></br>
                        <input type="text" id="intHistNumberId" value={this.state.phoneNumber} style={{visibility : "hidden"}}/>
                        <table key='int-hist-canvas-table' className='InteractionHistoryCanvasTable'>
                            <tbody>
                            <tr>
                                <td>Name: {this.state.interactionHistory.firstName} {this.state.interactionHistory.lastName}</td>
                            </tr>
                            <tr>
                                <td>Account ID: {this.state.interactionHistory.accountId}</td>
                            </tr>
                            <tr>
                                <td>Email: {this.state.interactionHistory.email}</td>
                            </tr>
                            <tr>
                                <td>From: {this.state.interactionHistory.phoneNumber}</td>
                            </tr>
                            </tbody>
                        </table>
                        <br></br>
                        There is no interaction history yet.
                    </div>
                )
            }
        }else return(
            <div key="loading">
                Loading...
            </div>
        );
    }
}

export default InteractionHistoryComponent;