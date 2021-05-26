import SlackId from "./SlackId";
import {KnownBlock} from "@slack/web-api";

export default class MatchNotification implements MatchNotification {

    slackId: SlackId;
    body: KnownBlock[];

    constructor(slackId: SlackId, body: KnownBlock[]){
        this.slackId = slackId;
        this.body = body;
    }
}