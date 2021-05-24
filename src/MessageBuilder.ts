import { ActionsBlock, KnownBlock, SectionBlock } from '@slack/web-api';
import MatchNotificationContent from './MatchNotificationContent';
import * as templates from './MessageTemplates/Templates';
import UserName from './UserName';
import { formatISODate } from './Utils/Formatters';

export default class MessageBuilder {
    static buildMatchNotification(matchNotificationContent : MatchNotificationContent) : KnownBlock[] {

        const formattedDateTime = formatISODate(matchNotificationContent.dateTime);

        const matchNames = this.matchNamesAsString(matchNotificationContent.matchNames);
        
        const headerSection : SectionBlock = {

            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `You have a new match:\n ${matchNames}`
            }
        };

        const matchDetailsSection : SectionBlock = {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": `*Language:*\n${matchNotificationContent.language.value}`
                },
                {
                    "type": "mrkdwn",
                    "text": `*When:*\n${formattedDateTime}`
                }
            ]
        };

        const actions : ActionsBlock = {
            "type": "actions",
            "elements" : [
                {
                    "type": "button",
                    "text" : {
                        "type": "plain_text",
                        "text": "Approve",
                        "emoji": true
                    },
                    "action_id": "approve_session",
                    "style": "primary",
                    "value": "session_confirmed"
                },
                {

                    "type": "button",
                    "text" : {
                        "type": "plain_text",
                        "text": "Deny",
                        "emoji": true
                    },
                    "style": "danger",
                    "value": "session_denied",
                    "action_id": "deny_session"
                }
            ]
        }

        return [
            headerSection,
            matchDetailsSection,
            actions
        ];
    }

    static matchNamesAsString(matchNames : UserName[]) : string {

        let matchNameString : string = "";

        matchNames.map(name => {
            matchNameString += `<@${name.value}> `;
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
