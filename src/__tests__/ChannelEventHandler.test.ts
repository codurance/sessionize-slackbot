import {
    anyString,
    anything,
    instance,
    mock,
    verify,
    when
} from "ts-mockito"
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import ChannelEventHandler from "../JoinChannel/ChannelEventHandler"
import SlackApiClient from "../SlackApiClient"
import SlackUserIdentity from "../SlackUserIdentity"
import { MemberJoinedChannelEvent } from "@slack/bolt"

describe("ChannelEventHandler", () => {
    test("should make request to core to see if user joining channel is new", async () => {

        const event: MemberJoinedChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const userIdentity: SlackUserIdentity = {
            name: "Joe Bloggs",
            id: "U0G9QF9C6",
            email: "joe.bloggs@codurance.com"
        };

        let mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        when(mockedCoreApiClient.isNewUser(userIdentity)).thenReturn(true);
        let coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        let mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        when(mockedSlackApiClient.getIdentity(event.user)).thenResolve(userIdentity);
        let slackApiClient: SlackApiClient = instance(mockedSlackApiClient);

        const channelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, new MessageBuilder());

        let message = await channelEventHandler.onChannelJoin(event);

        verify(mockedCoreApiClient.isNewUser(userIdentity)).once();
    });
});
