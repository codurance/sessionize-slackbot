import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import SlackApiClient from "../SlackApiClient"
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

    onChannelJoin(newUserPayload: JoinChannelEvent) {
        const slackIdentity = this.slackApiClient.getIdentity(newUserPayload.user);

        const message = this.coreApiClient.isNewUser(slackIdentity.user)
            ? this.messageBuilder.buildGreeting(slackIdentity.user.name)
            : this.messageBuilder.buildWelcomeBack(slackIdentity.user.name);

        this.slackApiClient.sendDm(slackIdentity.user.id, message);
    }
}
