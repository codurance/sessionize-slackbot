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
        };

        const userIdentity = {
            "ok": true,
            "user": {
                "name": "Joe Bloggs",
                "id": "U0G9QF9C6",
                "email": "joe.bloggs@codurance.com"
            },
            "team": {
                "id": "T0G9PQBBK"
            }
        };

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);
        when(mockedSlackApiClient.getIdentity(anyString())).thenReturn(userIdentity);

        const mockedMessageBuilder: MessageBuilder = mock(MessageBuilder);
        const messageBuilder: MessageBuilder = instance(mockedMessageBuilder);
        when(mockedMessageBuilder.buildGreeting(anyString())).thenReturn("This is a message");

        const poolHandler = new PoolHandler(coreApiClient, slackApiClient, messageBuilder);

        poolHandler.onPoolJoin(newUserPayload);

        verify(mockedCoreApiClient.isNewUser(userIdentity)).once();
        verify(mockedSlackApiClient.sendDm(userIdentity["user"]["id"], messageBuilder.buildGreeting(anyString())));
    });
});
