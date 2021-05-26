import ILanguage from "./Interfaces/ILanguage";

export default class Language implements ILanguage {

    readonly language : string;
    readonly displayName : string;

    constructor(language : string, displayName : string){
        this.language = language;
        this.displayName = displayName;
    }
}