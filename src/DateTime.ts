export default class DateTime {
    private readonly dateTime: string;
    constructor(dateTime: string){
        this.dateTime = dateTime;
    }
    get value(){
        return this.dateTime;
    }
}