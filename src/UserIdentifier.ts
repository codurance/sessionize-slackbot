import IUserIdentifierRequest from "./Interfaces/IUserIdentifierRequest";
import IUserIdentifier from "./Interfaces/IUserIdentifiers";
import SlackId from "./SlackId";
import UserName from "./UserName";

export default class UserIdentifier implements IUserIdentifier {
    slackId: SlackId;
    name: UserName;

    constructor(slackId : SlackId, name: UserName){
        this.slackId = slackId;
        this.name = name;
    }

    static fromRequest(request: IUserIdentifierRequest){
        return new UserIdentifier(
            new SlackId(request.slackId),
            new UserName(request.name)
        );
    }

}