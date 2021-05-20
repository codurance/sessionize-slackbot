import { ActionsBlock, KnownBlock, SectionBlock } from '@slack/web-api';
import MatchNotification from './Interfaces/MatchNotification';
import * as templates from './MessageTemplates/Templates';
import { formatISODate } from './Utils/Formatters';

export default class MessageBuilder {
    buildMatchNotification(matchDetails : MatchNotification) : KnownBlock[] {

        matchDetails.dateTime = formatISODate(matchDetails.dateTime);
        
        const headerSection : SectionBlock = {

            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `You have a new match:\n <@${matchDetails.name}>`
            }
        };

        const matchDetailsSection : SectionBlock = {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": `*Language:*\n${matchDetails.language}`
                },
                {
                    "type": "mrkdwn",
                    "text": `*When:*\n${matchDetails.dateTime}`
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

    buildGreeting(name: string) : string {
        return templates.greeting(name);
    }

    buildWelcomeBack(name: string) : string {
        return templates.welcomeBack(name);
    }
}
