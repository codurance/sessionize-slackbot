import { KnownBlock } from "@slack/web-api";
import MessageBuilder from "../MessageBuilder";
import IMatchNotification from "../Interfaces/IMatchNotification";
import IMatchNotificationContent from "../Interfaces/IMatchNotificationContent";
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

        const messageBuilder : MessageBuilder = new MessageBuilder();

        const matchNotificationBody: IMatchNotificationContent = {
            matchIds: [new SlackId("12345")],
            language: new Language("Java"),
            dateTime: new DateTime("2021-12-01T17:00:00.000Z")
        };

        const expectedMatchNotification : KnownBlock[] = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "You have a new match:\n <@12345>"
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: "*Language:*\nJava"
                    },
                    {
                        type: "mrkdwn",
                        text: "*When:*\n01/12/2021 17:00"
                    }
                ]
            },
            {
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
                    },
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
            }
        ];

        const matchNotification = messageBuilder.buildMatchNotification(matchNotificationBody);

        expect(matchNotification).toStrictEqual(expectedMatchNotification);
    });

    test("should turn an array of UserNames into a string", () => {

        const messageBuilder : MessageBuilder = new MessageBuilder();

        const userNameArray : SlackId[] = [
            new SlackId("12345"),
            new SlackId("54321"),
            new SlackId("9878"),
            new SlackId("510101"),
            new SlackId("19389")
        ];

        const returnedString : string = messageBuilder.matchIdsAsString(userNameArray);

        const expectedString : string = "<@12345> <@54321> <@9878> <@510101> <@19389>";

        expect(returnedString).toBe(expectedString);
    })
});
