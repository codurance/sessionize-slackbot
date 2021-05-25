import DateTime from "./DateTime";
import IMatchNotificationContent from "./Interfaces/IMatchNotificationContent";
import Language from "./Language";
import SlackId from "./SlackId";
import UserName from "./UserName";

export default class MatchNotificationContent implements IMatchNotificationContent {

    matchIds: SlackId[];
    language: Language;
    dateTime: DateTime;

    constructor(matchIds: SlackId[], language: Language, dateTime: DateTime){
        this.matchIds = matchIds;
        this.language = language;
        this.dateTime = dateTime;
    }
}