// models
import { SQSEvent, SQSRecord, SQSRecordAttributes, Context } from 'aws-lambda';
import {
  SlackNotification,
  SlackElementTypes,
  SlackNotificationResult,
} from '../../functions/notification-processor/models';

// context
export const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: 0,
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: () => 0,
  done: () => null,
  fail: () => null,
  succeed: () => null,
};

// sqs record attributes
export const sqsRecordAttributes: SQSRecordAttributes = {
  ApproximateReceiveCount: '',
  SentTimestamp: '',
  SenderId: '',
  ApproximateFirstReceiveTimestamp: '',
};

// sqs records
export const sqsRecords: SQSRecord[] = [
  {
    messageId: '1119171c-613e-4c79-a690-1bc24a6d2490',
    receiptHandle:
      '111BjRCbvwLVmvHsxWfzM8HYZ+z+xuAz8lJ5d0YV1vONvbbb3A/mrHhvO5WyzXY/iyyvIzw+S4YpvDaxd91YIp/yMrN9qvtadtKpov8A87mY9m2Z/ghy0K1jVGIB9l/WDysb1MTqFnR7Tw3ASst1lBrp+JNrYEl0UlFDZPoyuLFBBg3AkAb90PMTkQ+o0vok20yEQ9e5zE+6izfPlBf8Sf/ZTDYsigyHL23aKOikG/5f7njwIX+cvlBOo6xuFq1MTeNqjcqAZfLJzYUYdzKsVBqpiGTSHHexsWFIWVUGhsm1WyIQXN65LXxlBz7lbksE9J6HPtBCEysz80iIY5fVoQMeo7scfvCVz6nr0lVw86NPAUfXbAz8bJZnp3rvfPrhPB6l5QgL8a837Fdg0/MxmKae6A==',
    body: '{\n\t"text": "test message 1"\n}',
    attributes: sqsRecordAttributes,
    messageAttributes: {},
    md5OfBody: '111ed73daf187c4818ebaf267ca0b41c',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn:aws:sqs:us-east-1:111812251862:slack-messages',
    awsRegion: 'us-east-1',
  },
  {
    messageId: '2229171c-613e-4c79-a690-1bc24a6d2490',
    receiptHandle:
      '222BjRCbvwLVmvHsxWfzM8HYZ+z+xuAz8lJ5d0YV1vONvbbb3A/mrHhvO5WyzXY/iyyvIzw+S4YpvDaxd91YIp/yMrN9qvtadtKpov8A87mY9m2Z/ghy0K1jVGIB9l/WDysb1MTqFnR7Tw3ASst1lBrp+JNrYEl0UlFDZPoyuLFBBg3AkAb90PMTkQ+o0vok20yEQ9e5zE+6izfPlBf8Sf/ZTDYsigyHL23aKOikG/5f7njwIX+cvlBOo6xuFq1MTeNqjcqAZfLJzYUYdzKsVBqpiGTSHHexsWFIWVUGhsm1WyIQXN65LXxlBz7lbksE9J6HPtBCEysz80iIY5fVoQMeo7scfvCVz6nr0lVw86NPAUfXbAz8bJZnp3rvfPrhPB6l5QgL8a837Fdg0/MxmKae6A==',
    body: '{\n\t"text": "test message 2"\n}',
    attributes: sqsRecordAttributes,
    messageAttributes: {},
    md5OfBody: '222ed73daf187c4818ebaf267ca0b41c',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn:aws:sqs:us-east-1:222812251862:slack-messages',
    awsRegion: 'us-east-1',
  },
];

// sqs event
export const SqsEvent: SQSEvent = {
  Records: sqsRecords,
};

// slack notifications
export const slackNotifications: SlackNotification[] = [
  {
    receiptHandle: sqsRecords[0].receiptHandle,
    plainTextElement: {
      type: SlackElementTypes.PlainText,
      text: sqsRecords[0].body,
    },
  },
  {
    receiptHandle: sqsRecords[1].receiptHandle,
    plainTextElement: {
      type: SlackElementTypes.PlainText,
      text: sqsRecords[1].body,
    },
  },
];

// slack notification results
export const slackNotificationResults: SlackNotificationResult[] = [
  {
    receiptHandle: slackNotifications[0].receiptHandle,
    incomingWebhookResult: { text: 'ok' },
  },
  {
    receiptHandle: slackNotifications[1].receiptHandle,
    incomingWebhookResult: { text: 'error' },
  },
];
