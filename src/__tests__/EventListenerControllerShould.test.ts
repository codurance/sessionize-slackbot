import {instance, mock, verify} from "ts-mockito"
import EventListenerController from "../EventListenerController"
import PoolHandler from "../PoolHandler"

describe("EventListenerController", () => {
    test("should call the pool handler when a user joins the channel", () => {
        let mockedPoolHander:PoolHandler = mock(PoolHandler)
        let poolHandler:PoolHandler = instance(mockedPoolHander)

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
        }

        let eventListenerController : EventListenerController = new EventListenerController(poolHandler)

        eventListenerController.joinPool(newUserPayload)

        verify(mockedPoolHander.onPoolJoin(newUserPayload)).once()
    })
})
