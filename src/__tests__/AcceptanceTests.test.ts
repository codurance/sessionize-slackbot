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
import SlackIdentity from "../SlackIdentity";
import SlackTeamIdentity from "../SlackTeamIdentity";
import SlackUserIdentity from "../SlackUserIdentity";

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
        const slackIdentity: SlackIdentity = {
            ok: true,
            user: {
                name: "Joe Bloggs",
                id: "U0G9QF9C6",
                email: "joe.bloggs@codurance.com"
            } as SlackUserIdentity,
            team: {
                id: "T0G9PQBBK"
            } as SlackTeamIdentity
        };

        const newUserPayload: JoinChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);
        when(mockedCoreApiClient.isNewUser(slackIdentity.user)).thenReturn(isNewUser);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);
        when(mockedSlackApiClient.getIdentity(newUserPayload.user)).thenReturn(slackIdentity);
        when(mockedSlackApiClient.sendDm(newUserPayload.user, anyString())).thenReturn(slackIdentity);

        const messageBuilder = new MessageBuilder();
        const channelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);
        const eventListenerController = new EventListenerController(channelEventHandler);

        // Act
        eventListenerController.joinPool(newUserPayload);

        // Assert
        verify(mockedCoreApiClient.isNewUser(slackIdentity.user)).once();
        verify(mockedSlackApiClient.sendDm(slackIdentity.user.id, expectedMessage)).once();
    });
});
