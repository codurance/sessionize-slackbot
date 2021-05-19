import dotenv from 'dotenv';
import { App, ExpressReceiver } from '@slack/bolt';
import MessageBuilder from './MessageBuilder';
import ChannelEventHandler from './EventHandlers/ChannelEventHandler';
import CoreApiClient from './CoreApiClient';
import SlackApiClient from './SlackApiClient';

dotenv.config()

const messageBuilder = new MessageBuilder();
const channelEventHandler = new ChannelEventHandler(new CoreApiClient(), new SlackApiClient(), messageBuilder);

const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET!
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver
});

app.event('member_joined_channel', async ({ event }) => {
    channelEventHandler.onChannelJoin(event);
});

receiver.router.get('/example', (req, res) => {
  res.send("Hello World!");
});

(async () => {
    await app.start(80);
    console.log("Sessionize SlackBot running");
})();