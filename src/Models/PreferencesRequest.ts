import Language from "./Models/Language";
import SlackId from "./SlackId";

export default class PreferencesRequest {

    slackId : SlackId;
    languages : Language[];

    constructor(slackId : SlackId, languages: Language[]){
        this.slackId = slackId;
        this.languages = languages;       
    }

    static async fromRequest(request : Request){
        let body = await request.json();
        return new PreferencesRequest(body.slackId, body.languages);
    }
}