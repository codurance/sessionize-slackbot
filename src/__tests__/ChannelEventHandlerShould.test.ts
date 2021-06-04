import {MemberJoinedChannelEvent, MemberLeftChannelEvent, SlackEvent} from "@slack/bolt";
import {anyString, anything, instance, mock, verify, when} from "ts-mockito";
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../Repos/CoreApiClient";
import SlackApiClient from "../Repos/SlackApiClient";

describe("ChannelEventHandler", () => {

    it.each`
        expectedMessage                                                                                             | userAction
        ${"It looks like there is something wrong at the moment. Please leave the channel and try again later."}    | ${"joins"}
        ${"It looks like there was a problem detecting that you'd left the channel."}                               | ${"leaves"}
    `("should send a user friendly message when an error is thrown as a user $userAction the channel", async ({ expectedMessage, userAction }) => {

        const mockSlackEvent: Partial<SlackEvent> = {
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

        if(userAction == "joins"){
            channelEventHandler.onChannelJoin(mockSlackEvent as MemberJoinedChannelEvent);
        }else if(userAction == "leaves"){
            channelEventHandler.onChannelLeave(mockSlackEvent as MemberLeftChannelEvent);
        }

        verify(mockedSlackApiClient.sendDm(anyString(), anyString())).once();
        verify(mockedSlackApiClient.sendDm(expectedSlackId, expectedMessage)).once();
    });
});
