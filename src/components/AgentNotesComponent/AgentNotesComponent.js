import React, { Component } from 'react';
import './AgentNotesComponent.css';

class AgentNotesComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        note: ""
      };
      this.handleChange = this.handleChange.bind(this);
      this.updateIsEdit = this.updateIsEdit.bind(this);
    }
  
    handleChange(e) {
      this.setState({
        note:e.target.value
      })
    }
    updateIsEdit(e, value="null") {
      this.setState({
          isEdit: value
      });
    }
  
    render() {
      return (
        <div>
          <input class='InputComponent' type="textarea" id="agentNoteId" name="agentNote" value={this.state.note} placeholder="Add a new comment for this interaction" onChange={this.handleChange} onBlur={this.updateIsEdit}/>
          {/* <p id="note">{this.state.note}</p> */}
        </div>
  
      );
    }
  }
  export default AgentNotesComponent;
  