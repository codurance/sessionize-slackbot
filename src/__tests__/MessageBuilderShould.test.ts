import { KnownBlock } from "@slack/web-api";
import MessageBuilder from "../MessageBuilder";
import IMatchNotificationContent from "../Interfaces/IMatchNotificationContent";
import SlackId from "../SlackId";
import Language from "../Language";
import DateTime from "../DateTime";
import CoreApiClient from "../CoreApiClient";
import {mock, instance, verify} from "ts-mockito";
import SlackApiClient from "../SlackApiClient";

describe("MessageBuilder", () => {

        let messageBuilder: MessageBuilder;

    beforeEach(() => {
        messageBuilder = new MessageBuilder();
    });

    test("should return a simple markdown message", () => {

        const name = "Joe Bloggs";
        const expectedMessage = "Hi Joe Bloggs, welcome to Sessionize!";

        const generatedMessage = messageBuilder.buildGreeting(name);
        expect(generatedMessage).toBe(expectedMessage);
    });

    test("should return a match notification message", () => {

        const messageBuilder : MessageBuilder = new MessageBuilder();

        const matchNotificationBody: IMatchNotificationContent = {
            matchIds: [new SlackId("12345")],
            language: new Language("java", "Java"),
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

    test("should return a preferences message", () => {

    });

});
