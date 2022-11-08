import React from 'react';
import './InteractionHistoryCanvasTabComponent.css';
import AgentNotesComponent from '../AgentNotesComponent/AgentNotesComponent';
import AgentReasonSelectionComponent from '../AgentReasonSelectionComponent/AgentReasonSelectionComponent';
import {getInteractionHistory} from '../../helpers/firestoreUtils';
import {compareNumbers, epochToDate} from '../../helpers/utilities';
 
class InteractionHistoryCanvasTabComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interactionHistory : '',
            interactionHistoryFetched: false
        }
      }  

    async componentDidUpdate(){
        const { task } = this.props;
        if(task.attributes.from && !this.state.interactionHistoryFetched){
            var interactionHistory = await getInteractionHistory(task);
            this.setState({interactionHistory: interactionHistory})
            this.setState({interactionHistoryFetched : true})
        }
    }

    render() { 

        const { task } = this.props;

        if(this.state.interactionHistoryFetched){
            var interactionLogsMap = new Map(Object.entries(this.state.interactionHistory.interactionHistory));
            var interactionLogsArray = [];
        
            interactionLogsMap.forEach(function(value,key) {
                interactionLogsArray.push(value);
            })
            //sort the array in chronologic descending order (most recent -> least recent) 
            interactionLogsArray.join();
            interactionLogsArray.sort(compareNumbers);
            //save a limited view of interaction history
            var maxRecords = 10;
            var limitedInteractionLogsArray = interactionLogsArray.slice(0, maxRecords);
         
            return (
                <div key='int-hist-canvas-div'>
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
                    <table key='int-hist-canvas-table-details' className='InteractionHistoryCanvasTableDetails'>
                        <thead>
                        <tr><th>Date</th> <th>Channel</th> <th>Queue</th> <th>Reason </th> <th>Agent Comments</th></tr>
                        </thead>
                        <tbody>
                        
                        {
                        //iterate through the array and build the table with the interaction logs
                        limitedInteractionLogsArray.map(element => {
                            return (
                            <tr><td>{epochToDate(element.entryTime)}</td><td>{element.channel}</td><td>{element.queue}</td><td>{element.reason}</td><td>{element.agentComment}</td></tr>) })
                        }


                        </tbody>
                    </table>
                    <br></br>
                    <AgentReasonSelectionComponent key='agent-reason-component-key'></AgentReasonSelectionComponent>
                    <br></br>
                    <AgentNotesComponent key='agent-notes-component-key'></AgentNotesComponent>
                </div>  
                )
            }
            else return(
            <div key="empty-history">
            No history available.
            </div>
        );
    }
}

export default InteractionHistoryCanvasTabComponent;