import MessageBuilder from "../MessageBuilder"

describe("MessageBuilder", () => {
    test("should return messages when passed a template and input", () => {

        const expectedMessage = "Hi Sonny Whether, welcome to Sessionize!"
        const name = "Sonny Whether"

        let messageBuilder = new MessageBuilder()
        const generatedMessage = messageBuilder.buildGreeting(name)

        expect(generatedMessage).toBe(expectedMessage)
    })
})
