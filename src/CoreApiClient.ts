import SlackUserIdentity from "./SlackUserIdentity";

export default class CoreApiClient {
    isNewUser(slackUserIdentity: SlackUserIdentity): boolean {
        throw new Error("Method not implemented.");
    }
}
