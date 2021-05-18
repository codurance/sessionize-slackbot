import SlackIdentity from "./SlackIdentity";

export default class SlackApiClient {
    sendDm(slackId: string, message: any): any {
        throw new Error("Method not implemented.");
    }

    getIdentity(slackId: string): SlackIdentity {
        throw new Error("Method not implemented.");
    }
}
