import DateTime from "../DateTime";
import IUserIdentifier from "../Interfaces/IUserIdentifiers";
import MatchNotification from "../MatchNotification";
import SlackId from "../SlackId";
import UserName from "../UserName";
import { arrayOfAllOtherUserIdentifiers } from "../Utils/ArrayUtils";
import { formatISODate } from "../Utils/Formatters";

describe("Utils", () => {
    test("should convert ISO 8601 dates to user friendly strings", () => {

        const isoDate = new DateTime("2021-05-20T14:35:00.000Z");
        const expectedDate = "20/05/2021 14:35";

        const returnedDate = formatISODate(isoDate);
        expect(returnedDate).toBe(expectedDate);
    });

    test("should take an array and a value, return the same array but without passed value", () => {

        const originalArray: IUserIdentifier[] = [
            {
                slackId: new SlackId("slack1"),
                name: new UserName("Name 1")
            },
            {
                slackId: new SlackId("slack2"),
                name: new UserName("Name 2")
            },
            {
                slackId: new SlackId("slack3"),
                name: new UserName("Name 3")
            },
        ];

        const objectToExclude : IUserIdentifier = {
            slackId: new SlackId("slack2"),
            name: new UserName("Name 2")
        };

        const expectedArray : IUserIdentifier[] = [
            {
                slackId: new SlackId("slack1"),
                name: new UserName("Name 1")
            },
            {
                slackId: new SlackId("slack3"),
                name: new UserName("Name 3")
            },
        ];

        const returnedArray = arrayOfAllOtherUserIdentifiers(originalArray, objectToExclude);

        expect(returnedArray).toStrictEqual(expectedArray);
    });
});