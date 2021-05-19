import {MemberJoinedChannelEvent} from "@slack/bolt";
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
        const slackIdentity: SlackUserIdentity = await this.slackApiClient.getIdentity(event.user);

        return this.coreApiClient.isNewUser(slackIdentity)
            ? this.messageBuilder.buildGreeting(slackIdentity.name)
            : this.messageBuilder.buildWelcomeBack(slackIdentity.name);
    }
}
