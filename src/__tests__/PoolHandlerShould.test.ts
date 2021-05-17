import {
    anyString,
    instance,
    mock,
    verify,
    when
} from "ts-mockito"
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import PoolHandler from "../PoolHandler"
import SlackApiClient from "../SlackApiClient"

describe("PoolHandler", () => {
    test("should make request to core to see if user joining pool is new", () => {

        const newUserPayload = {
            "type": "member_joined_channel",
            "user": "U0G9QF9C6",
            "channel": "C0698JE0H",
            "channel_type": "C",
            "team": "T024BE7LD",
            "inviter": "U123456789"
        }

        const userIdentity = {
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

        let mockedCoreApiClient:CoreApiClient = mock(CoreApiClient)
        let coreApiClient:CoreApiClient = instance(mockedCoreApiClient)

        let mockedSlackApiClient:SlackApiClient = mock(SlackApiClient)
        let slackApiClient:SlackApiClient = instance(mockedSlackApiClient)

        let mockedMessageBuilder:MessageBuilder = mock(MessageBuilder)
        let messageBuilder:MessageBuilder = instance(mockedMessageBuilder)

        let poolHandler = new PoolHandler(coreApiClient, slackApiClient, messageBuilder)

        when(mockedMessageBuilder.buildGreeting(anyString())).thenReturn("This is a message")
        when(mockedSlackApiClient.getIdentity(anyString())).thenReturn(userIdentity)

        poolHandler.onPoolJoin(newUserPayload)

        verify(mockedCoreApiClient.isNewUser(userIdentity)).once()
        verify(mockedSlackApiClient.sendDm(userIdentity["user"]["id"], messageBuilder.buildGreeting(anyString())))
    })
})
