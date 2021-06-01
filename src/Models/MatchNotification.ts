import {KnownBlock} from "@slack/web-api";
import {IMatchNotification} from "Typings";
import ChannelId from "./ChannelId";

export default class MatchNotification implements IMatchNotification {

    readonly channelId: ChannelId;
    readonly body: KnownBlock[];

    constructor(channelId: ChannelId, body: KnownBlock[]){
        this.channelId = channelId;
        this.body = body;
    }
}
