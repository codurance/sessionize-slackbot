import DateTime from "../DateTime";
import Language from "../Language";
import UserName from "../UserName";

export default interface MatchNotificationContent {
    name: UserName,
    language: Language,
    dateTime: DateTime
}