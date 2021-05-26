import SlackId from "./SlackId";

export default interface SlackUserIdentity {
    slackId: SlackId;
    email: string;
    firstName: string;
    lastName: string;
}