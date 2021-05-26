import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';
import axios from "axios";
import PreferencesPayload from "./PreferencesPayload";

dotenv.config()

export default class CoreApiClient {

    async isNewUser(slackUserIdentity: SlackUserIdentity): Promise<boolean> {

        if (process.env.MOCK_CORE == "true") return true;

        const response = await axios.post(process.env.CORE_API + "/slack/auth", slackUserIdentity);
        return response.data;
        // 201 new user
        // 204 existing user
    }

    async deactivateUser(slackUserIdentity: SlackUserIdentity): Promise<boolean> {

        const response = await axios.put(process.env.CORE_API + `/slack/optout?email=${slackUserIdentity.email}`);

        return response.data;
    }

    async sendPreferences(preferencesPayload : PreferencesPayload) : Promise<boolean> {
        
        const response = await axios.post(process.env.CORE_API + '/slack/preferences', preferencesPayload);

        return response.data;

    }
}
