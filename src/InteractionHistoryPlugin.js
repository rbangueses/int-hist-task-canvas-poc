import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import {NotificationType, NotificationBar} from "@twilio/flex-ui";

import InteractionHistoryOnCanvasComponent from './components/InteractionHistoryCanvasTab/InteractionHistoryCanvasTabComponent';
import {addInteractionHistory} from './helpers/firestoreUtils';

const PLUGIN_NAME = 'InteractionHistoryPlugin';

export default class InteractionHistoryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex, manager) {

    //notification used if the reason field is not selected
    flex.Notifications.registerNotification({
      id: "reasonMissing",
      closeButton: true,
      content: "Please select a reason for this interaction.",
      timeout: 3000,
      type: NotificationType.warning,
      actions: [
          <NotificationBar.Action
              onClick={(_, notification) => {
                  Flex.Notifications.dismissNotification(notification);
              }}
              label="Select Wrapup code"
              icon="Bell"
          />
      ]
    });
    //uploads reason, comments and other metadata to the data store
    //prevents completing the task if the reason is not selected
    flex.Actions.addListener("beforeCompleteTask", (payload, cancelActionInvocation) => {
      const reason = document.getElementById("reasonId").value;
      const agentComment = document.getElementById("agentNoteId").value;
      const phoneNumber = document.getElementById("intHistNumberId").value;
      
      console.log(reason)
      if(reason === 'select'){
        cancelActionInvocation();
        flex.Notifications.showNotification("reasonMissing");
      }
      //cancelActionInvocation();
      addInteractionHistory(phoneNumber, payload.task, reason, agentComment);

      /** Set reason on outcome attribute*/
      let attributes = payload.task.attributes;
      // merge new attributes
      attributes = Object.assign(attributes, {
        conversations: {
          outcome: reason
        }
      });
      // set new attributes on the task
      payload.task.setAttributes(attributes);
    });

    flex.TaskCanvasTabs.Content.add(<InteractionHistoryOnCanvasComponent key="int-hist-canvas-comp" label="Interaction History" flex={flex}></InteractionHistoryOnCanvasComponent>)
  }
}
