export default class UserName {
    private _userName : string;
    constructor(userName : string){
        this._userName = userName;
    }
    get value(){
        return this._userName;
    }
}