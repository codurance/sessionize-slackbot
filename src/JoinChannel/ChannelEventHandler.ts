import { MemberJoinedChannelEvent } from "@slack/bolt";
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import SlackApiClient from "../SlackApiClient"
import SlackUserIdentity from "../SlackUserIdentity";
import JoinChannelEvent from "./JoinChannelEvent";

export default class ChannelEventHandler {

    coreApiClient: CoreApiClient
    slackApiClient: SlackApiClient
    messageBuilder: MessageBuilder

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient
        this.slackApiClient = slackApiClient
        this.messageBuilder = messageBuilder
    }

    async onChannelJoin(newUserPayload: MemberJoinedChannelEvent){
        const slackIdentity: SlackUserIdentity = await this.slackApiClient.getIdentity(newUserPayload.user);

        const message = this.coreApiClient.isNewUser(slackIdentity)
            ? this.messageBuilder.buildGreeting(slackIdentity.name)
            : this.messageBuilder.buildWelcomeBack(slackIdentity.name);

        return message;
    }
}
