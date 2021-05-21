export default class Language {
    private _language : string;
    constructor(language : string){
        this._language = language;
    }
    get value(){
        return this._language;
    }
}