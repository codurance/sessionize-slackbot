import DateTime from "./DateTime";
import IMatchDetails from "./Interfaces/IMatchDetails";
import IMatchNotificationRequest from "./Interfaces/IMatchNotificationRequest";
import Language from "./Language";
import SlackId from "./SlackId";

export default class MatchDetails implements IMatchDetails {
    language: Language;
    dateTime: DateTime;
    users: SlackId[];

    constructor(language: Language, dateTime: DateTime, users: SlackId[]){
        this.language = language;
        this.dateTime = dateTime;
        this.users = users;
    }

    static fromRequest(request: IMatchNotificationRequest){

        return new MatchDetails(
            new Language(request.language.value, request.language.displayName),
            new DateTime(request.dateTime),
            request.users
        );
    }
}