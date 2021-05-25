import IUserIdentifier from "../Interfaces/IUserIdentifiers";

export function arrayOfAllOtherUserIdentifiers(userDetailArray: IUserIdentifier[], userDetailToExclude: IUserIdentifier): IUserIdentifier[] {
    return userDetailArray.filter(value => JSON.stringify(value) !== JSON.stringify(userDetailToExclude));
}