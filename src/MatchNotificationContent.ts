import DateTime from "./DateTime";
import ILanguage from "./Interfaces/ILanguage";
import IMatchNotificationContent from "./Interfaces/IMatchNotificationContent";
import Language from "./Language";
import SlackId from "./SlackId";

export default class MatchNotificationContent implements IMatchNotificationContent {

    readonly matchIds: SlackId[];
    readonly language: Language;
    readonly dateTime: DateTime;

    constructor(matchIds: SlackId[], language: Language, dateTime: DateTime){
        this.matchIds = matchIds;
        this.language = language;
        this.dateTime = dateTime;
    }
}
