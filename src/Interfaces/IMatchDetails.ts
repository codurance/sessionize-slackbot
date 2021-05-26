import DateTime from "../DateTime";
import Language from "../Language";
import SlackId from "../SlackId";

export default interface IMatchDetails {
    language: Language,
    dateTime: DateTime,
    users: SlackId[]
}