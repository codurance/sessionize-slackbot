import ILanguage from "./ILanguage";
import SlackId from "../SlackId";

export default interface IMatchNotificationRequest {
    language: ILanguage,
    dateTime: string,
    users: SlackId[],
}