import dotenv from "dotenv";
import {
    ChatPostMessageResponse,
    ConversationsMembersArguments,
    ConversationsOpenArguments,
    ConversationsOpenResponse,
    UsersProfileGetResponse,
    WebClient
} from "@slack/web-api";

import SlackId from "../Models/SlackId";
import MatchNotification from "../Models/MatchNotification";
import PreferencesForm from "../Models/PreferencesForm";

import type {ISlackUserIdentity} from "Typings";
import {slackIdsToString} from "../Utils/ArraysUtils";

dotenv.config();

export default class SlackApiClient {

    private web: WebClient = new WebClient(process.env.SLACK_BOT_TOKEN);

    async sendDm(slackId: string, message: string): Promise<boolean> {
        try {
            const slackResponse: ChatPostMessageResponse = await this.web.chat.postMessage({
                channel: slackId,
                text: message
            });
            if(!slackResponse.ok){
                return false;
            }
            return true;
        }catch(err){
            console.error("Failed to send a direct message to user.");
            console.error(err);
            return false;
        }
    }

    async getIdentity(slackId: string): Promise<ISlackUserIdentity> {

        try{
            const userIdentity: UsersProfileGetResponse = await this.web.users.profile.get({
                user: slackId
            });

            const nameArray: string[] = this.parseFirstLastNames(userIdentity);

            return {
                slackId: slackId,
                email: userIdentity.profile?.email,
                firstName: nameArray[0] || "",
                lastName: nameArray[1] || ""
            } as ISlackUserIdentity;

        }catch(err){
            console.error(err);
            throw new Error("Could not contact Slack to request user profile information.");
        }
    }

    async sendMatchNotification(matchNotification: MatchNotification): Promise<ChatPostMessageResponse> {

        try {
            return await this.web.chat.postMessage({
                channel: matchNotification.channelId.id,
                text: "You have a new match!",
                blocks: matchNotification.body
            });
        }catch(err){
            console.error(err);
            throw new Error("Failed to contact Slack to send notification.");
        }

    }

    async sendPreferencesForm(preferencesForm: PreferencesForm): Promise<ChatPostMessageResponse> {

        try {
            return await this.web.chat.postMessage({
                channel: preferencesForm.user.slackId,
                text: "Please select your preferences",
                blocks: preferencesForm.body
            });
        }catch(err){
            console.error(err);
            throw new Error("Failed to contact Slack to send language preferences.");
        }

    }

    async getConversationList(): Promise<ChatPostMessageResponse> {
        try {
            return await this.web.conversations.list();
        }catch(err){
            console.error(err);
            throw new Error("Failed to contact Slack to request conversation list.");
        }
    }

    async getConversationMembers(channelId: string): Promise<ChatPostMessageResponse> {
        try {
            return await this.web.conversations.members({channel: channelId} as ConversationsMembersArguments);
        }catch(err){
            console.error(err);
            throw new Error("Failed to contact Slack to request members within conversations.");
        }
    }

    async createGroupDM(users: SlackId[]): Promise<ConversationsOpenResponse> {

        const conversationArgs: ConversationsOpenArguments = {
            users: slackIdsToString(users)
        };

        try {
            return await this.web.conversations.open(conversationArgs);
        }catch(err){
            console.error(err);
            throw new Error("Failed to contact Slack to create group DM.");
        }

    }

    private parseFirstLastNames(usersProfileGetResponse: UsersProfileGetResponse): string[] {
        let name: () => string = () => {
            if(usersProfileGetResponse.profile && usersProfileGetResponse.profile.real_name) return usersProfileGetResponse.profile.real_name;
            return "";
        };
        try {
            const nameArray = name().split(" ");
            nameArray.forEach(name => { if(!name) name = ""; })
            return nameArray;
        }catch(err){
            console.error(err);
            return ["Unknown", "User"];
        }
    }
}
