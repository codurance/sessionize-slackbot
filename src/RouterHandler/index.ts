import dotenv from "dotenv";
import {App, ExpressReceiver} from "@slack/bolt";
import ApiEventHandler from "../EventHandlers/ApiEventHandler";
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler";
import MessageBuilder from "../MessageBuilder";
import CoreApiClient from "../Repos/CoreApiClient";
import SlackApiClient from "../Repos/SlackApiClient";
import AppRouter from "./AppRouter";
import ReceiverRouter from "./ReceiverRouter";

export default function initRouters(){

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

    const appRouter: AppRouter = new AppRouter(app, channelEventHandler);
    const receiverRouter: ReceiverRouter  = new ReceiverRouter(receiver, apiEventHandler);

    appRouter.initializeRoutes();
    receiverRouter.initializeRoutes();

    appRouter.startServer();

}
