import DateTime from "./DateTime";
import IMatchNotificationContent from "./Interfaces/IMatchNotificationContent";
import Language from "./Language";
import UserName from "./UserName";

export default class MatchNotificationContent implements IMatchNotificationContent {

    matchNames: UserName[];
    language: Language;
    dateTime: DateTime;

    constructor(matchNames: UserName[], language: Language, dateTime: DateTime){
        this.matchNames = matchNames;
        this.language = language;
        this.dateTime = dateTime;
    }
}