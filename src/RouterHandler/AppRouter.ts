import {App} from "@slack/bolt";
import ChannelEventHandler from "EventHandlers/ChannelEventHandler";

export default class AppRouter {

    app: App;
    channelEventHandler: ChannelEventHandler;

    constructor(app: App, channelEventHandler: ChannelEventHandler){
        this.app = app;
        this.channelEventHandler = channelEventHandler;
    }

    initializeRoutes(){
        this.app.event("member_joined_channel", async ({ event }) => {
            await this.channelEventHandler.onChannelJoin(event);
        });

        this.app.event("member_left_channel", async ({ event }) => {
            this.channelEventHandler.onChannelLeave(event);
        });
    }

    startServer(){
        this.app.start(80);
        console.log("Sessionize SlackBot running...");
    }
}
