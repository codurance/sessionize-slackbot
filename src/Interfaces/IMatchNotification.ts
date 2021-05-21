import SlackId from "../SlackId";
import MatchNotificationContent from "./IMatchNotificationContent";

export default interface IMatchNotification {
    slackId: SlackId,
    body: MatchNotificationContent
}