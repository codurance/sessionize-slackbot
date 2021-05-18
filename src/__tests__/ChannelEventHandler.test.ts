import {
    anyString,
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
import JoinChannelEvent from "../JoinChannel/JoinChannelEvent"

describe("ChannelEventHandler", () => {
    test("should make request to core to see if user joining channel is new", () => {

        const newUserPayload : JoinChannelEvent = {
            "type": "member_joined_channel",
            "user": "U0G9QF9C6",
            "channel": "C0698JE0H",
            "channel_type": "C",
            "team": "T024BE7LD",
            "inviter": "U123456789"
        };

        const userIdentity : SlackUserIdentity = {
            name: "Joe Bloggs",
            id: "U0G9QF9C6",
            email: "joe.bloggs@codurance.com"
        };

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);
        when(mockedSlackApiClient.getIdentity(anyString())).thenReturn(userIdentity);

        const mockedMessageBuilder: MessageBuilder = mock(MessageBuilder);
        const messageBuilder: MessageBuilder = instance(mockedMessageBuilder);
        when(mockedMessageBuilder.buildGreeting(anyString())).thenReturn("This is a message");

        const channelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);

        channelEventHandler.onChannelJoin(newUserPayload);

        verify(mockedCoreApiClient.isNewUser(userIdentity)).once();
        verify(mockedSlackApiClient.sendDm(userIdentity.id, messageBuilder.buildGreeting(anyString())));
    });
});
