export const greeting = (name: string) : string => {
    return `Hi ${name}, welcome to Sessionize!`;
};

export const welcomeBack = (name: string) : string => {
    return `Hi ${name}, welcome back to Sessionize!`;
};

export const farewell = (name: string) : string => {
    return `We're sorry to see you leave, ${name}! Please feel free to come back anytime by rejoining the channel.`;
};

export const error = (name: string) : string => {
    return `${name}, it looks like something may have gone wrong regarding your last action with Sessionize.`;
};