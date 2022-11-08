import React from 'react';
import AgentNotesComponent from '../AgentNotesComponent/AgentNotesComponent';
import AgentReasonSelectionComponent from '../AgentReasonSelectionComponent/AgentReasonSelectionComponent';
import InteractionHistoryComponent from '../InteractionHistoryComponent/InteractionHistoryComponent';

class InteractionHistoryCanvasTabComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showReasonAndNotes : false,
        }
      }
    
    updateShowReasonAndNotes = (boolean) => {
        this.setState({
            showReasonAndNotes : boolean
        })
    }

    render() { 
        const { task } = this.props;    
        if(this.state.showReasonAndNotes){
            return (
                <div key='int-hist-canvas-div'>
                    <br></br>
                    <InteractionHistoryComponent key='int-hist-comp-key' task={{task}} updateShowReasonAndNotes={this.updateShowReasonAndNotes} ></InteractionHistoryComponent>
                    <br></br>
                    <AgentReasonSelectionComponent key='agent-reason-component-key'></AgentReasonSelectionComponent>
                    <br></br>
                    <AgentNotesComponent key='agent-notes-component-key'></AgentNotesComponent>
                    <br></br>
                </div>  
            )
        }
        else return(
            <div key='int-hist-canvas-div'>
                <p>{this.state.test}</p>
                <br></br>
                <InteractionHistoryComponent key='int-hist-comp-key' task={{task}} updateShowReasonAndNotes={this.updateShowReasonAndNotes}></InteractionHistoryComponent>
            </div>  
            )
    }
}

export default InteractionHistoryCanvasTabComponent;