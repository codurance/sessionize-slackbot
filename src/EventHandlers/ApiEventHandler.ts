import CoreApiClient from "../Repos/CoreApiClient";
import MessageBuilder from "../MessageBuilder";
import SlackApiClient from "../Repos/SlackApiClient";
import {Request, Response} from "express";
import {ChatPostMessageResponse, ConversationsOpenResponse, KnownBlock} from "@slack/web-api";
import MatchNotification from "../Models/MatchNotification";
import MatchNotificationContent from "../Models/MatchNotificationContent";
import MatchDetails from "../Models/MatchDetails";
import SlackId from "../Models/SlackId";
import PreferencesForm from "../Models/PreferencesForm";
import Language from "../Models/Language";

import type {IPreferencesRequest, IMatchNotificationRequest, IGroupDm} from "Typings";
import ChannelId from "../Models/ChannelId";
export default class ApiEventHandler {

    coreApiClient: CoreApiClient;
    slackApiClient: SlackApiClient;
    messageBuilder: MessageBuilder;

    constructor(coreApiClient: CoreApiClient, slackApiClient: SlackApiClient, messageBuilder: MessageBuilder) {
        this.coreApiClient = coreApiClient;
        this.slackApiClient = slackApiClient;
        this.messageBuilder = messageBuilder;
    }

    onDirectMessage = async (request: Request, response: Response): Promise<void> => {
        try {
            const slackId: string = request.body.slackId;
            const message: string = request.body.message;
            const slackResponse: boolean = await this.slackApiClient.sendDm(slackId, message);
            if(slackResponse){
                response.status(200).send();
                return;
            }else{
                console.error("Slack API failed to send a valid direct message.")
                console.log(response);
                response.status(500).send();
            }
        } catch (err) {
            console.log("Error sending direct message.");
            console.error(err);
        }
    }

    onMatchNotification = async (request: Request, response: Response): Promise<void> => {
        try {
            const matchDetails: MatchDetails = MatchDetails.fromRequest(request.body as IMatchNotificationRequest);
            await this.createNotificationFromMatchDetails(matchDetails);
            response.status(201).send();
        } catch (err) {
            console.error(err);
            response.status(500).send();
        }
    }

    onMatchList = async (request: Request, response: Response): Promise<void> => {
        try {
            const matchListRequest: IMatchNotificationRequest[] = request.body;
            matchListRequest.forEach(async matchNotificationRequest => {
                const matchDetails: MatchDetails = MatchDetails.fromRequest(matchNotificationRequest);
                await this.createNotificationFromMatchDetails(matchDetails);
            });
            response.status(204).send();

        }catch(err){
            console.error("There was an issue processing the list of pairings.");
            console.error(err);
            response.status(500).send();
        }
    }

    onLanguagePreferences = async (request: Request, response: Response): Promise<void> => {
        try {
            const latestLanguages: Language[] = await this.coreApiClient.getLanguageList();

            const preferencesRequest: IPreferencesRequest = request.body;
            const preferencesMessage: KnownBlock[] = this.messageBuilder.buildPreferencesForm(latestLanguages);

            const slackId = new SlackId(preferencesRequest.slackId);
            const preferencesForm: PreferencesForm = new PreferencesForm(slackId, preferencesMessage);

            const slackResponse: ChatPostMessageResponse = await this.slackApiClient.sendPreferencesForm(preferencesForm);

            if(slackResponse.ok){
                response.status(200).send();
            }else{
                response.status(500).send();
            }

        } catch(err){

            // TODO: Error messages back to users

            console.error(err);
            response.status(500).send();
        }
    }

    private async createNotificationFromMatchDetails(matchDetails: MatchDetails) {
        try {
            const matchNotificationBody: KnownBlock[] = this.matchDetailsToNotification(matchDetails);

            const groupDm: IGroupDm = await this.createGroupDmFromMatchDetails(matchDetails);

            await this.sendNotification(groupDm, matchNotificationBody);
        }catch(err){
            console.error("Error creating notification from match details for the below:");
            console.table(matchDetails);
        }
    }

    private async sendNotification(groupDm: IGroupDm, matchNotificationBody: KnownBlock[]) {
        console.log("Send notification");
        const channelId: ChannelId = new ChannelId(groupDm.channelId);
        const matchNotification: MatchNotification = new MatchNotification(channelId, matchNotificationBody);
        console.log(JSON.stringify(matchNotification));
        let response: ChatPostMessageResponse = await this.slackApiClient.sendMatchNotification(matchNotification);
        console.log(response);
        if(!response.ok) throw new Error("Slack failed to create a valid match notification.");
    }

    private matchDetailsToNotification(matchDetails: MatchDetails): KnownBlock[] {
        const matchNotificationContent: MatchNotificationContent = new MatchNotificationContent(
            matchDetails.users,
            matchDetails.language);
        const matchNotificationBody: KnownBlock[] = this.messageBuilder.buildMatchNotification(matchNotificationContent);
        return matchNotificationBody;
    }

    private createGroupDmFromMatchDetails = async (matchDetails: MatchDetails): Promise<IGroupDm> => {
        try {
            const createdGroupDm: ConversationsOpenResponse = await this.slackApiClient.createGroupDM(matchDetails.users);
            return this.validateGroupDm(createdGroupDm);
        }catch(err){
            throw new Error("There was an error in contacting the Slack API.");
        }
    }

    private validateGroupDm = (groupDmResponse: ConversationsOpenResponse): IGroupDm => {
        if (groupDmResponse.ok && groupDmResponse.channel && groupDmResponse.channel.id) {
            return {
                channelId: groupDmResponse.channel.id
            } as IGroupDm;
        }
        throw new Error("The Slack API failed to create a valid group DM for the pairing.");
    }
}
