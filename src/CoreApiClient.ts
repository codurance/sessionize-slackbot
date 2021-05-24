import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';

dotenv.config()

export default class CoreApiClient {

    async isNewUser(slackUserIdentity: SlackUserIdentity): Promise<boolean> {

        const response = await this.post(process.env.CORE_API + "/slack/auth", {
            body: slackUserIdentity
        });

        return response.json();
        // 201 new user
        // 204 existing user
    }

    async deactivateUser(slackUserIdentity : SlackUserIdentity): Promise<boolean> {

        console.log(process.env.MOCK_CORE);

        if(process.env.MOCK_CORE){
            return true;
        }
        const response = await this.post(process.env.CORE_API + `/slack/optout?email=${slackUserIdentity.email}`, {
            body: slackUserIdentity
        });

        return response.json();
    }

    private post = async (url: string, options : any) => {
        return await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(options.body)
        })
    }
}
