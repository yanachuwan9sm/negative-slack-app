import { App, ExpressReceiver } from '@slack/bolt';
import { ExtendedErrorHandlerArgs } from '@slack/bolt/dist/App';

import * as dotenv from 'dotenv';
import { registerCommandHandlers } from './handlers/commandHandlers';
import { registerEventHandlers } from './handlers/eventHandlers';
import { registerMessageHandlers } from './handlers/messageHandlers';
dotenv.config({ path: `.env` });

const singingSecret = process.env.SLACK_SIGNING_SECRET as string;
const slackToken = process.env.SLACK_BOT_TOKEN as string;

// Appの初期化
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

// Commandハンドラーを登録する
registerCommandHandlers(app);

// Messageハンドラーを登録する
registerMessageHandlers(app);

// Eventハンドラーを登録する
registerEventHandlers(app);

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running! Port: ${port}`);
})();
