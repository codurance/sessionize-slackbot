import MessageBuilder from "../MessageBuilder";

describe("MessageBuilder", () => {

    let messageBuilder: MessageBuilder;

    beforeEach(() => {
        messageBuilder = new MessageBuilder();
    });

    test("should return a simple markdown message", () => {

        const name = "Joe Bloggs";
        const expectedMessage = "Hi Joe Bloggs, welcome to Sessionize!";

        const generatedMessage = messageBuilder.buildGreeting(name);
        expect(generatedMessage).toBe(expectedMessage);
    });

});
