import {ExpressReceiver} from "@slack/bolt";
import ApiEventHandler from "EventHandlers/ApiEventHandler";
import express from "express";

export default class ReceiverRouter {
    receiver: ExpressReceiver;
    apiEventHandler: ApiEventHandler;

    constructor(receiver: ExpressReceiver, apiEventHandler: ApiEventHandler){
        this.receiver = receiver;
        this.apiEventHandler = apiEventHandler;

        receiver.router.use(express.json());
        receiver.router.use(express.urlencoded({ extended: true }));
    }

    initializeRoutes(){
        this.receiver.router.get("/health", (req, res) => res.status(200).send("Ok!"));
        this.receiver.router.post("/direct-message", this.apiEventHandler.onDirectMessage);
        this.receiver.router.post("/match-notification", this.apiEventHandler.onMatchNotification);
        this.receiver.router.post("/match-list", this.apiEventHandler.onMatchList);
        this.receiver.router.post("/language-preferences", this.apiEventHandler.onLanguagePreferences);
        this.receiver.router.post("/slack/interactive-endpoint", this.apiEventHandler.interactiveMessageResponse);
    }
}
