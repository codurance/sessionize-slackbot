import CoreApiClient from "./CoreApiClient"
import MessageBuilder from "./MessageBuilder"
import SlackApiClient from "./SlackApiClient"

export default class PoolHandler {

    coreApiClient: CoreApiClient
    slackApiClient: SlackApiClient
    messageBuilder: MessageBuilder

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder){
        this.coreApiClient = coreApiClient
        this.slackApiClient = slackApiClient
        this.messageBuilder = messageBuilder
    }

    // TODO: Change `any` to its `ChannelJoinResponse` class
    onPoolJoin(newUserPayload: any) {
        const userIdentity = this.slackApiClient.getIdentity(newUserPayload["user"]);

        if(this.coreApiClient.isNewUser(userIdentity)) {
            const message = this.messageBuilder.buildGreeting(userIdentity["user"]["name"]);
            this.slackApiClient.sendDm(userIdentity["user"]["id"], message);
        } 
    }
}
