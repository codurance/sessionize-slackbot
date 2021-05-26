import { instance, mock, verify, when } from "ts-mockito"
import CoreApiClient from "../CoreApiClient"
import MessageBuilder from "../MessageBuilder"
import ChannelEventHandler from "../EventHandlers/ChannelEventHandler"
import SlackApiClient from "../SlackApiClient"
import SlackUserIdentity from "../SlackUserIdentity"
import { MemberJoinedChannelEvent } from "@slack/bolt"

describe("ChannelEventHandler", () => {
    test("should make request to core to see if user joining channel is new", async () => {

        const event: MemberJoinedChannelEvent = {
            type: "member_joined_channel",
            user: "U0G9QF9C6",
            channel: "C0698JE0H",
            channel_type: "C",
            team: "T024BE7LD",
            inviter: "U123456789"
        };

        const userIdentity: SlackUserIdentity = {
            firstName: "Joe",
            lastName: "Bloggs",
            slackId: "U0G9QF9C6",
            email: "joe.bloggs@codurance.com"
        };

        const mockedCoreApiClient: CoreApiClient = mock(CoreApiClient);
        when(mockedCoreApiClient.isNewUser(userIdentity)).thenResolve(true);

        const mockedSlackApiClient: SlackApiClient = mock(SlackApiClient);
        when(mockedSlackApiClient.getIdentity(event.user)).thenResolve(userIdentity);

        const channelEventHandler = new ChannelEventHandler(instance(mockedCoreApiClient), instance(mockedSlackApiClient), new MessageBuilder());

        const message = await channelEventHandler.onChannelJoin(event);

        verify(mockedCoreApiClient.isNewUser(userIdentity)).once();
    });

    test("should acknowledge responses from users when accepting matches", () => {

        const mockedSlackApiClient : SlackApiClient = mock(SlackApiClient);
        const slackApiClient : SlackApiClient = instance(mockedSlackApiClient);

        const mockedCoreApiClient : CoreApiClient = mock(CoreApiClient);
        const coreApiClient : CoreApiClient = instance(mockedCoreApiClient);

        const channelEventHandler : ChannelEventHandler = new ChannelEventHandler(coreApiClient, slackApiClient, new MessageBuilder());

        const mockedPayload = {
            type: 'block_actions',
            user: {
              id: 'U01V0UBN3NH',
              username: 'cameron.raw',
              name: 'cameron.raw',
              team_id: 'T01V0U6LQJZ'
            },
            api_app_id: 'A022EHG41CL',
            token: 'BgRDgLOgQPpi4PmozVcDPTv4',
            container: {
              type: 'message',
              message_ts: '1621863299.000700',
              channel_id: 'D0228M62ZSN',
              is_ephemeral: false
            },
            trigger_id: '2090302345590.1986958704645.6cb92425c4a7dfb86a719f8388fe6109',
            team: { id: 'T01V0U6LQJZ', domain: 'academy2021workspace' },
            enterprise: null,
            is_enterprise_install: false,
            channel: { id: 'D0228M62ZSN', name: 'directmessage' },
            message: {
              bot_id: 'B0228M620US',
              type: 'message',
              text: 'You have a new match!',
              user: 'U0221TQMHFY',
              ts: '1621863299.000700',
              team: 'T01V0U6LQJZ',
              blocks: [ [Object], [Object], [Object] ]
            },
            state: { values: {} },
            response_url: 'https://hooks.slack.com/actions/T01V0U6LQJZ/2097292332595/DAglk4ScxkvM9vI6kkipUr1A',
            actions: [
              {
                action_id: 'approve_session',
                block_id: 'o03x',
                text: [Object],
                value: 'session_confirmed',
                style: 'primary',
                type: 'button',
                action_ts: '1621870144.300876'
              }
            ]
          }

          // TODO: Finish this test
        //channelEventHandler.interactiveMessageResponse(mockedPayload);

    });
});
