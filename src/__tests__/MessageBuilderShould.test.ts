import MessageBuilder from "../MessageBuilder"

describe("MessageBuilder", () => {
    test("should return a simple markdown message", () => {

        const name = "Joe Bloggs";
        const messageBuilder = new MessageBuilder();
        const expectedMessage = "Hi Joe Bloggs, welcome to Sessionize!";

        const generatedMessage = messageBuilder.buildGreeting(name);
        expect(generatedMessage).toBe(expectedMessage);
    });
});
