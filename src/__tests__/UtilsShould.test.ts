import DateTime from "../DateTime";
import { formatISODate } from "../Utils/Formatters";

describe("Utils", () => {
    test("should convert ISO 8601 dates to user friendly strings", () => {

        const isoDate = new DateTime("2021-05-20T14:35:00.000Z");
        const expectedDate = "20/05/2021 14:35";

        const returnedDate = formatISODate(isoDate);
        expect(returnedDate).toBe(expectedDate);
    });
});