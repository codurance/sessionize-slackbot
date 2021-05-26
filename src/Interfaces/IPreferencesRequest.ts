import Language from "../Language";
import SlackId from "../SlackId";

export default interface IPreferencesRequest {
    slackId : string,
    languages : Language[]
}