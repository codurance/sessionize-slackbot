import IUserIdentifier from "./Interfaces/IUserIdentifiers";

export default class UserName {
    private userName : string;
    constructor(userName : string){
        this.userName = userName;
    }
    get value(){
        return this.userName;
    }

    static fromUserIdentifier(identifier: IUserIdentifier){
        return identifier.name;
    }
}