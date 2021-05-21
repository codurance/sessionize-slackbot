import DateTime from "../DateTime";
import Language from "../Language";
import UserName from "../UserName";

export default interface IMatchNotificationContent {
    matchNames: UserName[],
    language: Language,
    dateTime: DateTime
}