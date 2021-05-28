import dotenv from "dotenv";
import {
    ChatPostMessageResponse,
    ConversationsMembersArguments,
    UsersProfileGetResponse,
    WebClient
} from "@slack/web-api";

import SlackId from "../Models/SlackId";
import MatchNotification from "../Models/MatchNotification";
import PreferencesForm from "../Models/PreferencesForm";

import type {ISlackUserIdentity} from "Typings";

dotenv.config();

export default class SlackApiClient {

    private web: WebClient = new WebClient(process.env.SLACK_BOT_TOKEN);

    async sendDm(slackId: string, message: string): Promise<ChatPostMessageResponse> {
        return await this.web.chat.postMessage({
            channel: slackId,
            text: message
        });
    }

    async getIdentity(slackId: string): Promise<ISlackUserIdentity> {
        const userIdentity: UsersProfileGetResponse = await this.web.users.profile.get({
            user: slackId
        });

        const splitNames = Array<string|undefined>(2);

        try {
            const nameAfterSplit = userIdentity.profile?.real_name?.split(" ");
            nameAfterSplit?.map((string, i) => {
                splitNames[i] = string;
            });
        }catch(err){
            console.log(err);
        }

        return {
            slackId: new SlackId(slackId),
            email: userIdentity.profile?.email,
            firstName: splitNames[0],
            lastName: splitNames[1]
        } as ISlackUserIdentity;
    }

    async sendMatchNotification(matchNotification: MatchNotification): Promise<ChatPostMessageResponse> {

        return await this.web.chat.postMessage({
            channel: matchNotification.slackId.slackId,
            text: "You have a new match!",
            blocks: matchNotification.body
        });
    }

    async sendPreferencesForm(preferencesForm: PreferencesForm): Promise<ChatPostMessageResponse> {

        return await this.web.chat.postMessage({
            channel: preferencesForm.user.slackId,
            text: "Please select your preferences",
            blocks: preferencesForm.body
        });
    }

    async getConversationList(): Promise<ChatPostMessageResponse> {
        return await this.web.conversations.list();
    }

    async getConversationMembers(channelId: string): Promise<ChatPostMessageResponse> {
        return await this.web.conversations.members({channel: channelId} as ConversationsMembersArguments);
    }
}
