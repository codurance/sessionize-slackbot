import {BlockAction, MemberJoinedChannelEvent, MemberLeftChannelEvent} from "@slack/bolt";
import {ChatPostMessageResponse, KnownBlock} from "@slack/web-api";
import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../Repos/SlackApiClient";
import PreferencesForm from "../Models/PreferencesForm";
import SlackId from "../Models/SlackId";
import Language from "../Models/Language";
import { Request, Response } from "express";

import type {ISlackUserIdentity} from "Typings";
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

            const slackResponse: ChatPostMessageResponse
                = await this.slackApiClient.sendDm(event.user, message);

            return slackResponse;

        } catch (error) {
            // TODO: Handle user-friendly errors
            throw new Error(error);
        }
    }

    async onChannelLeave(event: MemberLeftChannelEvent): Promise<ChatPostMessageResponse> {

        try {
            const slackIdentity: ISlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);


            const message: string = await this.coreApiClient.deactivateUser(slackIdentity)
                ? this.messageBuilder.buildFarewell(slackIdentity.firstName)
                : this.messageBuilder.errorOccurred(slackIdentity.firstName);


            const slackResponse: ChatPostMessageResponse
                = await this.slackApiClient.sendDm(event.user, message);

            return slackResponse;

        } catch (error) {
            // TODO: Handle user-friendly errors
            throw new Error(error);
        }

    }

    async interactiveMessageResponse(req: Request): Promise<any> {
        try {
            const payload: BlockAction = JSON.parse(req.body.payload);
            // Send to method depending on the kind of response
            switch(payload.actions[0].action_id){
            case "approve_session":
                return this.processApprovedSession(payload);

            default:
                throw new Error("Unknown response");
            }
        }catch(error){
            return error;
        }
    }

    async processApprovedSession(payload: BlockAction){
        // TODO: Prepare approve_session payload and send to core
    }

    async sendLanguagePreferencesForm(user: SlackId): Promise<ChatPostMessageResponse> {

        try {

            const latestLanguagesResponse: Language[] =
                await this.coreApiClient.getLanguageList();


            const preferencesMessage: KnownBlock[] = this.messageBuilder.buildPreferencesForm(latestLanguagesResponse);


            const preferencesForm: PreferencesForm = new PreferencesForm(user, preferencesMessage);


            const response: ChatPostMessageResponse = await this.slackApiClient.sendPreferencesForm(preferencesForm);

            return response;

        }catch(err){
            throw new Error(err);
        }

    }
}
