import { KnownBlock } from "@slack/web-api";
import MessageBuilder from "../MessageBuilder";
import MatchNotification from "../Interfaces/MatchNotification";
import MatchNotificationContent from "../Interfaces/MatchNotificationContent";
import SlackId from "../SlackId";
import UserName from "../UserName";
import Language from "../Language";
import DateTime from "../DateTime";

describe("MessageBuilder", () => {
    test("should return a simple markdown message", () => {

        const name = "Joe Bloggs";
        const messageBuilder = new MessageBuilder();
        const expectedMessage = "Hi Joe Bloggs, welcome to Sessionize!";

        const generatedMessage = messageBuilder.buildGreeting(name);
        expect(generatedMessage).toBe(expectedMessage);
    });

    test("should return a match notification message", () => {

        const matchNotificationBody: MatchNotificationContent = {
            name: new UserName("Joe Bloggs"),
            language: new Language("Java"),
            dateTime: new DateTime("2021-12-01T17:00:00.000Z")
        };
        
        const matchDetails: MatchNotification = {
            slackId: new SlackId("ABC123"),
            body: matchNotificationBody
        }

        const expectedMatchNotification : KnownBlock[] = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "You have a new match:\n <@Joe Bloggs>"
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Language:*\nJava"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*When:*\n01/12/2021 17:00"
                    }
                ]
            },
            {
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
        ];

        const messageBuilder = new MessageBuilder();

        const matchNotification = messageBuilder.buildMatchNotification(matchDetails);

        expect(matchNotification).toStrictEqual(expectedMatchNotification);

    });
});
