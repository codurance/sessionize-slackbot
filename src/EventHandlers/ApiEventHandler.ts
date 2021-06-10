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

import type {IPreferencesRequest, IMatchNotificationRequest, IGroupDm, InteractiveMessageResponse} from "Typings";
import ChannelId from "../Models/ChannelId";
import LanguageSubmission from "../Models/LanguageSubmission";
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
                console.error(response);
                response.status(500).send();
            }
        } catch (err) {
            console.error("Error sending direct message.");
            console.error(err);
        }
    }

    onMatchNotification = async (request: Request, response: Response): Promise<void> => {
        try {
            const matchDetails: MatchDetails = MatchDetails.fromRequest(request.body as IMatchNotificationRequest);
            const matchNotificationBody: KnownBlock[] = this.matchDetailsToNotification(matchDetails);
            const groupDm: IGroupDm = await this.createGroupDmFromMatchDetails(matchDetails);
            await this.sendNotification(groupDm, matchNotificationBody);
            response.status(201).send();
        } catch (err) {
            console.error(err);
            if(request.body.users){
                request.body.users.forEach(async (user: string) => {
                    await this.slackApiClient.sendDm(user, "A match notification was generated for you, but the delivery failed.");
                });
            }
            response.status(500).send();
        }
    }

    onMatchList = async (request: Request, response: Response): Promise<void> => {
        try {
            const matchListRequest: IMatchNotificationRequest[] = request.body;
            matchListRequest.forEach(async matchNotificationRequest => {

                if(matchNotificationRequest.status !== "UNSUCCESSFUL"){
                    const matchDetails: MatchDetails = MatchDetails.fromRequest(matchNotificationRequest);
                    const matchNotificationBody: KnownBlock[] = this.matchDetailsToNotification(matchDetails);
                    const groupDm: IGroupDm = await this.createGroupDmFromMatchDetails(matchDetails);
                    await this.sendNotification(groupDm, matchNotificationBody);
                }else{
                    const noMatchMessage: string = "We were unable to find a match for you with your current preferences.";
                    this.slackApiClient.sendDm(matchNotificationRequest.users[0], noMatchMessage);
                }

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
            const preferencesRequest: IPreferencesRequest = this.mapRequestToLanguagePreferencesRequest(request);

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

            console.error(err);
            response.status(500).send();
        }
    }

    interactiveMessageResponse = async (req: Request, res: Response): Promise<any> => {

        try {
            const payload: InteractiveMessageResponse = JSON.parse(req.body.payload);
            // Send to method depending on the kind of response
            switch(payload.actions[0].action_id){

                case "confirm_preferences":
                    try {

                        let rawLanguageSubmission;

                        const single = Object.keys(payload.state?.values)[0];
                        const languageKey = Object.keys(payload.state?.values[single])[0];

                        if(payload.state?.values[single][languageKey] &&
                            payload.user.id){

                            const slackId: SlackId = new SlackId(payload.user.id);

                            rawLanguageSubmission =
                                payload.state?.values[single][languageKey]["selected_options"];

                            const languageSubmission: LanguageSubmission =
                                LanguageSubmission.fromResponse(slackId, rawLanguageSubmission);

                            await this.coreApiClient.sendPreferences(languageSubmission);

                            const slackResponse: boolean = await this.slackApiClient.sendDm(slackId.slackId,
                                `Your language preferences have been successfully updated! They are now: ${rawLanguageSubmission[0]["text"]["text"]}, ${rawLanguageSubmission[1]["text"]["text"]}
                                and ${rawLanguageSubmission[2]["text"]["text"]} `);

                            if(slackResponse){
                                res.status(200).send();
                                return;
                            }

                            res.status(500).send();


                        }else{
                            console.error("There was a problem sending the language preferences to the core API");
                        }

                    }catch(error){
                        console.error(error);

                    }
                    break;

                default:
                    throw new Error("Unknown response");
            }
        } catch(error){
            return error;
        }
    }

    async sendNotification(groupDm: IGroupDm, matchNotificationBody: KnownBlock[]) {
        const channelId: ChannelId = new ChannelId(groupDm.channelId);
        const matchNotification: MatchNotification = new MatchNotification(channelId, matchNotificationBody);
        let response: ChatPostMessageResponse = await this.slackApiClient.sendMatchNotification(matchNotification);
        if(!response.ok) throw new Error("Slack failed to create a valid match notification.");
    }

    matchDetailsToNotification(matchDetails: MatchDetails): KnownBlock[] {
        const matchNotificationContent: MatchNotificationContent = new MatchNotificationContent(
            matchDetails.users,
            matchDetails.language);
        const matchNotificationBody: KnownBlock[] = this.messageBuilder.buildMatchNotification(matchNotificationContent);
        return matchNotificationBody;
    }

    createGroupDmFromMatchDetails = async (matchDetails: MatchDetails): Promise<IGroupDm> => {
        try {
            const createdGroupDm: ConversationsOpenResponse = await this.slackApiClient.createGroupDM(matchDetails.users);
            return this.validateGroupDm(createdGroupDm);
        }catch(err){
            if(matchDetails.users){
                matchDetails.users.forEach(async user => {
                    await this.slackApiClient.sendDm(user.slackId, "There was an issue sending out your pairing notification for Sessionize. Sorry!");
                });
            }
            throw new Error("The was an issue contacting the Slack API.");
        }
    }

    mapRequestToLanguagePreferencesRequest(request: Request): IPreferencesRequest {
        if(request.body.slackId || request.body.user_id){
            return {
                slackId: request.body.slackId || request.body.user_id
            } as IPreferencesRequest;
        }
        throw new Error("Request not applicable to a Language Preferences Request");
    }

    validateGroupDm = (groupDmResponse: ConversationsOpenResponse): IGroupDm => {
        if (groupDmResponse.ok && groupDmResponse.channel && groupDmResponse.channel.id) {
            return {
                channelId: groupDmResponse.channel.id
            } as IGroupDm;
        }
        throw new Error("The Slack API failed to create a valid group DM for the pairing.");
    }
}
