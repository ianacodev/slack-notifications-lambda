// vendor
import { SQS } from 'aws-sdk';
// models
import {
  DeleteMessageBatchRequestEntry,
  DeleteMessageBatchRequest,
  DeleteMessageBatchResult,
  SendMessageBatchRequestEntry,
  SendMessageBatchRequest,
  SendMessageBatchResult,
} from 'aws-sdk/clients/sqs';
// utils
import * as fromUtils from '../../../utils';
// env vars
const SQS_SLACK_NOTIFICATIONS_QUEUE_URL: string = process.env
  .sqsSlackNotificationsQueueUrl as string;

export class SqsNotificationService {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS();
  }

  /**
   * Send sqs notifications to queue.
   * @param sqsRecords
   */
  sendSqsNotifications(
    sendMessageBatchRequestEntries: SendMessageBatchRequestEntry[],
    queueUrl: string = SQS_SLACK_NOTIFICATIONS_QUEUE_URL,
  ): Promise<SendMessageBatchResult> {
    const sendMessageBatchRequest: SendMessageBatchRequest = {
      QueueUrl: queueUrl,
      Entries: sendMessageBatchRequestEntries,
    };
    return this.sqs
      .sendMessageBatch(sendMessageBatchRequest, this.responseCallback)
      .promise();
  }

  /**
   * Delete sqs notifications for specified receipt handles.
   * @param receiptHandles
   * @param queueUrl
   */
  deleteSqsNotifications(
    receiptHandles: string[],
    queueUrl: string = SQS_SLACK_NOTIFICATIONS_QUEUE_URL,
  ): Promise<DeleteMessageBatchResult> {
    const deleteMessageBatchRequestEntries: DeleteMessageBatchRequestEntry[] = receiptHandles.map(
      (receiptHandle: string) =>
        this.createDeleteMessageBatchRequestEntry(receiptHandle),
    );
    const deleteMessageBatchRequest: DeleteMessageBatchRequest = {
      QueueUrl: queueUrl,
      Entries: deleteMessageBatchRequestEntries,
    };
    return this.sqs
      .deleteMessageBatch(deleteMessageBatchRequest, this.responseCallback)
      .promise();
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
      console.error(`[sqs] error: ${error}`);
    } else {
      console.log(
        `[sqs] success: ${data.Successful.length} failed: ${
          data.Failed.length
        }`,
      );
    }
  }
}
