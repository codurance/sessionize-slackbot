import DateTime from "./DateTime";
import ILanguage from "./Interfaces/ILanguage";
import IMatchDetails from "./Interfaces/IMatchDetails";
import IMatchNotificationRequest from "./Interfaces/IMatchNotificationRequest";
import Language from "./Language";
import SlackId from "./SlackId";

export default class MatchDetails implements IMatchDetails {
    language: ILanguage;
    dateTime: DateTime;
    users: SlackId[];

    constructor(language: ILanguage, dateTime: DateTime, users: SlackId[]){
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
