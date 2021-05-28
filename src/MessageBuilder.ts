import { ActionsBlock, Button, InputBlock, KnownBlock, MultiStaticSelect, Option, SectionBlock } from '@slack/web-api';
import Language from './Models/Language';
import MatchNotificationContent from 'Models/MatchNotificationContent';
import * as templates from './MessageTemplates/Templates';
import SlackId from './Models/SlackId';
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

        const multiSelect: MultiStaticSelect = {
            type: "multi_static_select",
            placeholder: {
                type: "plain_text",
                text: "Select a language",
                emoji: true
            },
            option_groups: [
                {
                    label: {
                        type: "plain_text",
                        text: "Languages",
                    },
                    options: optionsArray
                },
            ],
            max_selected_items: 3
        }

        const languageSelectors : InputBlock = {
			"type": "input",
			"element": multiSelect,
			"label": {
				"type": "plain_text",
				"text": "Languages",
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
