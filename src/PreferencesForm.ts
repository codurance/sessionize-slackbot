import {KnownBlock} from "@slack/types";
import SlackId from "./SlackId";

export default class PreferencesForm {
    user: SlackId;
    body: KnownBlock[];

    constructor(user: SlackId, body: KnownBlock[]){
        this.user = user;
        this.body = body;
    }
}
