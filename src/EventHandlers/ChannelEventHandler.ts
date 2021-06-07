import {KnownBlock, MemberJoinedChannelEvent, MemberLeftChannelEvent} from "@slack/bolt";
import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../Repos/SlackApiClient";
import type {ISlackUserIdentity, ISlackUserSubmission} from "Typings";
import SlackUserSubmission from "../Models/SlackUserSubmission";
import PreferencesForm from "../Models/PreferencesForm";
import SlackId from "../Models/SlackId";
import Language from "Models/Language";

export default class ChannelEventHandler {

    coreApiClient: CoreApiClient
    slackApiClient: SlackApiClient
    messageBuilder: MessageBuilder

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient;
        this.slackApiClient = slackApiClient;
        this.messageBuilder = messageBuilder;
    }

    async onChannelJoin(event: MemberJoinedChannelEvent): Promise<void> {

        try {
            const slackIdentity: ISlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);

            const slackUserSubmission: ISlackUserSubmission = SlackUserSubmission.fromSlackResponse(slackIdentity);

            const message: string = await this.coreApiClient.isNewUser(slackUserSubmission)
                ? this.messageBuilder.buildGreeting(slackIdentity.firstName + " " + slackIdentity.lastName)
                : this.messageBuilder.buildWelcomeBack(slackIdentity.firstName + " " + slackIdentity.lastName);

             await this.slackApiClient.sendDm(event.user, message);

             await this.triggerLanguagePrefForm(event);

        } catch (err) {
            console.error("There was an issue sending a direct message to a user.");
            console.error(err);
            console.log(event.user);
            await this.slackApiClient.sendDm(event.user, "It looks like there is something wrong at the moment. Please leave the channel and try again later.");
        }
    }

    async onChannelLeave(event: MemberLeftChannelEvent): Promise<void> {
        try {
            const slackIdentity: ISlackUserIdentity = await this.slackApiClient.getIdentity(event.user);

            const message: string = await this.coreApiClient.deactivateUser(slackIdentity)
                ? this.messageBuilder.buildFarewell(slackIdentity.firstName)
                : this.messageBuilder.errorOccurred(slackIdentity.firstName);

             await this.slackApiClient.sendDm(event.user, message);

        } catch (err) {
             console.error(err);
             await this.slackApiClient.sendDm(event.user, "It looks like there was a problem detecting that you'd left the channel.");
        }
    }

    private async triggerLanguagePrefForm(event: MemberJoinedChannelEvent) {

        const languages: Language[] = await this.coreApiClient.getLanguageList();

        const languagePreferencesBody: KnownBlock[] = this.messageBuilder.buildPreferencesForm(languages);

        const preferencesForm: PreferencesForm = new PreferencesForm(new SlackId(event.user), languagePreferencesBody);

        await this.slackApiClient.sendPreferencesForm(preferencesForm);
    }
}
