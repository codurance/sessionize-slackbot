import DateTime from "../DateTime";
import Language from "../Language";
import SlackId from "../SlackId";
import UserName from "../UserName";

export default interface IMatchNotificationContent {
    matchIds: SlackId[],
    language: Language,
    dateTime: DateTime
}