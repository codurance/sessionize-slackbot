import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';

dotenv.config()

export default class CoreApiClient {
    isNewUser(slackUserIdentity: SlackUserIdentity): boolean {
        if(process.env.MOCK_CORE) return true;
        throw new Error("Method not implemented.");
    }
}
