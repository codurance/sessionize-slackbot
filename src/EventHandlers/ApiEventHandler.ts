import CoreApiClient from "../CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../SlackApiClient";
import {Request, Response} from "express";
import {KnownBlock} from "@slack/web-api";
import MatchNotification from "../MatchNotification";
import IMatchNotificationRequest from "../Interfaces/IMatchNotificationRequest";
import MatchNotificationContent from "../MatchNotificationContent";
import MatchDetails from "../MatchDetails";
import {deepFilterFor} from "../Utils/ArraysUtils";
import SlackId from "../SlackId";
import IPreferencesRequest from "../Interfaces/IPreferencesRequest";
import PreferencesForm from "../PreferencesForm";

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
            await this.slackApiClient.sendDm(slackId, message);

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
                const allOtherSlackIds = deepFilterFor<SlackId>(user, matchDetails.users);
                const matchNotificationContent: MatchNotificationContent = new MatchNotificationContent(
                    allOtherSlackIds,
                    matchDetails.language,
                    matchDetails.dateTime);
                const matchNotificationBody: KnownBlock[] = this.messageBuilder.buildMatchNotification(matchNotificationContent);
                const matchNotification: MatchNotification = new MatchNotification(user, matchNotificationBody);

                matchNotifications.push(matchNotification);
            });

            return await Promise.all(
                matchNotifications.map(match => this.slackApiClient.sendMatchNotification(match))
            );

        } catch (err) {
            response.send("Invalid request");
        }
    }

    async onLanguagePreferences(request: Request, response: Response){
        try {
            const preferencesRequest: IPreferencesRequest = request.body;
            const preferencesMessage : KnownBlock[] = this.messageBuilder.buildPreferencesForm(preferencesRequest.languages);
            const slackId = new SlackId(preferencesRequest.slackId);
            const preferencesForm : PreferencesForm = new PreferencesForm(slackId, preferencesMessage);
            let response = this.slackApiClient.sendPreferencesForm(preferencesForm);
        }catch(err){
            console.log(err);
        }
    }

}
