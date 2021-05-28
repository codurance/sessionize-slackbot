import DateTime from "./DateTime";
import SlackId from "./SlackId";

import type { ILanguage } from "Typings";
import type {IMatchNotificationContent} from "Typings";

export default class MatchNotificationContent implements IMatchNotificationContent {

    readonly matchIds: SlackId[];
    readonly language: ILanguage;
    readonly dateTime: DateTime;

    constructor(matchIds: SlackId[], language: ILanguage, dateTime: DateTime){
        this.matchIds = matchIds;
        this.language = language;
        this.dateTime = dateTime;
    }
}
