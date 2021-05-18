import {instance, mock, verify} from "ts-mockito"
import EventListenerController from "../JoinChannel/EventListenerController"
import ChannelEventHandler from "../JoinChannel/ChannelEventHandler"

describe("EventListenerController", () => {
    test("should call the pool handler when a user joins the channel", () => {
        const mockedPoolHandler: ChannelEventHandler = mock(ChannelEventHandler);
        const poolHandler: ChannelEventHandler = instance(mockedPoolHandler);

        const newUserPayload = {
            "ok": true,
            "user": {
                "name": "Sonny Whether",
                "id": "U0G9QF9C6",
                "email": "bobby@example.com"
            },
            "team": {
                "id": "T0G9PQBBK"
            }
        };

        const eventListenerController: EventListenerController = new EventListenerController(poolHandler);

        eventListenerController.joinPool(newUserPayload);

        verify(mockedPoolHandler.onChannelJoin(newUserPayload)).once();
    });
});