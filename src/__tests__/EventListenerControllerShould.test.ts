import {instance, mock, verify} from "ts-mockito"
import EventListenerController from "../EventListenerController"
import PoolHandler from "../PoolHandler"

describe("EventListenerController", () => {
    test("should call the pool handler when a user joins the channel", () => {
        const mockedPoolHandler: PoolHandler = mock(PoolHandler);
        const poolHandler: PoolHandler = instance(mockedPoolHandler);

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

        verify(mockedPoolHandler.onPoolJoin(newUserPayload)).once();
    });
});