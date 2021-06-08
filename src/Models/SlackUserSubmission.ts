import {ISlackUserIdentity, ISlackUserSubmission} from "Typings";

export default class SlackUserSubmission {
    slackUser: string;
    email: string;
    firstName: string;
    lastName: string;

    constructor(slackUser: string, email: string, firstName: string, lastName: string){
        this.slackUser = slackUser;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    static fromSlackResponse(response: ISlackUserIdentity): ISlackUserSubmission {
        return {
            slackUser: response.slackId,
            email: response.email,
            name: response.name
        } as ISlackUserSubmission;
    }
}
