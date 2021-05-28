import type { ILanguage } from "Typings";

export default class Language implements ILanguage {

    readonly value: string;
    readonly displayName: string;

    constructor(language: string, displayName: string){
        this.value = language;
        this.displayName = displayName;
    }
}
