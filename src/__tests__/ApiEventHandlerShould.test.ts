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

    test("should take a request body from core and return an object with MatchNotification", () => {

    });


});