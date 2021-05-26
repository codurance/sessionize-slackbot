import CoreApiClient from "../CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../SlackApiClient";
import {Request, Response} from "express";
import {ChatPostMessageResponse, KnownBlock} from "@slack/web-api";
import MatchNotification from "../MatchNotification";
import IMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import MatchNotificationContent from "../MatchNotificationContent";
import MatchDetails from "../MatchDetails";
import {arrayOfAllOtherUserIdentifiers} from "../Utils/ArrayUtils";

export default class ApiEventHandler {

    coreApiClient: CoreApiClient;
    slackApiClient: SlackApiClient;
    messageBuilder: MessageBuilder;

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient;
        this.slackApiClient = slackApiClient;
        this.messageBuilder = messageBuilder;
    }

    async onDirectMessage(request: Request, response: Response) {
        try {
            const slackId: string = request.body.slackId;
            const message: string = request.body.message;

            const slackResponse: ChatPostMessageResponse
                = await this.slackApiClient.sendDm(slackId, message);

            response.send("Success");

        } catch (err) {
            console.error(err);
        }
    }

    async onMatchNotification(request: Request, response: Response) {
        try {

            const matchNotificationRequest: IMatchNotificationRequest = request.body;
            const matchDetails: MatchDetails = MatchDetails.fromRequest(matchNotificationRequest);

            const matchNotifications: MatchNotification[] = [];

            matchDetails.users.forEach(user => {
                const allOtherSlackIds = arrayOfAllOtherUserIdentifiers(matchDetails.users, user);
                const matchNotificationContent: MatchNotificationContent = new MatchNotificationContent(
                    allOtherSlackIds,
                    matchDetails.language,
                    matchDetails.dateTime);
                const matchNotificationBody: KnownBlock[] = this.messageBuilder.buildMatchNotification(matchNotificationContent);
                const matchNotification: MatchNotification = new MatchNotification(user, matchNotificationBody);

                matchNotifications.push(matchNotification);
            });

            const responses: ChatPostMessageResponse[] = await Promise.all(
                matchNotifications.map(match => this.slackApiClient.sendMatchNotification(match))
            );

            console.log(responses);
            return responses;

        } catch (err) {
            response.send("Invalid request");
        }
    }

    /*  async onPreferencesRequest(request: Request, response: Response){

         try {
             const preferencesRequest = await PreferencesRequest.fromRequest(request);
         }catch(err){

         }

     } */

}