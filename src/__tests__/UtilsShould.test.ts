import DateTime from "../Models/DateTime";
import {formatISODate} from "../Utils/Formatters";
import SlackId from "../Models/SlackId";
import {deepFilterFor} from "../Utils/ArraysUtils";

describe("Utils", () => {
    test("should convert ISO 8601 dates to user friendly strings", () => {

        const isoDate = new DateTime("2021-05-20T14:35:00.000Z");
        const expectedDate = "20/05/2021 14:35";

        const returnedDate = formatISODate(isoDate);
        expect(returnedDate).toBe(expectedDate);
    });

    test("should take an array and a value, return the same array but without passed value", () => {

        const originalArray: SlackId[] = [
            new SlackId("slack1"),
            new SlackId("slack2"),
            new SlackId("slack3")
        ];

        const objectToExclude: SlackId = new SlackId("slack2");

        const expectedArray: SlackId[] = [
            new SlackId("slack1"),
            new SlackId("slack3")
        ];

        const returnedArray = deepFilterFor<SlackId>(objectToExclude, originalArray);

        expect(returnedArray).toStrictEqual(expectedArray);
    });

});