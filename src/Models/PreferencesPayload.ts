import IPreferencesPayload from "./Interfaces/IPreferencesPayload";

export default class PreferencesPayload implements IPreferencesPayload {

    primaryLanguage: string;
    secondaryLanguage: string;
    tertiaryLanguage: string;

    constructor(primaryLanguage: string, secondaryLanguage: string, tertiaryLanguage: string){
        this.primaryLanguage = primaryLanguage;
        this.secondaryLanguage = secondaryLanguage;
        this.tertiaryLanguage = tertiaryLanguage;
    }

}
