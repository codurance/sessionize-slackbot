import * as templates from '../MessageTemplates/Templates'

describe("Templates should", () => {
    test("personalize a greeting", () => {

        const greeting = templates.greeting("Dave");
        expect(greeting).toContain("Dave");

        const welcomeBack = templates.welcomeBack("Ruby");
        expect(welcomeBack).toContain("Ruby");
    });
});
