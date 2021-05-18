import dotenv from 'dotenv';
import { App } from '@slack/bolt';

dotenv.config()

console.log(process.env.SLACK_BOT_TOKEN);
console.log(process.env.SLACK_SIGNING_SECRET);

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('member_joined_channel', async ({ event, client }) => {
    try {
      // Call chat.postMessage with the built-in client
      console.log(event);
    }
    catch (error) {
      console.error(error);
    }
  });

(async () => {
    await app.start(80);
    console.log("Bolt running");
})();