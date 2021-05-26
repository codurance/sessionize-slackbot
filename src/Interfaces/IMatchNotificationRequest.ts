import Language from "../Language";
import ILanguage from "./ILanguage";
import IUserIdentifierRequest from "./IUserIdentifierRequest";
import IUserIdentifier from "./IUserIdentifiers";

export default interface IMatchNotificationRequest {
    language: ILanguage,
    dateTime: string,
    users: IUserIdentifierRequest[],
}