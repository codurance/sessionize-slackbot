import dotenv from 'dotenv';
import {
    ChatPostMessageResponse,
    ConversationsMembersArguments,
    UsersProfileGetResponse,
    WebClient
} from '@slack/web-api';

import IMatchNotification from "./Interfaces/IMatchNotification";
import SlackId from "./SlackId";
import SlackUserIdentity from "./SlackUserIdentity";

dotenv.config();

export default class SlackApiClient {

    private web: WebClient = new WebClient(process.env.SLACK_BOT_TOKEN);

    async sendDm(slackId: string, message: string): Promise<ChatPostMessageResponse> {
        return await this.web.chat.postMessage({
            channel: slackId,
            text: message
        });
    };

    async getIdentity(slackId: string): Promise<SlackUserIdentity> {
        const userIdentity: UsersProfileGetResponse = await this.web.users.profile.get({
            user: slackId
        });

        const splitNames = userIdentity.profile?.real_name?.split(" ");

        return {
            slackId: new SlackId(slackId),
            email: userIdentity.profile?.email,
            firstName: splitNames![0],
            lastName: splitNames![1]
        } as SlackUserIdentity;
    }

    async sendMatchNotification(matchNotification: IMatchNotification): Promise<ChatPostMessageResponse> {

        return await this.web.chat.postMessage({
            channel: matchNotification.slackId.value,
            text: "You have a new match!",
            blocks: matchNotification.body
        });
    }

    async getConversationList(){
        return await this.web.conversations.list();
    }

    async getConversationMembers(channelId: string){
        return await this.web.conversations.members({channel: channelId} as ConversationsMembersArguments);
    }
}
