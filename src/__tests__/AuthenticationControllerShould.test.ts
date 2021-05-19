import Auth from '../middleware/AuthenticationController';
describe("AuthenticationController", () => {
    test("should get a Bearer token from a request", () => {
        const sendAuth = "Bearer OUR_TOKEN";
        const ourToken = "OUR_TOKEN";

        const auth = new Auth();

        const parsedToken = auth.parseToken(sendAuth);
        expect(parsedToken).toBe(ourToken);
    });

    test("should throw error if tokens do not match", () => {
        const sentToken = "NOT_OUR_TOKEN";
        const ourToken = "OUR_TOKEN";
        
        const auth = new Auth();

        expect(() => {
            auth.compareTokens(ourToken, sentToken)
        }).toThrow("Invalid token");
    })
});