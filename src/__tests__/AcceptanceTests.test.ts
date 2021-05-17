import {
    anyString,
    instance,
    mock,
    verify,
    when,
} from "ts-mockito"

import CoreApiClient from '../CoreApiClient'
import SlackApiClient from '../SlackApiClient'
import MessageBuilder from '../MessageBuilder'
import PoolHandler from '../PoolHandler'
import EventListenerController from '../EventListenerController'

describe("Slack Service should", () => {
    test("send a welcome message to new users", () => {

        // GIVEN: A new user 
        // WHEN: The user enters the channel
        // THEN: Send their details to the Sessionize core
        // AND: Send welcome message to user

        const identityResponse = {
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

        const newUserPayload = {
            "type": "member_joined_channel",
            "user": "U0G9QF9C6",
            "channel": "C0698JE0H",
            "channel_type": "C",
            "team": "T024BE7LD",
            "inviter": "U123456789"
        }

        const expectedMessage = "Hi Sonny Whether, welcome to Sessionize!"

        let mockedCoreApiClient:CoreApiClient = mock(CoreApiClient)
        let coreApiClient:CoreApiClient = instance(mockedCoreApiClient)

        when(mockedCoreApiClient.isNewUser(identityResponse)).thenReturn(true)

        let mockedSlackApiClient:SlackApiClient = mock(SlackApiClient)
        let slackApiClient:SlackApiClient = instance(mockedSlackApiClient)

        when(mockedSlackApiClient.getIdentity(newUserPayload["user"])).thenReturn(identityResponse)
        when(mockedSlackApiClient.sendDm(newUserPayload["user"], anyString())).thenReturn(identityResponse)

        let messageBuilder = new MessageBuilder()

        let poolHandler = new PoolHandler(coreApiClient, slackApiClient, messageBuilder)
        let eventListenerController = new EventListenerController(poolHandler)

        // Endpoint is hit from Slack
        eventListenerController.joinPool(newUserPayload)

        verify(mockedCoreApiClient.isNewUser(identityResponse)).once()
        verify(mockedSlackApiClient.sendDm(identityResponse["user"]["id"], expectedMessage)).once()

    })
})
