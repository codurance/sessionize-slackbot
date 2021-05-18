import * as templates from './message_templates/templates';

export default class MessageBuilder {
    buildGreeting(name: string) : string {
        return templates.greeting(name);
    }

    buildWelcomeBack(name: string) : string {
        return templates.welcomeBack(name);
    }
}
