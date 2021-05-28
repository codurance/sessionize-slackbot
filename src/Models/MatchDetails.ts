import DateTime from "./DateTime";
import Language from "./Language";
import SlackId from "./SlackId";

import type {ILanguage, IMatchDetails, IMatchNotificationRequest} from "Typings";

export default class MatchDetails implements IMatchDetails {
    readonly language: ILanguage;
    readonly dateTime: DateTime;
    readonly users: SlackId[];

    constructor(language: ILanguage, dateTime: DateTime, users: SlackId[]){
        this.language = language;
        this.dateTime = dateTime;
        this.users = users;
    }

    static fromRequest(request: IMatchNotificationRequest): MatchDetails {

        return new MatchDetails(
            new Language(request.language.value, request.language.displayName),
            new DateTime(request.dateTime),
            request.users
        );
    }
}
