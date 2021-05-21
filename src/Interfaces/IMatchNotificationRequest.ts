import IUserIdentifierRequest from "./IUserIdentifierRequest";
import IUserIdentifier from "./IUserIdentifiers";

export default interface IMatchNotificationRequest {
    "language": string,
    "dateTime": string,
    "users": IUserIdentifierRequest[],
}