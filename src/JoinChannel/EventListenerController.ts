import ChannelEventHandler from "./ChannelEventHandler";
import JoinChannelEvent from "./JoinChannelEvent";

export default class EventListenerController {
    poolHandler: ChannelEventHandler;

    constructor(poolHandler: ChannelEventHandler) {
        this.poolHandler = poolHandler;
    }

    joinPool(newUserPayload: JoinChannelEvent) {
        this.poolHandler.onChannelJoin(newUserPayload)
    }
}
