import dotenv from "dotenv";
import axios from "axios";
import Language from "../Models/Language";

import type {ISlackUserIdentity} from "Typings";
import LanguageSubmission from "Models/LanguageSubmission";

dotenv.config();

export default class CoreApiClient {

    async isNewUser(slackUserIdentity: ISlackUserIdentity): Promise<boolean> {

        if (process.env.MOCK_CORE == "true") return true;

        const response = await axios.post(process.env.CORE_API + "/slack/auth", slackUserIdentity);
        return response.data;
        // 201 new user
        // 204 existing user
    }

    async deactivateUser(slackUserIdentity: ISlackUserIdentity): Promise<boolean> {

        if (process.env.MOCK_CORE == "true") return true;

        const response = await axios.put(process.env.CORE_API + `/slack/availability?email=${slackUserIdentity.email}`);

        return response.data;
    }

    async sendPreferences(languageSubmission : LanguageSubmission) : Promise<string> {

        const config = {
            headers: {
                "slack-user": languageSubmission.slackId.slackId
            }
        };

        const data = languageSubmission.body;

        try {
            const response = await axios.put(process.env.CORE_API + "/slack/preferences/languages", data, config);
            console.log(response);
            return response.data;
        }catch(error){
            console.log(error);
            throw new Error(error);
        }

    }

    async getLanguageList() : Promise<Language[]> {
        try{
            const response = await axios.get(process.env.CORE_API + "/slack/languages");
            return response.data;
        }catch(err){
            throw new Error("A connection could not be made to core");
        }

    }
}
