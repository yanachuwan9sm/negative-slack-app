import { App } from '@slack/bolt';
import { negativeAnalyzeEventHandlers } from './negativeAnalyzeEventHandlers';

export type EventHandler = (app: App) => void;

const eventHandlers: EventHandler[] = [negativeAnalyzeEventHandlers];

export const registerEventHandlers = (app: App): void => {
  for (const eventHandler of eventHandlers) {
    eventHandler(app);
  }
};
