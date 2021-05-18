import {
    anyString,
    instance,
    mock,
    verify,
    when,
} from "ts-mockito"

import CoreApiClient from '../CoreApiClient'
import SlackApiClient from '../SlackApiClient'
import MessageBuilder from '../MessageBuilder'
import PoolHandler from '../PoolHandler'
import EventListenerController from '../EventListenerController'

describe("Slack Service should", () => {
    const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);

    const identityResponse = {
        "ok": true,
        "user": {
            "name": "Joe Bloggs",
            "id": "U0G9QF9C6",
            "email": "joe.bloggs@codurance.com"
        },
        "team": {
            "id": "T0G9PQBBK"
        }
    };

    const newUserPayload = {
        "type": "member_joined_channel",
        "user": "U0G9QF9C6",
        "channel": "C0698JE0H",
        "channel_type": "C",
        "team": "T024BE7LD",
        "inviter": "U123456789"
    };

    test("send a welcome message to new users", () => {

        // GIVEN Sessionize is installed
        // WHEN a user joins the Sessionize slack channel
        // THEN they receive a personalized welcome message

        // Arrange
        const expectedMessage = "Hi Joe Bloggs, welcome to Sessionize!";

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);
        when(mockedCoreApiClient.isNewUser(identityResponse)).thenReturn(true);

        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);
        when(mockedSlackApiClient.getIdentity(newUserPayload["user"])).thenReturn(identityResponse);
        when(mockedSlackApiClient.sendDm(newUserPayload["user"], anyString())).thenReturn(identityResponse);

        const messageBuilder = new MessageBuilder();
        const poolHandler = new PoolHandler(coreApiClient, slackApiClient, messageBuilder);
        const eventListenerController = new EventListenerController(poolHandler);

        // Act
        eventListenerController.joinPool(newUserPayload);

        // Assert
        verify(mockedCoreApiClient.isNewUser(identityResponse)).once();
        verify(mockedSlackApiClient.sendDm(identityResponse["user"]["id"], expectedMessage)).once();
    });

    test("send a welcome back message to returning users", () =>  {

        const expectedMessage = "Hi Joe Bloggs, welcome back to Sessionize!";

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);
        when(mockedCoreApiClient.isNewUser(identityResponse)).thenReturn(false);

        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);
        when(mockedSlackApiClient.getIdentity(newUserPayload["user"])).thenReturn(identityResponse);
        when(mockedSlackApiClient.sendDm(newUserPayload["user"], anyString())).thenReturn(identityResponse);

        const messageBuilder = new MessageBuilder();
        const poolHandler = new PoolHandler(coreApiClient, slackApiClient, messageBuilder);
        const eventListenerController = new EventListenerController(poolHandler);

        // Act
        eventListenerController.joinPool(newUserPayload);

        // Assert
        verify(mockedCoreApiClient.isNewUser(identityResponse)).once();
        verify(mockedSlackApiClient.sendDm(identityResponse["user"]["id"], expectedMessage)).once();
    });
});
