import { instance, mock, verify } from "ts-mockito"
import { Request, Response } from 'express';
import SlackApiClient from "../SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../CoreApiClient";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";

describe("ApiEventHandler", () => {
    test("should return the message requested in the call's request", () => {

        const mockedCoreApiClient = mock(CoreApiClient);
        const coreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient = mock(SlackApiClient);
        const slackApiClient = instance(mockedSlackApiClient);

        const messageBuilder = new MessageBuilder();

        //

        const expectedSlackId = "Joe Bloggs";
        const expectedMessage = "Hello World!";

        const apiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);
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
});