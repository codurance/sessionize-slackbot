import dotenv from 'dotenv';
import { App } from '@slack/bolt';
import MessageBuilder from './MessageBuilder';
import ChannelEventHandler from './JoinChannel/ChannelEventHandler';
import CoreApiClient from './CoreApiClient';
import SlackApiClient from './SlackApiClient';

dotenv.config()

const messageBuilder = new MessageBuilder();
const channelEventHandler = new ChannelEventHandler(new CoreApiClient(), new SlackApiClient(), messageBuilder);

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('member_joined_channel', async ({ event, client }) => {
    try {
      // Call chat.postMessage with the built-in client
      let message = await channelEventHandler.onChannelJoin(event);
      const responseResult = await client.chat.postMessage({
          channel: event.user,
          text: message
      });
    }
    catch (error) {
      console.error(error);
    }
  });

(async () => {
    await app.start(80);
    console.log("Sessionize SlackBot running");
})();