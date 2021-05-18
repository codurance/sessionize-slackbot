import PoolHandler from "./PoolHandler";

export default class EventListenerController {
    poolHandler: PoolHandler;

    constructor(poolHandler: PoolHandler) {
        this.poolHandler = poolHandler;
    }

    // TODO: Change `any` to its `ChannelJoinResponse` class
    joinPool(newUserPayload: any) {
        this.poolHandler.onPoolJoin(newUserPayload)
    }
}
