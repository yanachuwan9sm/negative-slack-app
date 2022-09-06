import { App, ExpressReceiver } from '@slack/bolt';
import { ExtendedErrorHandlerArgs } from '@slack/bolt/dist/App';

import * as dotenv from 'dotenv';
dotenv.config({ path: `.env` });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const language = require('@google-cloud/language');

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

// テスト : command /ping をトリガーで発生するイベントを定義
app.command('/ping', async ({ command, ack, say, respond }) => {
  console.log(command);
  console.log(respond);
  await ack();
  await say(`pong`);
});

// テスト : message 特定の文字列 👋 を含むメッセージをトリガーとして発生するイベントを定義
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.message(':wave:', async ({ message, say }: any) => {
  await say(`Hello, <@${message.user}>`);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.event('message', async ({ event, say, logger }: any) => {
  try {
    const client = new language.LanguageServiceClient();

    const document = {
      content: event.text,
      type: 'PLAIN_TEXT',
    };

    const [result] = await client.analyzeSentiment({ document: document });

    // 文章全体をとおしての感情を示す数値を取得する
    const entireDocument = result.documentSentiment;
    const entireDocumentPositive = entireDocument.score;

    // 文章ごとの感情を示す数値及び文章の内容を取得する
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.sentences.map((sentence: any) => {
      console.log(sentence.text.content);
      console.log(sentence.sentiment);
    });

    if (entireDocumentPositive < -0.25) {
      await say('ネガティブ発言はやめてください！');
    }

    if (entireDocumentPositive > -0.25 && entireDocumentPositive < 0.25) {
      await say('普通の感情ですね');
    }

    if (entireDocumentPositive > 0.25) {
      await say('幸せそうで何より');
    }
  } catch (error) {
    logger.error(error);
  }
});

(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);

  console.log('⚡️ Bolt app is running!');
})();
