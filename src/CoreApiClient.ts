import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config()

export default class CoreApiClient {
    async isNewUser(slackUserIdentity: SlackUserIdentity): Promise<boolean> {
        console.table(slackUserIdentity);
        const response = await axios.post("https://sessionizertest.azurewebsites.net/isNewUser", slackUserIdentity)
        return response.data;
        // throw new Error("Method not implemented.");
    }
}
