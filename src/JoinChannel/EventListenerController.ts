import { MemberJoinedChannelEvent } from "@slack/bolt";
import ChannelEventHandler from "./ChannelEventHandler";

export default class EventListenerController {
    channelEventHandler: ChannelEventHandler;

    constructor(channelEventHandler: ChannelEventHandler) {
        this.channelEventHandler = channelEventHandler;
    }

    joinPool(newUserPayload: MemberJoinedChannelEvent) {
        this.channelEventHandler.onChannelJoin(newUserPayload)
    }
}
