export default class SlackId {
    private slackId : string;
    constructor(slackId : string){
        this.slackId = slackId;
    }
    get value(){
        return this.slackId;
    }
}