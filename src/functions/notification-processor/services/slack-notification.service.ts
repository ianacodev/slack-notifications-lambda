// vendor
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';
// models
import { PlainTextElement } from '@slack/types';
import { SlackNotification, SlackNotificationResult } from '../models';
// env vars
const SLACK_URL: string = process.env.slackUrl as string;

export class SlackNotificationService {
  private webhook: IncomingWebhook;

  constructor(slackUrl: string = SLACK_URL) {
    this.webhook = new IncomingWebhook(slackUrl);
  }

  /**
   * Send slack notifications
   * @param plainTextElement
   */
  sendSlackNotifications(
    slackNotifications: SlackNotification[],
  ): Promise<SlackNotificationResult[]> {
    return Promise.all(
      slackNotifications.map((slackNotification: SlackNotification) => {
        return this.sendSlackNotification(
          slackNotification.plainTextElement,
        ).then((incomingWebhookResult: IncomingWebhookResult) => {
          return {
            receiptHandle: slackNotification.receiptHandle,
            incomingWebhookResult: incomingWebhookResult,
          };
        });
      }),
    );
  }

  /**
   * Send slack notification.
   * @param plainTextElement
   * @returns promise of incoming webhook result
   */
  private sendSlackNotification(
    plainTextElement: PlainTextElement,
  ): Promise<IncomingWebhookResult> {
    return this.webhook.send(plainTextElement);
  }
}
