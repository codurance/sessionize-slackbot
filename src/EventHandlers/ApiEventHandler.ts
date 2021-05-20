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

    async onMatchNotification(request: Request, response: Response) {
        throw new Error("Method not implemented.");
    }

    formatISODate(isoDate: string) : string {

        let formattedNumber = (number: number) : number => {
            if(number < 10) return parseInt("0" + number);
            return number;
        }

        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = formattedNumber(date.getMonth() + 1);
        const day = formattedNumber(date.getDate());

        const hour = formattedNumber(date.getHours());
        const minutes = formattedNumber(date.getMinutes());

        return `${day}/${month}/${year} ${hour}:${minutes}`;
    }
}