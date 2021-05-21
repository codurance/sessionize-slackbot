export default class DateTime {
    private _dateTime : string;
    constructor(dateTime : string){
        this._dateTime = dateTime;
    }
    get value(){
        return this._dateTime;
    }
}