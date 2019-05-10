// services
import { SlackNotificationService } from './slack-notification.service';
import { SqsNotificationService } from './sqs-notification.service';
// models
import { SQSRecord } from 'aws-lambda';
import {
  DeleteMessageBatchResult,
  SendMessageBatchRequestEntry,
  SendMessageBatchResult,
} from 'aws-sdk/clients/sqs';
import { PlainTextElement } from '@slack/types';
import * as fromNotificationModels from '../models';
export class NotificationProcessorService {
  private slackNotificationService: SlackNotificationService;
  private sqsNotificationService: SqsNotificationService;

  constructor(
    slackNotificationService: SlackNotificationService = new SlackNotificationService(),
    sqsNotificationService: SqsNotificationService = new SqsNotificationService(),
  ) {
    this.slackNotificationService = slackNotificationService;
    this.sqsNotificationService = sqsNotificationService;
  }

  /**
   * Convert sqs records to slack notifications.
   * @param sqsRecords
   * @returns slack notifications
   */
  convertSqsRecordsToSlackNotifications(
    sqsRecords: SQSRecord[],
  ): fromNotificationModels.SlackNotification[] {
    return sqsRecords.map((sqsRecord: SQSRecord) =>
      this.convertSqsRecordToSlackNotification(sqsRecord),
    );
  }

  /**
   * Convert sqs record to slack notification.
   * @param sqsRecord
   * @returns notification
   */
  private convertSqsRecordToSlackNotification(
    sqsRecord: SQSRecord,
  ): fromNotificationModels.SlackNotification {
    const sqsMessageBody: string = sqsRecord.body;
    const receiptHandle: string = sqsRecord.receiptHandle;
    const plainTextElement: PlainTextElement = {
      type: fromNotificationModels.SlackElementTypes.PlainText,
      text: sqsMessageBody,
    };
    return {
      receiptHandle: receiptHandle,
      plainTextElement: plainTextElement,
    };
  }

  /**
   * Send slack notifications
   * @param slackNotifications
   */
  sendSlackNotifications(
    slackNotifications: fromNotificationModels.SlackNotification[],
  ): Promise<string[][]> {
    console.log(
      `[sendSlackNotifications] sending slack notifications: ${
        slackNotifications.length
      }`,
    );
    return this.handleSendSlackNotificationsResponse(
      this.slackNotificationService.sendSlackNotifications(slackNotifications),
    );
  }

  /**
   * Handle send slack notifications response.
   * @param response
   */
  private handleSendSlackNotificationsResponse(
    response: Promise<fromNotificationModels.SlackNotificationResult[]>,
  ): Promise<string[][]> {
    return response.then(
      (notificationResults: fromNotificationModels.SlackNotificationResult[]) =>
        this.filterNotificationResultsByStatus(notificationResults),
    );
  }

  /**
   * Filter notification results by status.
   * @params notificationResults
   * @returns success and error receipt handles
   */
  private filterNotificationResultsByStatus(
    notificationResults: fromNotificationModels.SlackNotificationResult[],
  ): string[][] {
    return notificationResults.reduce(
      (
        results: string[][],
        notificationResult: fromNotificationModels.SlackNotificationResult,
      ) => {
        let result: String[] =
          results[
            notificationResult.incomingWebhookResult.text ===
            fromNotificationModels.ResponseStatusTypes.Ok
              ? 0
              : 1
          ];
        result.push(notificationResult.receiptHandle);
        return results;
      },
      [[], []],
    );
  }

  /**
   * Delete sqs notifications.
   * @param receiptHandles
   * @returns promise delete message batch results
   */
  deleteSqsNotifications(
    receiptHandles: string[],
  ): Promise<DeleteMessageBatchResult> {
    console.log(
      `[deleteSqsNotifications] deleting sqs notifications: ${
        receiptHandles.length
      }`,
    );
    return this.sqsNotificationService.deleteSqsNotifications(receiptHandles);
  }

  /**
   * Send sqs notifications
   * @param notification
   */
  sendSqsNotifications(
    sendMessageBatchRequestEntries: SendMessageBatchRequestEntry[],
  ): Promise<SendMessageBatchResult> {
    console.log(
      `[sendSqsNotifications] sending sqs notifications: ${
        sendMessageBatchRequestEntries.length
      }`,
    );
    return this.sqsNotificationService.sendSqsNotifications(
      sendMessageBatchRequestEntries,
    );
  }
}
