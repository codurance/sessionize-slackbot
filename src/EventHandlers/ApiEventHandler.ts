import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../Repos/SlackApiClient";
import {Request} from "express";
import {ChatPostMessageResponse, KnownBlock} from "@slack/web-api";
import MatchNotification from "../Models/MatchNotification";
import MatchNotificationContent from "../Models/MatchNotificationContent";
import MatchDetails from "../Models/MatchDetails";
import {deepFilterFor} from "../Utils/ArraysUtils";
import SlackId from "../Models/SlackId";
import PreferencesForm from "../Models/PreferencesForm";
import Language from "../Models/Language";

import type {IPreferencesRequest, IMatchNotificationRequest} from "Typings";
export default class ApiEventHandler {

    coreApiClient: CoreApiClient;
    slackApiClient: SlackApiClient;
    messageBuilder: MessageBuilder;

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient;
        this.slackApiClient = slackApiClient;
        this.messageBuilder = messageBuilder;
    }

    async onDirectMessage(request: Request): Promise<ChatPostMessageResponse> {
        try {
            const slackId: string = request.body.slackId;
            const message: string = request.body.message;
            return await this.slackApiClient.sendDm(slackId, message);
        } catch (err) {
            return err;
        }
    }

    async onMatchNotification(request: Request): Promise<ChatPostMessageResponse> {
        try {

            const matchNotificationRequest: IMatchNotificationRequest = request.body;
            const matchDetails: MatchDetails = MatchDetails.fromRequest(matchNotificationRequest);

            const matchNotificationContent: MatchNotificationContent = new MatchNotificationContent(
                matchDetails.users,
                matchDetails.language,
                matchDetails.dateTime);
            const matchNotificationBody: KnownBlock[] = this.messageBuilder.buildMatchNotification(matchNotificationContent);

            // TODO: Create multiple DM message
            // const matchNotification: MatchNotification = new MatchNotification(user, matchNotificationBody);
            //

            const matchNotification: MatchNotification = new MatchNotification();
            this.slackApiClient.sendMatchNotification(matchNotification);

        } catch (err) {
            return err;
        }
    }

    onLanguagePreferences = async (request: Request): Promise<ChatPostMessageResponse> => {

        console.log(this);

        try {
            const latestLanguages: Language[] = await this.coreApiClient.getLanguageList();

            const preferencesRequest: IPreferencesRequest = request.body;
            const preferencesMessage: KnownBlock[] = this.messageBuilder.buildPreferencesForm(latestLanguages);

            const slackId = new SlackId(preferencesRequest.slackId);
            const preferencesForm: PreferencesForm = new PreferencesForm(slackId, preferencesMessage);

            return this.slackApiClient.sendPreferencesForm(preferencesForm);
        } catch(err){
            console.error(err);
            throw new Error(err);
        }
    }
}
