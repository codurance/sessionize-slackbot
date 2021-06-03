import type {ILanguage, ILanguageSubmission} from "Typings";
import Language from "./Language";
import SlackId from "./SlackId";

export default class LanguageSubmission implements ILanguageSubmission {

    slackId: SlackId;
    body: {
        primaryLanguage: Language,
        secondaryLanguage: Language,
        tertiaryLanguage: Language
    };

    constructor(slackId: SlackId, languages: Language[]){
        this.slackId = slackId;
        this.body = {
            primaryLanguage : languages[0],
            secondaryLanguage : languages[1],
            tertiaryLanguage : languages[2]
        };
    }

    static fromResponse(slackId: SlackId, rawLanguageSubmission: ILanguage[]): LanguageSubmission {
        const languageList: Language[] = rawLanguageSubmission.map(option => new Language(option.value, option.displayName));
        return new LanguageSubmission(slackId, languageList);
    }
}
