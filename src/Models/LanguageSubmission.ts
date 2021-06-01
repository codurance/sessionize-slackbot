import type {ILanguageSubmission, IRawLanguageSubmission} from "Typings";
import Language from "./Language";
import SlackId from "./SlackId";

export default class LanguageSubmission implements ILanguageSubmission {

    slackId: SlackId;
    body: {
        primaryLanguage: string,
        secondaryLanguage: string,
        tertiaryLanguage: string
    };

    constructor(slackId: SlackId, languages: Language[]){
        this.slackId = slackId;
        this.body = {
            primaryLanguage : languages[0].value,
            secondaryLanguage : languages[1].value,
            tertiaryLanguage : languages[2].value
        };
    }

    static fromResponse(slackId: SlackId, rawLanguageSubmission: IRawLanguageSubmission): LanguageSubmission {
        const languageList: Language[] = [];

        rawLanguageSubmission.selected_options.map(option => {
            const thisLanguage: Language = new Language(option.value, option.text.text);
            languageList.push(thisLanguage);
        });

        return new LanguageSubmission(slackId, languageList);
    }
}
