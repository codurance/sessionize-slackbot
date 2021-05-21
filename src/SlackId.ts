export default class SlackId {
    private _slackId : string;
    constructor(slackId : string){
        this._slackId = slackId;
    }
    get value(){
        return this._slackId;
    }
}