import {BlockAction, MemberJoinedChannelEvent, MemberLeftChannelEvent} from "@slack/bolt";
import {ChatPostMessageResponse, WebClient} from "@slack/web-api";
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import SlackApiClient from "../SlackApiClient"
import SlackUserIdentity from "../SlackUserIdentity";
import { Request, Response } from 'express';

export default class ChannelEventHandler {

    coreApiClient: CoreApiClient
    slackApiClient: SlackApiClient
    messageBuilder: MessageBuilder

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient
        this.slackApiClient = slackApiClient
        this.messageBuilder = messageBuilder
    }

    async onChannelJoin(event: MemberJoinedChannelEvent) {

        try {
            const slackIdentity: SlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);

            let message: string = await this.coreApiClient.isNewUser(slackIdentity)
                ? this.messageBuilder.buildGreeting(slackIdentity.firstName + " " + slackIdentity.lastName)
                : this.messageBuilder.buildWelcomeBack(slackIdentity.firstName + " " + slackIdentity.lastName);

            let slackResponse: ChatPostMessageResponse
                = await this.slackApiClient.sendDm(event.user, message);

        } catch (error) {
            // TODO: Handle user-friendly errors
            console.error(error);
        }
    }

    async onChannelLeave(event: MemberLeftChannelEvent) {

        try {
            const slackIdentity: SlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);

            console.log(slackIdentity);

            let message: string = await this.coreApiClient.deactivateUser(slackIdentity)
                ? this.messageBuilder.buildFarewell(slackIdentity.firstName)
                : this.messageBuilder.errorOccurred(slackIdentity.firstName);

            console.log(message);

            let slackResponse: ChatPostMessageResponse
                = await this.slackApiClient.sendDm(event.user, message);

        } catch (error) {
            // TODO: Handle user-friendly errors
            console.error(error);
        }

    }

    async interactiveMessageResponse(req: Request, res: Response){
        try {
            const payload: BlockAction = JSON.parse(req.body.payload);
            console.log(console.log(JSON.stringify(payload)));
            // Send to method depending on the kind of response
            switch(payload.actions[0].action_id){
                case "approve_session":
                    this.processApprovedSession(payload);
                break;

                default:
                    throw new Error("Unknown response");
            }
        }catch(err){
            console.log(err);
        }
    }

    async processApprovedSession(payload: BlockAction){
        // TODO: Prepare approve_session payload and send to core
    }

}
