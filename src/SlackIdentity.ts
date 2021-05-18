import SlackUserIdentity from "./SlackUserIdentity";
import SlackTeamIdentity from "./SlackTeamIdentity";

export default interface SlackIdentity {
    ok: boolean;
    user: SlackUserIdentity;
    team: SlackTeamIdentity;
}