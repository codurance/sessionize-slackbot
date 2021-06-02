import { anything, deepEqual, instance, mock, verify, when } from "ts-mockito";
import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler";
import SlackApiClient from "../Repos/SlackApiClient";
import { KnownBlock } from "@slack/bolt";
import SlackId from "../Models/SlackId";
import Language from "../Models/Language";
import PreferencesForm from "../Models/PreferencesForm";
import LanguagesResponse from "../Models/LanguagesResponse";


describe("ChannelEventHandler", () => {
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
