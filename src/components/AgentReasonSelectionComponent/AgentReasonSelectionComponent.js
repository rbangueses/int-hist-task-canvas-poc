import React, { Component } from 'react';
import './AgentReasonSelectionComponent.css';

class AgentReasonSelectionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reason: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            reason: e.target.value
        })
      }


    render(){
        return (     
            <div>
               <select id="reasonId" onChange={this.handleChange} value={this.state.reason}>
                  <option value="select">Select Interaction Reason</option>
                  <option value="Update Details">Update Details</option>
                  <option value="New Car Insurance Policy">New Car Insurance Policy</option>
                  <option value="New Home Insurance Policy">New Home Insurance Policy</option>
                  <option value="New Health Insurance Policy">New Health Insurance Policy</option>
                  <option value="Renewal">Renewal</option>
                  <option value="Cancellation">Cancellation</option>
                  <option value="Other">Other</option>
               </select>
               {/* <p>{this.state.reason}</p> */}
           </div>
            
        );
    }
}
export default AgentReasonSelectionComponent;