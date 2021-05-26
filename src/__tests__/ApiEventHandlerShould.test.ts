import { anything, deepEqual, instance, match, mock, verify } from "ts-mockito"
import { Request, Response } from 'express';
import SlackApiClient from "../SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../CoreApiClient";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import IMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import MatchNotification from "../MatchNotification";
import SlackId from "../SlackId";
import MatchNotificationContent from "../MatchNotificationContent";
import Language from "../Language";
import DateTime from "../DateTime";
import IUserIdentifierRequest from "../Interfaces/IUserIdentifierRequest";
import { KnownBlock } from "@slack/web-api";

describe("ApiEventHandler", () => {

    let mockedCoreApiClient : CoreApiClient,
        coreApiClient : CoreApiClient,
        mockedSlackApiClient : SlackApiClient,
        slackApiClient : SlackApiClient,
        messageBuilder : MessageBuilder,
        apiEventHandler : ApiEventHandler;

        const expectedSlackId = "ABC123";

    beforeEach(() => {
        mockedCoreApiClient = mock(CoreApiClient);
        coreApiClient = instance(mockedCoreApiClient);

        mockedSlackApiClient = mock(SlackApiClient);
        slackApiClient = instance(mockedSlackApiClient);

        messageBuilder = new MessageBuilder();

        apiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);
    })

    test("should send the simple direct message as requested in a call's request", () => {

        const expectedMessage = "Hello World!";

        const testRequest : Partial<Request> = {
            body: {
                slackId: expectedSlackId,
                message: expectedMessage
            }
        }

        const testResponse : Partial<Response> = {
            send: jest.fn()
        }
        apiEventHandler.onDirectMessage(testRequest as Request, testResponse as Response);
        verify(mockedSlackApiClient.sendDm(expectedSlackId, expectedMessage));
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
    });

    test("should send a message asking for language preferences", () => {

        const generatedMessage : KnownBlock[] = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Please select your three languages:*"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*Java*",
                                    "emoji": true
                                },
                                "value": "java"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*C#*",
                                    "emoji": true
                                },
                                "value": "csharp"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*Python*",
                                    "emoji": true
                                },
                                "value": "python"
                            }
                        ],
                        "action_id": "language-1"
                    },

                    {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*Java*",
                                    "emoji": true
                                },
                                "value": "java"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*C#*",
                                    "emoji": true
                                },
                                "value": "csharp"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*Python*",
                                    "emoji": true
                                },
                                "value": "python"
                            }
                        ],
                        "action_id": "language-2"
                    },

                    {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*Java*",
                                    "emoji": true
                                },
                                "value": "java"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*C#*",
                                    "emoji": true
                                },
                                "value": "csharp"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*Python*",
                                    "emoji": true
                                },
                                "value": "python"
                            }
                        ],
                        "action_id": "language-3"
                    }
                ]
            }
        ];

        const mockedCoreApiClient : CoreApiClient = mock(CoreApiClient);
        const coreApiClient : CoreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient : SlackApiClient = mock(SlackApiClient);
        const slackApiClient : SlackApiClient = instance(mockedSlackApiClient);

        const messageBuilder : MessageBuilder = new MessageBuilder();

        const apiEventHandler : ApiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);

        const testRequestBody = {
            "slackId": "ABC123",
            "languages": [
                {
                    "language": "java",
                    "displayName": "Java"
                },
                {
                    "language": "csharp",
                    "displayName": "C#"
                },
                {
                    "language": "python",
                    "displayName": "Python"
                }
            ]
        }

        const testRequest : Partial<Request> = {
            body: testRequestBody
        };

        const testResponse : Partial<Response> = {
            send: jest.fn()
        }

        // apiEventHandler.onPreferencesRequest(testRequest as Request, testResponse as Response);

        // verify(mockedSlackApiClient.sendPreferencesMessage(slackId, generatedMessage)).once();
    });

});