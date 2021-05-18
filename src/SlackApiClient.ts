import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';
dotenv.config()

export default class SlackApiClient {

    sendDm(slackId: string, message: any): any {
        throw new Error("Method not implemented.");
    }

    getIdentity(slackId: string): SlackUserIdentity {
        throw new Error("Method not implemented.");
    }
}
