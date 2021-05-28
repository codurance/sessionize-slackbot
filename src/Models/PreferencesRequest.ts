import Language from "./Language";
import SlackId from "./SlackId";

export default class PreferencesRequest {

    readonly slackId: SlackId;
    readonly languages: Language[];

    constructor(slackId: SlackId, languages: Language[]){
        this.slackId = slackId;
        this.languages = languages;       
    }

    static async fromRequest(request: Request): Promise<PreferencesRequest> {
        const body = await request.json();
        return new PreferencesRequest(body.slackId, body.languages);
    }
}
