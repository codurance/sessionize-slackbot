import * as templates from '../message_templates/templates'

describe("Templates should", () => {
    test("personalize a greeting", () => {
        
        // GIVEN Sessionize is installed
        // WHEN a user joins the Sessionize slack channel
        // THEN they receive a personalized welcome message

        let greeting = templates.greeting("Dave")
        expect(greeting).toContain("Dave")

    })
})
