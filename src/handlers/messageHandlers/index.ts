import { App } from '@slack/bolt';

export const registerMessageHandlers = (app: App): void => {
  // テスト : message 特定の文字列 👋 を含むメッセージをトリガーとして発生するイベントを定義
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.message(':wave:', async ({ message, say }: any) => {
    await say(`Hello, <@${message.user}>`);
  });
};
