import SlackId from "./SlackId";

import type {ILanguage, IMatchNotificationContent} from "Typings";

export default class MatchNotificationContent implements IMatchNotificationContent {

    readonly matchIds: SlackId[];
    readonly language: ILanguage;

    constructor(matchIds: SlackId[], language: ILanguage){
        this.matchIds = matchIds;
        this.language = language;
    }
}
