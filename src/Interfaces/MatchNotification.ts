import SlackId from "../SlackId";
import MatchNotificationContent from "./MatchNotificationContent";

export default interface MatchNotification {
    slackId: SlackId,
    body: MatchNotificationContent
}