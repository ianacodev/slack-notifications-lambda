// services
import { SlackNotificationService } from './slack-notification.service';
import { SqsNotificationService } from './sqs-notification.service';
// models
import { SQSRecord } from 'aws-lambda';
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
  async sendSlackNotifications(
    slackNotifications: fromNotificationModels.SlackNotification[],
  ): Promise<string[][]> {
    console.log(
      `[sendSlackNotifications] notifications to send: ${
        slackNotifications.length
      }`,
    );
    return await this.handleSendSlackNotificationsResponse(
      this.slackNotificationService.sendSlackNotifications(slackNotifications),
    );
  }

  /**
   * Handle send slack notifications response.
   * @param response
   * @param sqsRecords
   */
  private async handleSendSlackNotificationsResponse(
    response: Promise<fromNotificationModels.SlackNotificationResult[]>,
  ): Promise<string[][]> {
    return response.then(
      (
        notificationResults: fromNotificationModels.SlackNotificationResult[],
      ) => {
        return this.filterNotificationResultsByStatus(notificationResults);
      },
      (err: any) => {
        return err;
      },
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
   * Send sqs dead letter notifications
   * @param errorNotificationReceiptHandles
   * @param sqsRecords
   */
  sendSqsDeadLetterNotifications(
    errorNotificationReceiptHandles: string[],
    sqsRecords: SQSRecord[],
  ): void {
    console.log(
      `[sendSqsDeadLetterNotifications] dead letter notifications to send: ${
        errorNotificationReceiptHandles.length
      }`,
    );
    const sqsErrorRecords = this.extractSqsErrorRecordsFromSqsRecords(
      errorNotificationReceiptHandles,
      sqsRecords,
    );
    this.sqsNotificationService.sendSqsDeadLetterNotifications(sqsErrorRecords);
  }

  /**
   * Extract sqs error records from sqs records.
   * @params errorNotificationReceiptHandles
   * @returns sqs error records
   */
  private extractSqsErrorRecordsFromSqsRecords(
    errorNotificationReceiptHandles: string[],
    sqsRecords: SQSRecord[],
  ): SQSRecord[] {
    return sqsRecords
      .filter((sqsRecord: SQSRecord) =>
        errorNotificationReceiptHandles.includes(sqsRecord.receiptHandle),
      )
      .map((sqsRecord: SQSRecord) => sqsRecord);
  }
}
