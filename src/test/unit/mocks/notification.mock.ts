// models
import { SQSEvent, SQSRecord, SQSRecordAttributes, Context } from 'aws-lambda';
import {
  SlackNotification,
  SlackElementTypes,
  SlackNotificationResult,
  SQSRecordBodyObj,
} from '../../../functions/notification-processor/models';
import { String } from 'aws-sdk/clients/rekognition';

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

// sqs record body obj
export const sqsRecordBodyObj1: SQSRecordBodyObj = {
  type: 'testType1',
  message: '',
  notificationMessage: 'test message 1',
};

// sqs record body obj
export const sqsRecordBodyObj2: SQSRecordBodyObj = {
  type: 'testType2',
  message: '',
  notificationMessage: 'test message 2',
};

// sqs records
export const sqsRecords: SQSRecord[] = [
  {
    messageId: '1119171c-613e-4c79-a690-1bc24a6d2490',
    receiptHandle:
      '111BjRCbvwLVmvHsxWfzM8HYZ+z+xuAz8lJ5d0YV1vONvbbb3A/mrHhvO5WyzXY/iyyvIzw+S4YpvDaxd91YIp/yMrN9qvtadtKpov8A87mY9m2Z/ghy0K1jVGIB9l/WDysb1MTqFnR7Tw3ASst1lBrp+JNrYEl0UlFDZPoyuLFBBg3AkAb90PMTkQ+o0vok20yEQ9e5zE+6izfPlBf8Sf/ZTDYsigyHL23aKOikG/5f7njwIX+cvlBOo6xuFq1MTeNqjcqAZfLJzYUYdzKsVBqpiGTSHHexsWFIWVUGhsm1WyIQXN65LXxlBz7lbksE9J6HPtBCEysz80iIY5fVoQMeo7scfvCVz6nr0lVw86NPAUfXbAz8bJZnp3rvfPrhPB6l5QgL8a837Fdg0/MxmKae6A==',
    body: JSON.stringify(sqsRecordBodyObj1),
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
    body: JSON.stringify(sqsRecordBodyObj1),
    attributes: sqsRecordAttributes,
    messageAttributes: {},
    md5OfBody: '222ed73daf187c4818ebaf267ca0b41c',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn:aws:sqs:us-east-1:222812251862:slack-messages',
    awsRegion: 'us-east-1',
  },
];

// sqs event
export const sqsEvent: SQSEvent = {
  Records: sqsRecords,
};

// slack notifications
export const slackNotifications: SlackNotification[] = sqsRecords.map(
  (sqsRecord: SQSRecord) => {
    const sqsRecordBodyObj: SQSRecordBodyObj = JSON.parse(sqsRecord.body);
    return {
      receiptHandle: sqsRecord.receiptHandle,
      plainTextElement: {
        type: SlackElementTypes.PlainText,
        text: sqsRecordBodyObj.notificationMessage,
      },
    };
  },
);

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

// slack notifications results promise
export const slackNotificationResultsPromise: Promise<
  SlackNotificationResult[]
> = Promise.resolve(slackNotificationResults);

// response
export const responseSuccessMessage: String = 'success: 1';
export const responseErrorMessage: String = 'success: 1 error: 1';
