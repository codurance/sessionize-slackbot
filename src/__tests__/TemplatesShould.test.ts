import * as templates from '../message_templates/templates'

describe("Templates should", () => {
    test("personalize a greeting", () => {

        let greeting = templates.greeting("Dave")
        expect(greeting).toContain("Dave")

    })
})
