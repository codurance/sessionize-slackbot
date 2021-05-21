import SlackUserIdentity from "./SlackUserIdentity";
import dotenv from 'dotenv';

dotenv.config()

export default class CoreApiClient {
    async isNewUser(slackUserIdentity: SlackUserIdentity): Promise<boolean> {
        console.table(slackUserIdentity);
        const response = await this.post("https://sessionizertest.azurewebsites.net/isNewUser", {
            body: slackUserIdentity
        })
        console.table(response);
        const json = response.json();
        console.table(json);
        return json;
        // throw new Error("Method not implemented.");
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
