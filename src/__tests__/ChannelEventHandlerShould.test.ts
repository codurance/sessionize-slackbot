import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito"
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler"
import SlackApiClient from "../SlackApiClient"
import SlackUserIdentity from "../SlackUserIdentity"
import { KnownBlock, MemberJoinedChannelEvent } from "@slack/bolt"
import SlackId from "../SlackId";
import Language from "../Language"
import PreferencesForm from "../PreferencesForm"
import LanguagesResponse from "../LanguagesResponse"

describe("ChannelEventHandler", () => {
    test("should make request to core to see if user joining channel is new", async () => {

        const event: MemberJoinedChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const userIdentity: SlackUserIdentity = {
            firstName: "Joe",
            lastName: "Bloggs",
            slackId: new SlackId("U0G9QF9C6"),
            email: "joe.bloggs@codurance.com"
        };

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        when(mockedCoreApiClient.isNewUser(userIdentity)).thenResolve(true);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        when(mockedSlackApiClient.getIdentity(event.user)).thenResolve(userIdentity);

        const channelEventHandler = new ChannelEventHandler(instance(mockedCoreApiClient), instance(mockedSlackApiClient), new MessageBuilder());

        const message = await channelEventHandler.onChannelJoin(event);

        verify(mockedCoreApiClient.isNewUser(userIdentity)).once();
    });
    test("should make a request to user for language preferences", async () => {

        const languagesResponseFromCore: Language[] = [
                new Language("JAVA", "Java"),
                new Language("CSHARP", "C#"),
                new Language("PYTHON", "Python")
            ];

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        when(mockedCoreApiClient.getLanguageList()).thenResolve(languagesResponseFromCore);

        const user: SlackId = new SlackId("ABC123");

        const messageBuilder: MessageBuilder = new MessageBuilder();

        const channelEventHandler: ChannelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);

        const languagesResponse: LanguagesResponse = new LanguagesResponse(languagesResponseFromCore);

        const preferencesBody: KnownBlock[] = messageBuilder.buildPreferencesForm(languagesResponse.languages);

        const preferencesForm: PreferencesForm = new PreferencesForm(user, preferencesBody);

        await channelEventHandler.sendLanguagePreferencesForm(user);

        verify(mockedSlackApiClient.sendPreferencesForm(anything())).once();
        verify(mockedSlackApiClient.sendPreferencesForm(deepEqual(preferencesForm))).once();

    });
});
