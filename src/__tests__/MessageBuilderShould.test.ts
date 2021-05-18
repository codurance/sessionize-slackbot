import MessageBuilder from "../MessageBuilder"

describe("MessageBuilder", () => {
    test("should return messages when passed a template and input", () => {

        const name = "Joe Bloggs";
        const messageBuilder = new MessageBuilder();
        const expectedMessage = "Hi Joe Bloggs, welcome to Sessionize!";

        const generatedMessage = messageBuilder.buildGreeting(name);

        expect(generatedMessage).toBe(expectedMessage);
    })
})
