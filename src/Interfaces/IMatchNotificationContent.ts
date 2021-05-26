import DateTime from "../DateTime";
import Language from "../Language";
import SlackId from "../SlackId";

export default interface IMatchNotificationContent {
    matchIds: SlackId[],
    language: Language,
    dateTime: DateTime
}