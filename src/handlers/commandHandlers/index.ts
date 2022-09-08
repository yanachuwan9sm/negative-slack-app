import { App } from '@slack/bolt';

export const registerCommandHandlers = (app: App) => {
  // テスト : command /ping をトリガーで発生するイベントを定義
  app.command('/ping', async ({ command, ack, say, respond }) => {
    console.log(command);
    console.log(respond);
    await ack();
    await say(`pong`);
  });
};
