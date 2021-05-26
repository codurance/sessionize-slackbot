import {anyOfClass, deepEqual, instance, mock, verify} from "ts-mockito"
import {Request, Response} from 'express';
import SlackApiClient from "../SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../CoreApiClient";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import IMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import MatchNotification from "../MatchNotification";
import SlackId from "../SlackId";
import {Button, KnownBlock} from "@slack/web-api";

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
        }

        const testResponse: Partial<Response> = {
            send: jest.fn()
        }
        await apiEventHandler.onDirectMessage(testRequest as Request, testResponse as Response);
        verify(mockedSlackApiClient.sendDm(expectedSlackId, expectedMessage));
    });

    test("should turn an array of UserNames into a string", () => {

        const messageBuilder: MessageBuilder = new MessageBuilder();

        const userNameArray: SlackId[] = [
            new SlackId("12345"),
            new SlackId("54321"),
            new SlackId("9878"),
            new SlackId("510101"),
            new SlackId("19389")
        ];

        const returnedString: string = messageBuilder.matchIdsAsString(userNameArray);

        const expectedString: string = "<@12345> <@54321> <@9878> <@510101> <@19389>";

        expect(returnedString).toBe(expectedString);
    });

    test("should create a match notification for slack given a match request from the core API", async () => {

        const cameron = new SlackId("ABC123");
        const dave = new SlackId("321CBA");
        const matchNotificationRequest: IMatchNotificationRequest = {
            language: {
                value: "java",
                displayName: "Java"
            },
            dateTime: "2021-05-26T19:30:00.000Z",
            users: [
                cameron,
                dave
            ]
        };

        const mockRequest: Partial<Request> = {body: matchNotificationRequest}
        const mockResponse: Partial<Response> = {send: jest.fn()}

        const cameronExpectedMatchNotification: MatchNotification = generateMatchNotificationFor(cameron, dave);
        const daveExpectedMatchNotification: MatchNotification = generateMatchNotificationFor(dave, cameron);

        await apiEventHandler.onMatchNotification(mockRequest as Request, mockResponse as Response);

        verify(mockedSlackApiClient.sendMatchNotification(anyOfClass(MatchNotification))).twice();
        verify(mockedSlackApiClient.sendMatchNotification(deepEqual(cameronExpectedMatchNotification))).once();
        verify(mockedSlackApiClient.sendMatchNotification(deepEqual(daveExpectedMatchNotification))).once();
    })

    const generateMatchNotificationFor = (user: SlackId, partner: SlackId): MatchNotification => {
        const body: KnownBlock[] = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `You have a new match:\n <@${partner.value}>`
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Language:*\nJava`
                    },
                    {
                        type: "mrkdwn",
                        text: `*When:*\n26/05/2021 19:30`
                    }
                ]
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Approve",
                            emoji: true
                        },
                        action_id: "approve_session",
                        style: "primary",
                        value: "session_confirmed"
                    } as Button,
                    {
                        type: "button",
                        text: {
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

        return new MatchNotification(user, body);
    }
});