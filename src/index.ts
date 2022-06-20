import { App, ExpressReceiver } from '@slack/bolt';
import { ExtendedErrorHandlerArgs } from '@slack/bolt/dist/App';

const singingSecret = process.env.SLACK_SIGNING_SECRET as string;
const slackToken = process.env.SLACK_BOT_TOKEN;

// App initialization
// memo : Bolt内部の Express を明示的に設定する
// SlackイベントだけでなくHTTPリクエストを受け取る
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

const config = {
  receiver,
  signingSecret: singingSecret,
  token: slackToken,
};

const app = new App(config);

app.error(async ({ error, logger }: ExtendedErrorHandlerArgs) => {
  logger.error(error);
});

app.event('app_home_opened', async ({ event, say }) => {
  say(`Hello world, <@${event.user}>!`);
});

// Start
(async () => {
  // Start the app
  const port = process.env.PORT || 3000;
  await app.start(port as number);

  console.log(`listening on port ${port}!`);
})();
