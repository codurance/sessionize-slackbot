import ILanguagesResponse from "./Interfaces/ILanguagesResponse";
import ILanguageResponse from "./Interfaces/ILanguagesResponse";
import Language from "./Language";

export default class LanguagesResponse implements ILanguageResponse {

    languages: [string, string][]
    
    constructor(languages: [string, string][]){
        this.languages = languages;
    }

    toLanguageList(): Language[] {
        let languageList: Language[] = [];
        this.languages.map(language => {
            languageList.push(new Language(language[0], language[1]));
        });
        return languageList;
    }

    static fromResponse(response: ILanguagesResponse){
        return new LanguagesResponse(response.languages);
    }
}
