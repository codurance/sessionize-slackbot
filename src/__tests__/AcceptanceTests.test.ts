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
import type {IGroupDm, IMatchNotificationRequest, ISlackUserIdentity} from "../Typings";
import { KnownBlock, MemberJoinedChannelEvent } from "@slack/bolt";
import {Channel} from "@slack/web-api/dist/response/AdminUsergroupsListChannelsResponse";
import {ChatPostMessageResponse, ConversationsOpenResponse} from "@slack/web-api";
import ChannelId from "../Models/ChannelId";
import MatchNotification from "../Models/MatchNotification";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import { Request, Response } from "express";

describe("Slack Service should", () => {

    it.each`
        isNewUser | expectedMessage
        ${true}   | ${"Hi Joe Bloggs, welcome to Sessionize!"}
        ${false}  | ${"Hi Joe Bloggs, welcome back to Sessionize!"}
    `("send a personalised message when a user joins the channel", async ({ isNewUser, expectedMessage }) => {
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

        const groupDm: IGroupDm = {
            channelId: "testChannel"
        };

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
});
