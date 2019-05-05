// models
import { PlainTextElement } from '@slack/types';
import { IncomingWebhookResult } from '@slack/webhook';

// slack element types
export enum SlackElementTypes {
  PlainText = 'plain_text',
}

// response status types
export enum ResponseStatusTypes {
  Ok = 'ok',
}

// slack notification
export interface SlackNotification {
  receiptHandle: string;
  plainTextElement: PlainTextElement;
}

// slack notification result
export interface SlackNotificationResult {
  receiptHandle: string;
  incomingWebhookResult: IncomingWebhookResult;
}
