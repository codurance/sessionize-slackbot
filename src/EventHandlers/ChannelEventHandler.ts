import {MemberJoinedChannelEvent, MemberLeftChannelEvent} from "@slack/bolt";
import {ChatPostMessageResponse, KnownBlock} from "@slack/web-api";
import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../Repos/SlackApiClient";
import PreferencesForm from "../Models/PreferencesForm";
import SlackId from "../Models/SlackId";
import Language from "../Models/Language";
import { Request } from "express";

import type {InteractiveMessageResponse, IRawLanguageSubmission, ISlackUserIdentity} from "Typings";
import LanguageSubmission from "../Models/LanguageSubmission";
export default class ChannelEventHandler {

    coreApiClient: CoreApiClient
    slackApiClient: SlackApiClient
    messageBuilder: MessageBuilder

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient;
        this.slackApiClient = slackApiClient;
        this.messageBuilder = messageBuilder;
    }

    async onChannelJoin(event: MemberJoinedChannelEvent): Promise<ChatPostMessageResponse> {

        try {
            const slackIdentity: ISlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);

            const message: string = await this.coreApiClient.isNewUser(slackIdentity)
                ? this.messageBuilder.buildGreeting(slackIdentity.firstName + " " + slackIdentity.lastName)
                : this.messageBuilder.buildWelcomeBack(slackIdentity.firstName + " " + slackIdentity.lastName);

            return await this.slackApiClient.sendDm(event.user, message);
        } catch (error) {
            // TODO: Handle user-friendly errors
            throw new Error(error);
        }
    }

    async onChannelLeave(event: MemberLeftChannelEvent): Promise<ChatPostMessageResponse> {

        try {
            const slackIdentity: ISlackUserIdentity = await this.slackApiClient.getIdentity(event.user);

            const message: string = await this.coreApiClient.deactivateUser(slackIdentity)
                ? this.messageBuilder.buildFarewell(slackIdentity.firstName)
                : this.messageBuilder.errorOccurred(slackIdentity.firstName);

            return await this.slackApiClient.sendDm(event.user, message);
        } catch (error) {
            // TODO: Handle user-friendly errors
            throw new Error(error);
        }
    }

    interactiveMessageResponse = async (req: Request): Promise<any> => {
        try {
            const payload: InteractiveMessageResponse = JSON.parse(req.body.payload);
            // Send to method depending on the kind of response
            switch(payload.actions[0].action_id){

            case "confirm_preferences":
                console.log("Confirm preferences");
                try {

                    let rawLanguageSubmission: IRawLanguageSubmission;

                    if(payload.state?.values.FWTV.Jqez &&
                        payload.user.id){

                        const slackId: SlackId = new SlackId(payload.user.id);

                        rawLanguageSubmission =
                            payload.state?.values.FWTV.Jqez;

                        const languageSubmission: LanguageSubmission =
                            LanguageSubmission.fromResponse(slackId, rawLanguageSubmission);

                        console.log("Attempting to send submission");

                        console.log(this);

                        const response = await this.coreApiClient.sendPreferences(languageSubmission);

                        console.log(response);

                    }else{
                        // TODO: Deal with invalid languageSubmission
                    }

                }catch(error){
                    console.log(error);
                    throw new Error(error);
                }
                break;

            default:
                throw new Error("Unknown response");
            }
        } catch(error){
            return error;
        }
    }

    async sendLanguagePreferencesForm(user: SlackId): Promise<ChatPostMessageResponse> {

        try {

            console.log("channelEventHandler.sendLanguagePreferencesForm");
            const latestLanguagesResponse: Language[] = await this.coreApiClient.getLanguageList();

            const preferencesMessage: KnownBlock[] = this.messageBuilder.buildPreferencesForm(latestLanguagesResponse);

            const preferencesForm: PreferencesForm = new PreferencesForm(user, preferencesMessage);

            return await this.slackApiClient.sendPreferencesForm(preferencesForm);
        } catch(err){
            throw new Error(err);
        }
    }
}
