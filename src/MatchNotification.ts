import IMatchNotificationRequest from "./Interfaces/IMatchNotificationRequest";
import IMatchNotification from "./Interfaces/IMatchNotification";
import IUserIdentifier from "./Interfaces/IUserIdentifiers";
import SlackId from "./SlackId";
import UserName from "./UserName";
import { KnownBlock } from "@slack/web-api";

export default class MatchNotification implements MatchNotification {

    slackId: SlackId;
    body: KnownBlock[];

    constructor(slackId: SlackId, body: KnownBlock[]){
        this.slackId = slackId;
        this.body = body;
    }

    static userNamesFromUserIdentifiers(identifiers: IUserIdentifier[]) : UserName[] {
        let userNames : UserName[] = [];
        identifiers.map(identifier => {
            userNames.push(identifier.name);
        });
        return userNames;
    }

}