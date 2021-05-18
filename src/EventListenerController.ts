import PoolHandler from "./PoolHandler";
import JoinChannelEvent from "./JoinChannelEvent";

export default class EventListenerController {
    poolHandler: PoolHandler;

    constructor(poolHandler: PoolHandler) {
        this.poolHandler = poolHandler;
    }

    joinPool(newUserPayload: JoinChannelEvent) {
        this.poolHandler.onPoolJoin(newUserPayload)
    }
}
