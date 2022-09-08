import { EventHandler } from './index';
import { App } from '@slack/bolt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const language = require('@google-cloud/language');

const NEGATIVE_BORDER_SCORE = -0.25;
const POSITIVE_BORDER_SCORE = 0.25;

export const negativeAnalyzeEventHandlers: EventHandler = (app: App) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.event<'message'>('message', async ({ event, say, logger }: any) => {
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

      if (entireDocumentPositive < NEGATIVE_BORDER_SCORE) {
        await say('ネガティブ発言はやめてください！');
      }
      if (
        entireDocumentPositive > NEGATIVE_BORDER_SCORE &&
        entireDocumentPositive < POSITIVE_BORDER_SCORE
      ) {
        await say('普通の感情ですね');
      }
      if (entireDocumentPositive > POSITIVE_BORDER_SCORE) {
        await say('幸せそうで何より');
      }
    } catch (error) {
      logger.error(error);
    }
  });
};
