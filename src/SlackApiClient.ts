import SlackUserIdentity from "./SlackUserIdentity";
import { ChatPostMessageResponse, KnownBlock, UsersProfileGetResponse, WebClient } from '@slack/web-api';

import dotenv from 'dotenv';
import IMatchNotification from "./Interfaces/IMatchNotification";
import MessageBuilder from "./MessageBuilder";
dotenv.config();

export default class SlackApiClient {

    private web : WebClient = new WebClient(process.env.SLACK_BOT_TOKEN);

    async sendDm(slackId: string, message: string): Promise<ChatPostMessageResponse> {
        return await this.web.chat.postMessage({
            channel: slackId,
            text: message
        });
    };

    async getIdentity(slackId: string): Promise<SlackUserIdentity> {
        const userIdentity : UsersProfileGetResponse = await this.web.users.profile.get({
            user: slackId
        });

        let splitNames = userIdentity.profile?.real_name?.split(" ");

        return {
            slackId: slackId,
            email: userIdentity.profile?.email,
            firstName: splitNames![0],
            lastName: splitNames![1]
        } as SlackUserIdentity;
    }

    async sendMatchNotification(matchNotification : IMatchNotification) : Promise<ChatPostMessageResponse> {

        console.log("sendMatchNotification fired");
        console.log(matchNotification);

        let response = await this.web.chat.postMessage({
            channel: matchNotification.slackId.value,
            text: "You have a new match!",
            blocks: matchNotification.body
        });

        return response;

    }

}
