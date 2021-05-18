import {instance, mock, verify} from "ts-mockito"
import EventListenerController from "../JoinChannel/EventListenerController"
import ChannelEventHandler from "../JoinChannel/ChannelEventHandler"
import JoinChannelEvent from "../JoinChannel/JoinChannelEvent";

describe("EventListenerController", () => {
    test("should call the pool handler when a user joins the channel", () => {
        const mockedPoolHandler: ChannelEventHandler = mock(ChannelEventHandler);
        const poolHandler: ChannelEventHandler = instance(mockedPoolHandler);

        const newUserPayload: JoinChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const eventListenerController: EventListenerController = new EventListenerController(poolHandler);

        eventListenerController.joinPool(newUserPayload);

        verify(mockedPoolHandler.onChannelJoin(newUserPayload)).once();
    });
});