import SlackId from "../SlackId";
import UserName from "../UserName";

export default interface IUserIdentifier {
    slackId: SlackId,
    name: UserName
}