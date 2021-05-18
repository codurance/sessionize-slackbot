import ChannelEventHandler from "./ChannelEventHandler";
import JoinChannelEvent from "./JoinChannelEvent";

export default class EventListenerController {
    channelEventHandler: ChannelEventHandler;

    constructor(channelEventHandler: ChannelEventHandler) {
        this.channelEventHandler = channelEventHandler;
    }

    joinPool(newUserPayload: JoinChannelEvent) {
        this.channelEventHandler.onChannelJoin(newUserPayload)
    }
}
