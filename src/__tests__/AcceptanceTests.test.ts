import {
    anyString,
    anything,
    instance,
    mock,
    verify,
    when,
} from "ts-mockito"

import CoreApiClient from '../Repos/CoreApiClient';
import SlackApiClient from '../Repos/SlackApiClient';
import MessageBuilder from '../MessageBuilder';
import ChannelEventHandler from '../EventHandlers/ChannelEventHandler';
import type {ISlackUserIdentity} from "../Typings";
import { MemberJoinedChannelEvent } from "@slack/bolt";
import SlackId from "../Models/SlackId";

describe("Slack Service should", () => {

    it.each`
        isNewUser | expectedMessage
        ${true}   | ${'Hi Joe Bloggs, welcome to Sessionize!'} 
        ${false}  | ${'Hi Joe Bloggs, welcome back to Sessionize!'}
    `("send a personalised message when a user joins the channel", async ({ isNewUser, expectedMessage }) => {
        // GIVEN Sessionize is installed
        // WHEN a user joins the Sessionize slack channel
        // THEN they receive a personalized welcome message

        const event: MemberJoinedChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const slackIdentity: ISlackUserIdentity = {
            firstName: "Joe",
            lastName: "Bloggs",
            slackId: new SlackId("U0G9QF9C6"),
            email: "joe.bloggs@codurance.com"
        };

        const mockedCoreApiClient = mock(CoreApiClient);
        when(mockedCoreApiClient.isNewUser(anything())).thenReturn(isNewUser);

        const mockedSlackApiClient = mock(SlackApiClient);
        when(mockedSlackApiClient.getIdentity(anyString())).thenResolve(slackIdentity);

        const channelEventHandler = new ChannelEventHandler(
            instance(mockedCoreApiClient),
            instance(mockedSlackApiClient),
            new MessageBuilder());

        await channelEventHandler.onChannelJoin(event);

        verify(mockedSlackApiClient.sendDm(event.user, expectedMessage)).called();
    });
});
