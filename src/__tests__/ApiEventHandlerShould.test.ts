import { anything, deepEqual, instance, match, mock, verify } from "ts-mockito"
import { Request, Response } from 'express';
import SlackApiClient from "../SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../CoreApiClient";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import ExpectedMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import IMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import MatchNotification from "../MatchNotification";
import SlackId from "../SlackId";
import MatchNotificationContent from "../MatchNotificationContent";
import UserName from "../UserName";
import Language from "../Language";
import DateTime from "../DateTime";
import IUserIdentifierRequest from "../Interfaces/IUserIdentifierRequest";

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

    test("should send match notifications as requested in a call's request", async () => {

        const expectedRequestBody : IMatchNotificationRequest = {
            "language": "Java",
            "dateTime": "2021-12-01T17:00:00.000Z",
            "users": [
                {
                    "slackId": "ABC123",
                    "firstName": "Cameron",
                    "lastName": "Raw"
                } as IUserIdentifierRequest,
                {
                    "slackId": "ABC321",
                    "firstName": "Dave",
                    "lastName": "Grohl"
                } as IUserIdentifierRequest,
            ]
        };

        const testRequest : Partial<Request> = {
            body: expectedRequestBody
        };

        const testResponse : Partial<Response> = {
            send: jest.fn()
        }

        const matchNotificationContent1 : MatchNotificationContent = new MatchNotificationContent([new UserName("Dave Grohl")],
        new Language("Java"), new DateTime("2021-12-01T17:00:00.000Z"));

        const matchNotification1 : MatchNotification = new MatchNotification(
            new SlackId("ABC123"),
            messageBuilder.buildMatchNotification(matchNotificationContent1)
        )
        const matchNotificationContent2 : MatchNotificationContent = new MatchNotificationContent([new UserName("Cameron Raw")], 
                new Language("Java"), new DateTime("2021-12-01T17:00:00.000Z"));

        const matchNotification2 : MatchNotification = new MatchNotification(
            new SlackId("ABC321"),
            messageBuilder.buildMatchNotification(matchNotificationContent2)
        );

        await apiEventHandler.onMatchNotification(testRequest as Request, testResponse as Response);

        verify(mockedSlackApiClient.sendMatchNotification(anything())).twice();

        verify(mockedSlackApiClient.sendMatchNotification(deepEqual(matchNotification1))).once();
        verify(mockedSlackApiClient.sendMatchNotification(deepEqual(matchNotification2))).once();
    });


});