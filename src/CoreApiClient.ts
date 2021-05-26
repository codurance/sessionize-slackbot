import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config()

export default class CoreApiClient {

    async isNewUser(slackUserIdentity: SlackUserIdentity): Promise<boolean> {

        // if(process.env.MOCK_CORE) return true;
        const response = await axios.post(process.env.CORE_API + "/slack/auth", slackUserIdentity);
        console.log("Fired");
        console.log(response);
        return response.data;
        // 201 new user
        // 204 existing user
    }

    async deactivateUser(slackUserIdentity : SlackUserIdentity): Promise<boolean> {

        const response = await axios.put(process.env.CORE_API + `/slack/optout?email=${slackUserIdentity.email}`);

        return response.data;
    }
}
