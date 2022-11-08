import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import {NotificationType, NotificationBar} from "@twilio/flex-ui";

import InteractionHistoryOnCanvasComponent from './components/InteractionHistoryCanvasTab/InteractionHistoryCanvasTabComponent';

const PLUGIN_NAME = 'InteractionHistoryPlugin';
let REASON = '';

export default class InteractionHistoryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
    this.changeMetadata = this.changeMetadata.bind(this);
  }

  changeMetadata(reason) {
    console.log(REASON);
    REASON = reason;
    console.log(REASON);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {


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
    flex.Actions.addListener("beforeCompleteTask", (payload, cancelActionInvocation) => {
      console.log(payload);
      const reason = document.getElementById("reasonId").value;
      const agentComment = document.getElementById("agentNoteId").value;
      const phoneNumber = document.getElementById("intHistNumberId").value;
      cancelActionInvocation();
      //addInteractionHistory(phoneNumber, payload.task, reason, agentComment);
      flex.Notifications.showNotification("reasonMissing");
      this.changeMetadata('reasons');

      return;
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

    flex.TaskCanvasTabs.Content.add(<InteractionHistoryOnCanvasComponent key="int-hist-canvas-comp" label="Interaction History" flex={flex} changeMetadata={this.changeMetadata}></InteractionHistoryOnCanvasComponent>)
  }
}
