import { ActionsBlock, Button, InputBlock, KnownBlock, Option, SectionBlock } from '@slack/web-api';
import Language from './Language';
import MatchNotificationContent from './MatchNotificationContent';
import * as templates from './MessageTemplates/Templates';
import SlackId from './SlackId';
import { formatISODate } from './Utils/Formatters';

export default class MessageBuilder {

    buildMatchNotification(matchNotificationContent : MatchNotificationContent) : KnownBlock[] {

        const formattedDateTime = formatISODate(matchNotificationContent.dateTime);
        const matchNames = this.matchIdsAsString(matchNotificationContent.matchIds);
        
        const headerSection : SectionBlock = {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `You have a new match:\n ${matchNames}`
            }
        };

        const matchDetailsSection : SectionBlock = {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Language:*\n${matchNotificationContent.language.displayName}`
                },
                {
                    type: "mrkdwn",
                    text: `*When:*\n${formattedDateTime}`
                }
            ]
        };

        const actions : ActionsBlock = {
            type: "actions",
            elements : [
                {
                    type: "button",
                    text : {
                        type: "plain_text",
                        text: "Approve",
                        emoji: true
                    },
                    action_id: "approve_session",
                    style: "primary",
                    value: "session_confirmed"
                } as Button,
                {
                    type: "button",
                    text : {
                        type: "plain_text",
                        text: "Deny",
                        emoji: true
                    },
                    style: "danger",
                    value: "session_denied",
                    action_id: "deny_session"
                }
            ]
        };

        return [
            headerSection,
            matchDetailsSection,
            actions
        ];
    }

    buildPreferencesForm(languages: Language[]) : KnownBlock[] {

        let optionsArray: Option[]  = [];

        languages.map(language => {
            optionsArray.push(
                {
                    "text": {
                        "type": "plain_text",
                        "text": language.displayName,
                        "emoji": true
                    },
                    "value": language.value
                }
            );
        });

        const headerSection : SectionBlock = {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Please select your preferences."
            }
        };

        const languageSelectors : InputBlock = {
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": optionsArray,
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Label",
				"emoji": true
			}
		};

        const actions : ActionsBlock = {
            type: "actions",
            elements : [
                {
                    type: "button",
                    text : {
                        type: "plain_text",
                        text: "Confirm",
                        emoji: true
                    },
                    action_id: "confirm_preferences",
                    style: "primary",
                    value: "preferences_confirmed",
                    
                } as Button
            ]
        };

        return [
            headerSection,
            languageSelectors,
            actions
        ];
    }

    matchIdsAsString(matchNames : SlackId[]) : string {

        let matchNameString : string = "";

        matchNames.map(id => {
            matchNameString += `<@${id.slackId}> `;
        });

        return matchNameString.trimEnd();

    }

    buildGreeting(name: string) : string {
        return templates.greeting(name);
    }

    buildWelcomeBack(name: string) : string {
        return templates.welcomeBack(name);
    }

    buildFarewell(name: string) : string {
        return templates.farewell(name);
    }
    
    errorOccurred(name: string) : string {
        return templates.error(name);
    }
}
