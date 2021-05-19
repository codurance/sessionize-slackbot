import Auth from '../middleware/AuthenticationController';
describe("AuthenticationController", () => {
    test("should get a Bearer token from a request", () => {
        const sendAuth = "Bearer OUR_TOKEN";
        const ourToken = "OUR_TOKEN";

        const auth = new Auth();

        const parsedToken = auth.parseToken(sendAuth);
        expect(parsedToken).toBe(ourToken);
    });
});