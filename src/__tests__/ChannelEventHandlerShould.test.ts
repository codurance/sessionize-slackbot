import {MemberJoinedChannelEvent} from "@slack/bolt";
import {anyString, anything, instance, mock, verify, when} from "ts-mockito";
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../Repos/CoreApiClient";
import SlackApiClient from "../Repos/SlackApiClient";

describe("ChannelEventHandler", () => {
    test("should send a message to the user when an error was thrown when they joined the channel", () => {

        const mockSlackEvent: Partial<MemberJoinedChannelEvent> = {
            user: "SlackId1"
        };

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);

        const messageBuilder: MessageBuilder = new MessageBuilder();

        const channelEventHandler: ChannelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);

        when(mockedSlackApiClient.getIdentity(anything())).thenThrow(Error("This is an error."));

        const expectedSlackId: string = "SlackId1";
        const expectedMessage: string = "It looks like there is something wrong at the moment. Please leave the channel and try again later.";

        channelEventHandler.onChannelJoin(mockSlackEvent as MemberJoinedChannelEvent);

        verify(mockedSlackApiClient.sendDm(anyString(), anyString())).once();
        verify(mockedSlackApiClient.sendDm(expectedSlackId, expectedMessage)).once();
    });
});
