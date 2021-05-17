import PoolHandler from "./PoolHandler";

export default class EventListenerController {
    poolHandler: PoolHandler;

    constructor(poolHandler : PoolHandler){
        this.poolHandler = poolHandler;
    }

    joinPool(newUserPayload: any) {
        this.poolHandler.onPoolJoin(newUserPayload)
    }
}
