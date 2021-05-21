export default class Language {
    private language : string;
    constructor(language : string){
        this.language = language;
    }
    get value(){
        return this.language;
    }
}