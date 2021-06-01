import Language from "Models/Language";
import SlackId from "Models/SlackId";

export interface ILanguage {
    value: string;
    displayName: string;
}

export interface IMatchNotificationRequest {
    language: ILanguage,
    dateTime: string,
    users: SlackId[],
}

export interface IMatchDetails {
    language: Language,
    dateTime: DateTime,
    users: SlackId[]
}

export interface IMatchNotificationContent {
    matchIds: SlackId[],
    language: Language,
    dateTime: DateTime
}

export interface IMatchNotificationRequest {
    language: ILanguage,
    dateTime: string,
    users: SlackId[],
}

export interface ILanguagesResponse {
    languages: Language[]
}

export interface IMatchDetails {
    language: Language,
    dateTime: DateTime,
    users: SlackId[]
}

export interface IMatchNotification {
    slackId: SlackId,
    body: KnownBlock[]
}

export interface IPreferencesPayload {
    primaryLanguage: string,
    secondaryLanguage: string,
    tertiaryLanguage: string
}

export interface IPreferencesRequest {
    slackId : string,
}

export interface ISlackUserIdentity {
    slackId: SlackId;
    email: string;
    firstName: string;
    lastName: string;
}

export interface InteractiveMessageResponse {
    type: "block_actions";
    actions: [ElementAction];
    team: {
        id: string;
        domain: string;
        enterprise_id?: string;
        enterprise_name?: string;
    } | null;
    user: {
        id: string;
        name: string;
        team_id?: string;
    };
    channel?: {
        id: string;
        name: string;
    };
    message?: {
        type: "message";
        user?: string;
        ts: string;
        text?: string;
        [key: string]: any;
    };
    view?: ViewOutput;
    token: string;
    response_url: string;
    trigger_id: string;
    api_app_id: string;
    container: StringIndexed;
    app_unfurl?: any;
    is_enterprise_install?: boolean;
    enterprise?: {
        id: string;
        name: string;
    };
    state?: {
        values: {
            FWTV: {
                Jqez: {
                    selected_options: []
                } 
            }
        }
    }
}

export interface ILanguageSubmission {
    slackId: SlackId;
    body: {
        primaryLanguage: string,
        secondaryLanguage: string,
        tertiaryLanguage: string
    }
}

export interface IRawLanguageSubmission {
    selected_options: {
        value: string,
            text: {
                type: string,
                text: string,
                emoji: boolean
            }
    }[]
}
