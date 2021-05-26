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
        console.log(language);
        console.table(language);
        this.matchIds = matchIds;
        this.language = language;
        console.log(this.language);
        console.table(this.language);
        this.dateTime = dateTime;
    }
}