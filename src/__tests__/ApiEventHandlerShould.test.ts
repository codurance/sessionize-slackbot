import { instance, mock, verify } from "ts-mockito"
import { Request, Response } from 'express';
import SlackApiClient from "../SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../CoreApiClient";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";

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

    test("should send the simple direct message as requested in the call's request", () => {

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

    test("should convert ISO 8601 dates to user friendly strings", () => {

        const isoDate = "2021-05-20T14:35:00.000Z";
        const expectedDate = "20/05/2021 14:35";

        const returnedDate = apiEventHandler.formatISODate(isoDate);
        expect(returnedDate).toBe(expectedDate);
    });

    test("should send match notification as requested in the call's request", async () => {

        const expectedMessage = [
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

        const testRequest : Partial<Request> = {
            body: {

            }
        }

        const testResponse : Partial<Response> = {
            send: jest.fn()
        }

        await apiEventHandler.onMatchNotification(testRequest as Request, testResponse as Response);

        verify(mockedSlackApiClient
            .sendMatchNotification(expectedSlackId, expectedMessage)).once();
    })

});