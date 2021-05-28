import dotenv from "dotenv";
import { App, ExpressReceiver } from "@slack/bolt";
import MessageBuilder from "./MessageBuilder";
import ChannelEventHandler from "./EventHandlers/ChannelEventHandler";
import CoreApiClient from "./Repos/CoreApiClient";
import SlackApiClient from "./Repos/SlackApiClient";
import ApiEventHandler from "./EventHandlers/ApiEventHandler";
import express from "express";

(async () => {
    dotenv.config();

    const coreApiClient = new CoreApiClient();
    const slackApiClient = new SlackApiClient();
    const messageBuilder = new MessageBuilder();
    
    const channelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);
    const apiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder);
    
    const receiver = new ExpressReceiver({
        signingSecret: process.env.SLACK_SIGNING_SECRET || ""
    });
    
    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        receiver
    });
    
    app.event("member_joined_channel", async ({ event }) => {
        console.log(event);
        await channelEventHandler.onChannelJoin(event);
    });
    
    app.event("member_left_channel", async ({ event }) => {
        console.log(event);
        channelEventHandler.onChannelLeave(event);
    });
    
    app.action("approve_session", async ({ ack, say }) => {
        console.log("A session was approved!");
        await ack();
        await say("Thanks! You have successfully accepted this match!");
    });
    
    receiver.router.use(express.json());
    receiver.router.use(express.urlencoded({ extended: true }));
    
    receiver.router.post("/direct-message", apiEventHandler.onDirectMessage);
    receiver.router.post("/match-notification", apiEventHandler.onMatchNotification);
    receiver.router.post("/language-preferences", apiEventHandler.onLanguagePreferences);
    receiver.router.post("/slack/interactive-endpoint", channelEventHandler.interactiveMessageResponse);

    await app.start(80);
    console.log("Sessionize SlackBot running");

    /*     let conversations : ConversationsListResponse = await slackApiClient.getConversationList();

    let botChannelId : string | undefined;

    conversations.channels?.map((channel : Channel)=> {
        if(channel.is_member){
            botChannelId = channel.id;
        }
    });

    if(botChannelId){
        let members : ConversationsMembersResponse = await slackApiClient.getConversationMembers(botChannelId);
        members.members?.map(async member => {
            let nameFromId = await slackApiClient.getIdentity(member);
            console.log(nameFromId);
        });
    } */

})();
