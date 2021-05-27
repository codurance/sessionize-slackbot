import ILanguagesResponse from "./Interfaces/ILanguagesResponse";
import ILanguageResponse from "./Interfaces/ILanguagesResponse";
import Language from "./Language";

export default class LanguagesResponse implements ILanguageResponse {

    languages: Language[]
    
    constructor(languages: Language[]){
        this.languages = languages;
    }

    static fromResponse(response: ILanguagesResponse){
        return new LanguagesResponse(response.languages);
    }
}
