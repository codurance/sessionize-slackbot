import {
    anyString,
    anything,
    deepEqual,
    instance,
    mock,
    verify,
    when,
} from "ts-mockito";

import CoreApiClient from "../Repos/CoreApiClient";
import SlackApiClient from "../Repos/SlackApiClient";
import MessageBuilder from "../MessageBuilder";
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler";
import type {IGroupDm, IMatchNotificationRequest, InteractiveMessageResponse, IPreferencesRequest, ISlackUserIdentity} from "../Typings";
import { KnownBlock, MemberJoinedChannelEvent } from "@slack/bolt";
import {Channel} from "@slack/web-api/dist/response/AdminUsergroupsListChannelsResponse";
import {Button, ChatPostMessageResponse, ConversationsOpenResponse} from "@slack/web-api";
import ChannelId from "../Models/ChannelId";
import MatchNotification from "../Models/MatchNotification";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import { Request, Response } from "express";
import PreferencesForm from "../Models/PreferencesForm";
import SlackId from "../Models/SlackId";
import LanguageSubmission from "../Models/LanguageSubmission";
import Language from "../Models/Language";

describe("Slack Service", () => {

    it.each`
        isNewUser | expectedMessage | userAction
        ${true}   | ${"Hi Joe Bloggs, welcome to Sessionize!"} | ${"joins"}
        ${false}  | ${"Hi Joe Bloggs, welcome back to Sessionize!"} | ${"rejoins"}
    `("should send a personalised message when a user $userAction the channel", async ({ isNewUser, expectedMessage }) => {
        // GIVEN Sessionize is installed
        // WHEN a user joins the Sessionize slack channel
        // THEN they receive a personalized welcome message

        const event: MemberJoinedChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const slackIdentity: ISlackUserIdentity = {
            firstName: "Joe",
            lastName: "Bloggs",
            slackId: "U0G9QF9C6",
            email: "joe.bloggs@codurance.com"
        };

        const mockedCoreApiClient = mock(CoreApiClient);
        when(mockedCoreApiClient.isNewUser(anything())).thenReturn(isNewUser);

        const mockedSlackApiClient = mock(SlackApiClient);
        when(mockedSlackApiClient.getIdentity(anyString())).thenResolve(slackIdentity);

        const channelEventHandler = new ChannelEventHandler(
            instance(mockedCoreApiClient),
            instance(mockedSlackApiClient),
            new MessageBuilder());

        await channelEventHandler.onChannelJoin(event);

        verify(mockedSlackApiClient.sendDm(event.user, expectedMessage)).called();
    });

    test("should trigger a match notification upon receiving a request", async () => {

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);

        const messageBuilder: MessageBuilder = new MessageBuilder();

        const apiEventHandler: ApiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);

        const testRequest: Partial<Request> = {
            body: {
                users: [
                    "SlackId1",
                    "SlackId2"
                ],
                language: {
                    value: "JAVA",
                    displayName: "Java"
                }
            } as IMatchNotificationRequest
        };

        const testResponse: Partial<Response> = {
            send: jest.fn(),
            status: function(code){ this.statusCode = code; return this as Response }
        }

        const matchNotificationBody: KnownBlock[] = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "You have a new match:\n <@SlackId1> <@SlackId2>"
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: "*Language:*\nJava"
                    }
                ]
            }
        ];

        when(mockedSlackApiClient.createGroupDM(anything())).thenResolve({
            ok: true,
            channel: {
                id: "testChannel"
            } as Channel
        } as ConversationsOpenResponse);

        when(mockedSlackApiClient.sendMatchNotification(anything())).thenResolve({
            ok: true
        } as ChatPostMessageResponse);

        const channelId: ChannelId = new ChannelId("testChannel");

        const matchNotification: MatchNotification = new MatchNotification(channelId, matchNotificationBody);

        await apiEventHandler.onMatchNotification(testRequest as Request, testResponse as Response);

        verify(mockedSlackApiClient.sendMatchNotification(anything())).once();
        verify(mockedSlackApiClient.sendMatchNotification(deepEqual(matchNotification))).once();
    });

    test("should send a preferences form with a choice of languages stored on our database", async () => {

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        const messageBuilder: MessageBuilder = new MessageBuilder();

        const apiEventHandler: ApiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);

        const testRequest: Partial<Request> = {
            body: {
                slackId: "SlackId1"
            }
        };

        const testResponse: Partial<Response> = {
            send: jest.fn(),
            status: function(code){ this.statusCode = code; return this as Response }
        };

        when(mockedCoreApiClient.getLanguageList()).thenResolve([
            {
                value: "JAVA",
                displayName: "Java"
            },
            {
                value: "PYTHON",
                displayName: "Python"
            },
            {
                value: "TYPESCRIPT",
                displayName: "TypeScript"
            }
        ]);

        when(mockedSlackApiClient.sendPreferencesForm(anything())).thenResolve({
            ok: true
        });

        const formBody: KnownBlock[] = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "Please select your preferences."
                }
            },
            {
                type: "input",
                element: {
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
                            options: [
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Java",
                                        emoji: true
                                    },
                                    value: "JAVA"
                                },
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "Python",
                                        emoji: true
                                    },
                                    value: "PYTHON"
                                },
                                {
                                    text: {
                                        type: "plain_text",
                                        text: "TypeScript",
                                        emoji: true
                                    },
                                    value: "TYPESCRIPT"
                                }
                            ]
                        },
                    ],
                    max_selected_items: 3
                },
                label: {
                    type: "plain_text",
                    text: "Languages",
                    emoji: true
                }
            },
            {
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
            }
        ];

        const expectedPreferencesForm: PreferencesForm = new PreferencesForm(new SlackId("SlackId1"), formBody);

        await apiEventHandler.onLanguagePreferences(testRequest as Request, testResponse as Response);

        verify(mockedSlackApiClient.sendPreferencesForm(anything())).once();
        verify(mockedSlackApiClient.sendPreferencesForm(deepEqual(expectedPreferencesForm))).once();
    });

    test("should update the core / database with user language preferences", async () => {

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        const coreApiClient: CoreApiClient = instance(mockedCoreApiClient);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        const slackApiClient: SlackApiClient = instance(mockedSlackApiClient);

        const messageBuilder: MessageBuilder = new MessageBuilder();

        const apiEventHandler: ApiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);

        const slackId: SlackId = new SlackId("SlackId1");

        const languages: Language[] = [
            new Language("JAVA", "Java"),
            new Language("TYPESCRIPT", "TypeScript"),
            new Language("PYTHON", "Python"),
        ];

        const expectedLanguageSubmission: LanguageSubmission = new LanguageSubmission(slackId, languages);

        const interactiveMessageResponse: Partial<InteractiveMessageResponse> = {
            user: {
                id: "SlackId1",
                name: anyString(),
                team_id: anyString()
            },
            state: {
                values: {
                    random1: {
                        random2: {
                            selected_options : [
                                {
                                    value: "JAVA",
                                    displayName: "Java"
                                },
                                {
                                    value: "TYPESCRIPT",
                                    displayName: "TypeScript"
                                },
                                {
                                    value: "PYTHON",
                                    displayName: "Python"
                                },
                            ]
                        }
                    }
                }
            },
            actions: [
                {
                    action_id: "confirm_preferences"
                }
            ]
        };

        const payload: string = JSON.stringify(interactiveMessageResponse as InteractiveMessageResponse);

        const testRequest: Partial<Request> = {
            body: {
                payload: payload
            }
        };

        const testResponse: Partial<Response> = {
            send: jest.fn(),
            status: function(code){ this.statusCode = code; return this as Response }
        }

        await apiEventHandler.interactiveMessageResponse(testRequest as Request, testResponse as Response);

        verify(mockedCoreApiClient.sendPreferences(anything())).once();
        verify(mockedCoreApiClient.sendPreferences(deepEqual(expectedLanguageSubmission))).once();
    });
});
