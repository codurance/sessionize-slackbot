import dotenv from "dotenv";
import axios from "axios";
import Language from "../Models/Language";

import type {ISlackUserIdentity, ISlackUserSubmission} from "Typings";
import LanguageSubmission from "../Models/LanguageSubmission";

dotenv.config();

export default class CoreApiClient {

    async isNewUser(slackUserSubmission: ISlackUserSubmission): Promise<boolean> {

        if (process.env.MOCK_CORE == "true") return true;

        try {
            const url = new URL(`/slack/auth`, `${process.env.CORE_API}`);
            const response = await axios.post(url.toString(), slackUserSubmission);
            return response.data;
            // 201 new user
            // 204 existing user
        } catch (err) {
            console.error(err);
            return Promise.resolve(false);
        }
    }

    async deactivateUser(slackUserIdentity: ISlackUserIdentity): Promise<boolean> {

        if (process.env.MOCK_CORE == "true") return true;

        try{
            const url = new URL(`/slack/availability?email=${slackUserIdentity.email}`, `${process.env.CORE_API}`);
            const response = await axios.put(url.toString());

            return response.data;
        } catch (err) {
            console.error(err);
            return Promise.resolve(false);
        }
    }

    async sendPreferences(languageSubmission: LanguageSubmission): Promise<string> {

        const config = {
            headers: {
                "slack-user": languageSubmission.slackId.slackId
            }
        };

        const data = languageSubmission.body;

        try {
            const url = new URL(`/slack/preferences`, `${process.env.CORE_API}`);
            const response = await axios.post(url.toString());
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(error);
            return Promise.resolve("error");
        }
    }

    async getLanguageList(): Promise<Language[]> {
        try{
            const url = new URL(`/slack/languages`, `${process.env.CORE_API}`);
            const response = await axios.get(url.toString());
            return response.data;
        } catch (err) {
            throw new Error("A connection could not be made to core");
        }
    }
}
