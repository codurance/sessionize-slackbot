import {
    anyOfClass,
    anyString,
    anything,
    instance,
    mock,
    verify,
    when,
} from "ts-mockito"

import CoreApiClient from '../CoreApiClient';
import SlackApiClient from '../SlackApiClient';
import MessageBuilder from '../MessageBuilder';
import ChannelEventHandler from '../JoinChannel/ChannelEventHandler';
import EventListenerController from '../JoinChannel/EventListenerController';
import JoinChannelEvent from '../JoinChannel/JoinChannelEvent';
import SlackIdentity from "../SlackIdentity";
import SlackTeamIdentity from "../SlackTeamIdentity";
import SlackUserIdentity from "../SlackUserIdentity";
import { MemberJoinedChannelEvent } from "@slack/bolt";

describe("Slack Service should", () => {

    it.each`
        isNewUser | expectedMessage
        ${true}   | ${'Hi Joe Bloggs, welcome to Sessionize!'} 
        ${false}  | ${'Hi Joe Bloggs, welcome back to Sessionize!'}
    `("send a personalised message when a user joins the channel", ({ isNewUser, expectedMessage }) => {
        // GIVEN Sessionize is installed
        // WHEN a user joins the Sessionize slack channel
        // THEN they receive a personalized welcome message

        // Arrange
        const slackIdentity: SlackUserIdentity = {
            name: "Joe Bloggs",
            id: "U0G9QF9C6",
            email: "joe.bloggs@codurance.com"
        };

        const event: MemberJoinedChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

    });
});
