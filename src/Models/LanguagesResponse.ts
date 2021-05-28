import type {ILanguagesResponse} from "Typings";
import Language from "./Language";

export default class LanguagesResponse implements ILanguagesResponse {

    languages: Language[]
    
    constructor(languages: Language[]){
        this.languages = languages;
    }

    static fromResponse(response: ILanguagesResponse): LanguagesResponse {
        return new LanguagesResponse(response.languages);
    }
}
