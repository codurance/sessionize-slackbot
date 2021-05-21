import DateTime from "../DateTime";
import Language from "../Language";
import IUserIdentifier from "./IUserIdentifiers";

export default interface IMatchDetails {
    language: Language,
    dateTime: DateTime,
    users: IUserIdentifier[]
}