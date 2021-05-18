import {
    anyString,
    instance,
    mock,
    verify,
    when,
} from "ts-mockito"

import CoreApiClient from '../CoreApiClient';
import SlackApiClient from '../SlackApiClient';
import MessageBuilder from '../MessageBuilder';
import ChannelEventHandler from '../JoinChannel/ChannelEventHandler';
import EventListenerController from '../JoinChannel/EventListenerController';
import JoinChannelEvent from '../JoinChannel/JoinChannelEvent';

describe("Slack Service should", () => {

    it.each`
        isNewUser | expectedMessage
        ${true}   | ${'Hi Joe Bloggs, welcome to Sessionize!'} 
        ${false}  | ${'Hi Joe Bloggs, welcome back to Sessionize!'}
    `("send a personalised message when a user joins the channel", ({ isNewUser, expectedMessage }) => {

        // GIVEN Sessionize is installed
        // WHEN a user joins the Sessionize slack channel
        // THEN they receive a personalized welcome message

        // Arrange
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
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        } as JoinChannelEvent;

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);
        when(mockedCoreApiClient.isNewUser(identityResponse)).thenReturn(isNewUser);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);
        when(mockedSlackApiClient.getIdentity(newUserPayload["user"])).thenReturn(identityResponse);
        when(mockedSlackApiClient.sendDm(newUserPayload["user"], anyString())).thenReturn(identityResponse);

        const messageBuilder = new MessageBuilder();
        const poolHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);
        const eventListenerController = new EventListenerController(poolHandler);

        // Act
        eventListenerController.joinPool(newUserPayload);

        // Assert
        verify(mockedCoreApiClient.isNewUser(identityResponse)).once();
        verify(mockedSlackApiClient.sendDm(identityResponse["user"]["id"], expectedMessage)).once();
    });
});
