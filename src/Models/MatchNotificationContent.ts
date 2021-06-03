import SlackId from "./SlackId";

import type { ILanguage } from "Typings";
import type {IMatchNotificationContent} from "Typings";

export default class MatchNotificationContent implements IMatchNotificationContent {

    readonly matchIds: SlackId[];
    readonly language: ILanguage;

    constructor(matchIds: SlackId[], language: ILanguage){
        this.matchIds = matchIds;
        this.language = language;
    }
}
