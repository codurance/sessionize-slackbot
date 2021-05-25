import CoreApiClient from "../CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../SlackApiClient";
import { Request, Response } from "express";
import { ChatPostMessageResponse, KnownBlock } from "@slack/web-api";
import MatchNotification from "../MatchNotification";
import IMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import MatchNotificationContent from "../MatchNotificationContent";
import MatchDetails from "../MatchDetails";
import UserName from "../UserName";
import { arrayOfAllOtherUserIdentifiers } from "../Utils/ArrayUtils";
import UserIdentifier from "../UserIdentifier";
import SlackId from "../SlackId";

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

    async onMatchNotification(request: Request, response: Response){
        try {

            // Create MatchNotificationContent objects from request
            // Create MatchNotification objects from the above + users' slackIds

            const matchNotificationRequest : IMatchNotificationRequest = request.body;
            const matchDetails : MatchDetails = MatchDetails.fromRequest(matchNotificationRequest);

            let matchNotifications : MatchNotification[] = [];

            let responses : ChatPostMessageResponse[] = [];

            matchDetails.users.map(user => {

                let allOtherUsers : UserIdentifier[] = arrayOfAllOtherUserIdentifiers(matchDetails.users, user);

                let allOtherSlackIds : SlackId[] = [];

                allOtherUsers.map(user => {
                    allOtherSlackIds.push(user.slackId);
                });

                let matchNotificationContent : MatchNotificationContent = new MatchNotificationContent(allOtherSlackIds, matchDetails.language, matchDetails.dateTime);

                let matchNotificationBody : KnownBlock[] = this.messageBuilder.buildMatchNotification(matchNotificationContent);

                let matchNotification : MatchNotification = new MatchNotification(user.slackId, matchNotificationBody);

                matchNotifications.push(matchNotification);
            });

            matchNotifications.map(async matchNotification => {
                let response = await this.slackApiClient.sendMatchNotification(matchNotification);
                responses.push(response);
            });

            return responses;


        }catch (err) {

            response.send("Invalid request");

        }
    }

}