import CoreApiClient from "../CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../SlackApiClient";
import { Request, Response } from "express";
import { ChatPostMessageResponse, KnownBlock } from "@slack/web-api";

export default class ApiEventHandler {

    coreApiClient: CoreApiClient;
    slackApiClient: SlackApiClient;
    messageBuilder: MessageBuilder;

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder){
        this.coreApiClient = coreApiClient;
        this.slackApiClient = slackApiClient;
        this.messageBuilder = messageBuilder;
    }

    async onDirectMessage(request: Request, response: Response){
        try {
            const slackId : string = request.body.slackId;
            const message : string = request.body.message;

            let slackResponse : ChatPostMessageResponse
                = await this.slackApiClient.sendDm(slackId, message);

            response.send("Success");
            
        }catch(err){
            console.error(err);
        }
    }

}