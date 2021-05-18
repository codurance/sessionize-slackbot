import SlackApiClient from '../SlackApiClient';

describe("SlackApiClient", () => {
    test("should get a user's identity", () => {
        const slackApiClient = new SlackApiClient();
        const slackIdentity = slackApiClient.getIdentity("U01V0UBN3NH")
        expect(slackIdentity.email).toBe("cameron.raw@codurance.com");
    })
})