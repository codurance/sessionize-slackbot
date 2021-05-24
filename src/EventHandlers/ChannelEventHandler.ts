import {MemberJoinedChannelEvent, MemberLeftChannelEvent} from "@slack/bolt";
import { ChatPostMessageResponse, WebClient } from "@slack/web-api";
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import SlackApiClient from "../SlackApiClient"
import SlackUserIdentity from "../SlackUserIdentity";

export default class ChannelEventHandler {

    coreApiClient: CoreApiClient
    slackApiClient: SlackApiClient
    messageBuilder: MessageBuilder

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient
        this.slackApiClient = slackApiClient
        this.messageBuilder = messageBuilder
    }

    async onChannelJoin(event: MemberJoinedChannelEvent){

        try {
            const slackIdentity: SlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);

            let message: string = await this.coreApiClient.isNewUser(slackIdentity)
                ? this.messageBuilder.buildGreeting(slackIdentity.name)
                : this.messageBuilder.buildWelcomeBack(slackIdentity.name);

            let slackResponse : ChatPostMessageResponse 
                = await this.slackApiClient.sendDm(event.user, message);

        } catch (error) {
            // TODO: Handle user-friendly errors
            console.error(error);
        }
    }

    async onChannelLeave(event: MemberLeftChannelEvent){

        try {
            const slackIdentity: SlackUserIdentity =
                await this.slackApiClient.getIdentity(event.user);

                console.log(slackIdentity);

            let message: string = await this.coreApiClient.deactivateUser(slackIdentity)
                ? this.messageBuilder.buildFarewell(slackIdentity.name)
                : this.messageBuilder.errorOccurred(slackIdentity.name);

                console.log(message);

            let slackResponse : ChatPostMessageResponse
                = await this.slackApiClient.sendDm(event.user, message);

        } catch (error) {
            // TODO: Handle user-friendly errors
            console.error(error);
        }

    }
}
