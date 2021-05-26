import DateTime from "./DateTime";
import IMatchDetails from "./Interfaces/IMatchDetails";
import IMatchNotificationRequest from "./Interfaces/IMatchNotificationRequest";
import IUserIdentifiers from "./Interfaces/IUserIdentifiers";
import Language from "./Language";
import UserIdentifier from "./UserIdentifier";

export default class MatchDetails implements IMatchDetails {
    language: Language;
    dateTime: DateTime;
    users: IUserIdentifiers[];

    constructor(language: Language, dateTime: DateTime, users: IUserIdentifiers[]){
        this.language = language;
        this.dateTime = dateTime;
        this.users = users;
    }

    static fromRequest(request : IMatchNotificationRequest){

        let userIdentifiers : IUserIdentifiers[] = [];

        request.users.map(user => {
            userIdentifiers.push(UserIdentifier.fromRequest(user));
        });

        return new MatchDetails(
            new Language(request.language.language, request.language.displayName),
            new DateTime(request.dateTime),
            userIdentifiers
        );

    }

}
