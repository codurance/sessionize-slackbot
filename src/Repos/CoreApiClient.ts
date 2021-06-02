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
            const response = await axios.post(process.env.CORE_API + "/slack/auth", slackUserSubmission);
            return response.data;
            // 201 new user
            // 204 existing user
        }catch(err){
            console.log(err);
            return new Promise((resolve) => {
                resolve(false);
            });
        }
    }

    async deactivateUser(slackUserIdentity: ISlackUserIdentity): Promise<boolean> {

        if (process.env.MOCK_CORE == "true") return true;

        try{

            const response = await axios.put(process.env.CORE_API + `/slack/availability?email=${slackUserIdentity.email}`);

            return response.data;

        }catch(err){
            console.log(err);
            return new Promise((resolve) => {
                resolve(false);
            });
        }

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
            return new Promise((resolve) => {
                resolve("error");
            });
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
