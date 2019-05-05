// vendor
import { SQS } from 'aws-sdk';
// models
import { SQSRecord } from 'aws-lambda';
import {
  DeleteMessageBatchRequestEntry,
  DeleteMessageBatchRequest,
  SendMessageBatchRequestEntry,
  SendMessageBatchRequest,
} from 'aws-sdk/clients/sqs';
// utils
import * as fromUtils from '../../../utils';
// env vars
const SQS_SLACK_NOTIFICATIONS_QUEUE_URL: string = process.env
  .SQS_SLACK_NOTIFICATIONS_QUEUE_URL as string;
const SQS_SLACK_NOTIFICATIONS_DEAD_LETTER_QUEUE_URL = process.env
  .SQS_SLACK_NOTIFICATIONS_DEAD_LETTER_QUEUE_URL as string;

export class SqsNotificationService {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS();
  }

  /**
   * Send sqs notifications to dead letter queue.
   * @param receiptHandles
   */
  sendSqsDeadLetterNotifications(
    sqsErrorRecords: SQSRecord[],
    queueUrl: string = SQS_SLACK_NOTIFICATIONS_DEAD_LETTER_QUEUE_URL,
  ): void {
    const sendMessageBatchRequestEntries: SendMessageBatchRequestEntry[] = sqsErrorRecords.map(
      (sqsErrorRecord: SQSRecord): SendMessageBatchRequestEntry => {
        return {
          Id: fromUtils.generateUUID(),
          MessageBody: sqsErrorRecord.body,
        };
      },
    );
    this.sendSqsNotifications(sendMessageBatchRequestEntries, queueUrl);
  }

  /**
   * Send sqs notifications to queue.
   * @param sqsRecords
   */
  private sendSqsNotifications(
    sendMessageBatchRequestEntries: SendMessageBatchRequestEntry[],
    queueUrl: string,
  ): void {
    const sendMessageBatchRequest: SendMessageBatchRequest = {
      QueueUrl: queueUrl,
      Entries: sendMessageBatchRequestEntries,
    };
    this.sqs.sendMessageBatch(sendMessageBatchRequest, this.responseCallback);
  }

  /**
   * Delete sqs notifications for specified receipt handles.
   * @param receiptHandles
   * @param queueUrl
   */
  deleteSqsNotifications(
    receiptHandles: string[],
    queueUrl: string = SQS_SLACK_NOTIFICATIONS_QUEUE_URL,
  ): void {
    const deleteMessageBatchRequestEntries: DeleteMessageBatchRequestEntry[] = receiptHandles.map(
      (receiptHandle: string) =>
        this.createDeleteMessageBatchRequestEntry(receiptHandle),
    );
    const deleteMessageBatchRequest: DeleteMessageBatchRequest = {
      QueueUrl: queueUrl,
      Entries: deleteMessageBatchRequestEntries,
    };
    this.sqs.deleteMessageBatch(
      deleteMessageBatchRequest,
      this.responseCallback,
    );
  }

  /**
   * Create delete message batch request entry.
   * @param receiptHandle
   */
  private createDeleteMessageBatchRequestEntry(
    receiptHandle: string,
  ): DeleteMessageBatchRequestEntry {
    return {
      Id: fromUtils.generateUUID(),
      ReceiptHandle: receiptHandle,
    };
  }

  /**
   * response callback
   */
  private responseCallback(error: any, data: any): void {
    if (error) {
      console.error(`[sendSqsNotifications::error] ${error}`);
    } else {
      console.log(
        `[sendSqsNotifications::success] successful: ${
          data.Successful.length
        } failed: ${data.Failed.length}`,
      );
    }
  }
}
