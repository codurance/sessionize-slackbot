import {MemberJoinedChannelEvent, MemberLeftChannelEvent} from "@slack/bolt";
import {ChatPostMessageResponse, KnownBlock} from "@slack/web-api";
import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../Repos/SlackApiClient";
import PreferencesForm from "../Models/PreferencesForm";
import SlackId from "../Models/SlackId";
import Language from "../Models/Language";
import { Request, Response } from "express";
import type {InteractiveMessageResponse, ISlackUserIdentity, ISlackUserSubmission} from "Typings";
import LanguageSubmission from "../Models/LanguageSubmission";
import SlackUserSubmission from "../Models/SlackUserSubmission";

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

        } catch (err) {
            // TODO: Handle user-friendly errors
            console.error("There was an issue sending a direct message to a user.");
            console.error(err);
            await this.slackApiClient.sendDm(event.user, "It looks likes there is something wrong at the moment. Please leave the channel and try again later.");

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
            // TODO: Handle user-friendly errs
             console.error(err);
             await this.slackApiClient.sendDm(event.user, "It looks like there was a problem detecting that you'd left the channel.");
        }
    }



    async sendLanguagePreferencesForm(user: SlackId): Promise<ChatPostMessageResponse> {

        try {

            const latestLanguagesResponse: Language[] = await this.coreApiClient.getLanguageList();
            const preferencesMessage: KnownBlock[] = this.messageBuilder.buildPreferencesForm(latestLanguagesResponse);

            const preferencesForm: PreferencesForm = new PreferencesForm(user, preferencesMessage);

            return await this.slackApiClient.sendPreferencesForm(preferencesForm);
        } catch(err){
            throw new Error(err);
        }
    }
}
