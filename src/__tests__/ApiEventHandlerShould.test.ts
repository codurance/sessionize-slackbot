import {anything, instance, mock, verify, when} from "ts-mockito";
import {Request, Response} from "express";
import SlackApiClient from "../Repos/SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../Repos/CoreApiClient";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import SlackId from "../Models/SlackId";

import {slackIdsToLinkedNames} from "../Utils/ArraysUtils";
import {KnownBlock} from "@slack/web-api";
import MatchNotification from "../Models/MatchNotification";
import {Channel} from "@slack/web-api/dist/response/AdminUsergroupsListChannelsResponse";
import ChannelId from "../Models/ChannelId";
import {IMatchNotificationRequest} from "../Typings";

describe("ApiEventHandler", () => {

    let mockedCoreApiClient: CoreApiClient,
        coreApiClient: CoreApiClient,
        mockedSlackApiClient: SlackApiClient,
        slackApiClient: SlackApiClient,
        messageBuilder: MessageBuilder,
        apiEventHandler: ApiEventHandler;

    const expectedSlackId = "ABC123";

    beforeEach(() => {
        mockedCoreApiClient = mock(CoreApiClient);
        coreApiClient = instance(mockedCoreApiClient);

        mockedSlackApiClient = mock(SlackApiClient);
        slackApiClient = instance(mockedSlackApiClient);

        messageBuilder = new MessageBuilder();

        apiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);
    });

    test("should send a simple direct message as requested in a call's request", async () => {

        const expectedMessage = "Hello World!";

        const testRequest: Partial<Request> = {
            body: {
                slackId: expectedSlackId,
                message: expectedMessage
            }
        };

        const testResponse: Partial<Response> = {
            send: jest.fn(),
            status: jest.fn()
        };

        when(mockedSlackApiClient.sendDm(anything(), anything())).thenResolve(true);
        await apiEventHandler.onDirectMessage(testRequest as Request, testResponse as Response);
        verify(mockedSlackApiClient.sendDm(expectedSlackId, expectedMessage));
    });

    test("should turn an array of UserNames into a string", () => {

        const userNameArray: SlackId[] = [
            new SlackId("12345"),
            new SlackId("54321"),
            new SlackId("9878"),
            new SlackId("510101"),
            new SlackId("19389")
        ];

        const returnedString: string = slackIdsToLinkedNames(userNameArray);

        const expectedString = "<@12345> <@54321> <@9878> <@510101> <@19389>";

        expect(returnedString).toBe(expectedString);
    });

});
