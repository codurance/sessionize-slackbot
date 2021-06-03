import dotenv from "dotenv";
import axios from "axios";
import PreferencesPayload from "Models/PreferencesPayload";
import Language from "../Models/Language";

import type {ISlackUserIdentity} from "Typings";

dotenv.config();

export default class CoreApiClient {

    async isNewUser(slackUserIdentity: ISlackUserIdentity): Promise<boolean> {
        if (process.env.MOCK_CORE == "true") return true;

        const url = new URL(`/slack/auth`, `${process.env.CORE_API}`);
        const response = await axios.post(url.toString(), slackUserIdentity);
        return response.data;
        // 201 new user
        // 204 existing user
    }

    async deactivateUser(slackUserIdentity: ISlackUserIdentity): Promise<boolean> {
        if (process.env.MOCK_CORE == "true") return true;
        const url = new URL(`/slack/optout?email=${slackUserIdentity.email}`, `${process.env.CORE_API}`);
        const response = await axios.put(url.toString());
        return response.data;
    }

    async sendPreferences(preferencesPayload : PreferencesPayload) : Promise<boolean> {
        const url = new URL(`/slack/preferences`, `${process.env.CORE_API}`);
        const response = await axios.post(url.toString());

        return response.data;
    }

    async getLanguageList() : Promise<Language[]> {
        try {
            const url = new URL(`/slack/languages`, `${process.env.CORE_API}`);
            const response = await axios.get(url.toString());
            return response.data;
        } catch (err) {
            throw new Error("A connection could not be made to core");
        }
    }
}
