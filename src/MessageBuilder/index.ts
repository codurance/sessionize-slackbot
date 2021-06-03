import { ActionsBlock, Button, InputBlock, KnownBlock, MultiStaticSelect, Option, SectionBlock } from "@slack/web-api";
import Language from "../Models/Language";
import MatchNotificationContent from "../Models/MatchNotificationContent";
import * as templates from "../MessageTemplates/Templates";
import {slackIdsToLinkedNames} from "../Utils/ArraysUtils";

export default class MessageBuilder {

    buildMatchNotification(matchNotificationContent: MatchNotificationContent): KnownBlock[] {

        const matchNames = slackIdsToLinkedNames(matchNotificationContent.matchIds);

        const headerSection: SectionBlock = {
            type: "section",
            text: {
                type: "mrkdwn",
                text: `You have a new match:\n ${matchNames}`
            }
        };

        const matchDetailsSection: SectionBlock = {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: `*Language:*\n${matchNotificationContent.language.displayName}`
                }
            ]
        };

        return [
            headerSection,
            matchDetailsSection,
        ];
    }

    buildPreferencesForm(languages: Language[]): KnownBlock[] {

        const optionsArray: Option[] = languages.map(language => {
            return {
                text: {
                    type: "plain_text",
                    text: language.displayName,
                    emoji: true
                },
                value: language.value
            };
        });

        const headerSection: SectionBlock = {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "Please select your preferences."
            }
        };

        const multiSelect: MultiStaticSelect = {
            type: "multi_static_select",
            placeholder: {
                type: "plain_text",
                text: "Select a language",
                emoji: true
            },
            option_groups: [
                {
                    label: {
                        type: "plain_text",
                        text: "Languages",
                    },
                    options: optionsArray
                },
            ],
            max_selected_items: 3
        };

        const languageSelectors: InputBlock = {
            type: "input",
            element: multiSelect,
            label: {
                type: "plain_text",
                text: "Languages",
                emoji: true
            }
        };

        const actions: ActionsBlock = {
            type: "actions",
            elements: [
                {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Confirm",
                        emoji: true
                    },
                    action_id: "confirm_preferences",
                    style: "primary",
                    value: "preferences_confirmed"
                } as Button
            ]
        };

        return [
            headerSection,
            languageSelectors,
            actions
        ];
    }

    buildGreeting(name: string): string {
        return templates.greeting(name);
    }

    buildWelcomeBack(name: string): string {
        return templates.welcomeBack(name);
    }

    buildFarewell(name: string): string {
        return templates.farewell(name);
    }

    errorOccurred(name: string): string {
        return templates.error(name);
    }
}
