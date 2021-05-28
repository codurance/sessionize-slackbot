import SlackId from "./SlackId";
import {KnownBlock} from "@slack/web-api";

export default class MatchNotification implements MatchNotification {

    readonly slackId: SlackId;
    readonly body: KnownBlock[];

    constructor(slackId: SlackId, body: KnownBlock[]){
        this.slackId = slackId;
        this.body = body;
    }
}
