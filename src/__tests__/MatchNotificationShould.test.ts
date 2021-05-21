import DateTime from '../DateTime';
import IUserIdentifier from '../Interfaces/IUserIdentifiers';
import Language from '../Language';
import MatchNotification from '../MatchNotification';
import MatchNotificationContent from '../MatchNotificationContent';
import SlackId from '../SlackId';
import UserName from '../UserName';
describe("MatchNotification", () => {
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

        const returnedArray = MatchNotification.arrayOfOtherElements(originalArray, objectToExclude);

        expect(returnedArray).toStrictEqual(expectedArray);
    });

})