import SlackUserIdentity from "./SlackUserIdentity";
import { ChatPostMessageResponse, UsersProfileGetResponse, WebClient } from '@slack/web-api';

import dotenv from 'dotenv';
dotenv.config();

export default class SlackApiClient {

    private web : WebClient = new WebClient(process.env.SLACK_BOT_TOKEN);

    sendDm(slackId: string, message: string): Promise<ChatPostMessageResponse> {
        return this.web.chat.postMessage({
            channel: slackId,
            text: message
        });
    };

    async getIdentity(slackId: string): Promise<SlackUserIdentity> {
        const userIdentity : UsersProfileGetResponse = await this.web.users.profile.get({
            user: slackId
        });

        return {
            name: userIdentity.profile?.real_name,
            id: slackId,
            email: userIdentity.profile?.email
        } as SlackUserIdentity;
    }
}
