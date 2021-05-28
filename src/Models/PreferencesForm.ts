import {KnownBlock} from "@slack/types";
import SlackId from "./SlackId";

export default class PreferencesForm {
    readonly user: SlackId;
    readonly body: KnownBlock[];

    constructor(user: SlackId, body: KnownBlock[]){
        this.user = user;
        this.body = body;
    }
}
