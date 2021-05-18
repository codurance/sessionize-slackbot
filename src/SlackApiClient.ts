import SlackUserIdentity from "./SlackUserIdentity";
import { RTMClient } from '@slack/rtm-api';
import dotenv from 'dotenv';
dotenv.config()

export default class SlackApiClient {

    private rtm : RTMClient;

    constructor(){
        this.rtm = new RTMClient(process.env.SLACK_BOT_TOKEN!);
    }

    sendDm(slackId: string, message: any): any {
        throw new Error("Method not implemented.");
    }

    getIdentity(slackId: string): SlackUserIdentity {
        throw new Error("Method not implemented.");
    }
}
