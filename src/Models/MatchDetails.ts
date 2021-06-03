import DateTime from "./DateTime";
import Language from "./Language";
import SlackId from "./SlackId";

import type {ILanguage, IMatchDetails, IMatchNotificationRequest} from "Typings";

export default class MatchDetails implements IMatchDetails {

    readonly language: ILanguage;
    readonly users: SlackId[];

    constructor(language: ILanguage, users: SlackId[]){
        this.language = language;
        this.users = users;
    }

    static fromRequest(request: IMatchNotificationRequest): MatchDetails {

        const slackIdArray: SlackId[] = [];

        request.users.forEach(user => {
            slackIdArray.push(new SlackId(user));
        });

        return new MatchDetails(
            new Language(request.language.value, request.language.displayName),
            slackIdArray
        );
    }
}
