import SlackId from "../Models/SlackId";

export function deepFilterFor<T>(itemToExclude: T, array: T[]): T[] {
    return array.filter(value => JSON.stringify(value) !== JSON.stringify(itemToExclude));
}

export function slackIdsToLinkedNames(matchNames: SlackId[]): string {
    let matchNameString = "";
    matchNames.forEach(id => matchNameString += `<@${id.slackId}> `);
    return matchNameString.trimEnd();
}

export function slackIdsToString(matchNames: SlackId[]): string {
    let matchNameString = "";
    matchNames.forEach(id => matchNameString += `${id.slackId} `);
    matchNameString.trimEnd();
    return matchNameString.replace(" ", ",");
}
