import dotenv from 'dotenv';
import { App, ExpressReceiver } from '@slack/bolt';
import MessageBuilder from './MessageBuilder';
import ChannelEventHandler from './EventHandlers/ChannelEventHandler';
import CoreApiClient from './CoreApiClient';
import SlackApiClient from './SlackApiClient';
import ApiEventHandler from './EventHandlers/ApiEventHandler';
import express from 'express';

dotenv.config()

const coreApiClient = new CoreApiClient();
const slackApiClient = new SlackApiClient();
const messageBuilder = new MessageBuilder();

const channelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, messageBuilder);
const apiEventHandler = new ApiEventHandler(coreApiClient, slackApiClient, messageBuilder)

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET!
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver
});

app.event('member_joined_channel', async ({ event }) => {
    console.log(event);
    await channelEventHandler.onChannelJoin(event);
});

receiver.router.use(express.json());

receiver.router.post('/direct-message', (req, res) => {
  apiEventHandler.onDirectMessage(req, res);
});

(async () => {
    await app.start(80);
    console.log("Sessionize SlackBot running");
})();