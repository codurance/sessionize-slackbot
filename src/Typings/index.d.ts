export interface ILanguage {
    value: string;
    displayName: string;
};

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
};

export interface IPreferencesRequest {
    slackId : string,
}

export interface ISlackUserIdentity {
    slackId: SlackId;
    email: string;
    firstName: string;
    lastName: string;
}