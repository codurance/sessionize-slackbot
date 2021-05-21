import IMatchNotificationRequest from "./Interfaces/IMatchNotificationRequest";
import IMatchNotification from "./Interfaces/IMatchNotification";
import IMatchNotificationContent from "./Interfaces/IMatchNotificationContent";
import IUserIdentifier from "./Interfaces/IUserIdentifiers";
import MatchNotificationContent from "./MatchNotificationContent";
import SlackId from "./SlackId";
import UserName from "./UserName";
import MatchDetails from "./MatchDetails";

export default class MatchNotification implements IMatchNotification {

    slackId: SlackId;
    body: IMatchNotificationContent;

    constructor(slackId: SlackId, body: MatchNotificationContent){
        this.slackId = slackId;
        this.body = body;
    }

    static fromRequestBody(requestBody : IMatchNotificationRequest) : MatchNotification[] {

        let matchNotificationArray : MatchNotification[] = [];

        const matchDetails : MatchDetails = MatchDetails.fromRequest(requestBody); 

        matchDetails.users.map((user : IUserIdentifier) => {

            const matchedUsers : IUserIdentifier[] = this.arrayOfOtherElements(matchDetails.users, user);

            const matchNotificationContent : MatchNotificationContent = new MatchNotificationContent(
                this.userNamesFromUserIdentifiers(matchedUsers),
                matchDetails.language,
                matchDetails.dateTime
            );

            const matchNotification : IMatchNotification = new MatchNotification(
                user.slackId,
                matchNotificationContent
            );

            matchNotificationArray.push(matchNotification);
        });

        return matchNotificationArray;
    }

    static arrayOfOtherElements(userDetailArray : IUserIdentifier[], userDetailToExclude : IUserIdentifier) : IUserIdentifier[]{
        return userDetailArray.filter(value => JSON.stringify(value) !== JSON.stringify(userDetailToExclude));
    }

    static userNamesFromUserIdentifiers(identifiers: IUserIdentifier[]) : UserName[] {
        let userNames : UserName[] = [];
        identifiers.map(identifier => {
            userNames.push(identifier.name);
        });
        return userNames;
    }

}