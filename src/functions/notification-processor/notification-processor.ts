// services
import { NotificationProcessorService } from './services';
// models
import { Handler, SQSEvent, SQSRecord } from 'aws-lambda';
import { Response } from '../../models';
import { SlackNotification } from './models';
// utils
import * as fromResponseUtils from '../../utils/response';

/**
 * Handler
 * @param sqsEvent
 */
export const notificationHandler: Handler = async (
  sqsEvent: SQSEvent,
): Promise<Response> => {
  return processIncomingSqsNotifications(
    sqsEvent,
    new NotificationProcessorService(),
  );
};

/**
 * Process incoming sqs notifications.
 * @param sqsEvent
 * @returns response
 */
export const processIncomingSqsNotifications: Function = async (
  sqsEvent: SQSEvent,
  notificationProcessorService: NotificationProcessorService,
): Promise<Response> => {
  const sqsRecords: SQSRecord[] = sqsEvent.Records;
  const slackNotificationsToSend: SlackNotification[] = notificationProcessorService.convertSqsRecordsToSlackNotifications(
    sqsRecords,
  );
  const [
    successNotificationReceiptHandles,
    errorNotificationReceiptHandles,
  ] = await notificationProcessorService.sendSlackNotifications(
    slackNotificationsToSend,
  );
  /**
   * NOTE: on success sqs lambda trigger messages are auto deleted
   * so currently no need to delete success notifications from queue
   */
  if (errorNotificationReceiptHandles.length) {
    notificationProcessorService.sendSqsDeadLetterNotifications(
      errorNotificationReceiptHandles,
      sqsRecords,
    );
  }
  return fromResponseUtils.ok(
    `success: ${successNotificationReceiptHandles.length} error: ${
      errorNotificationReceiptHandles.length
    }`,
  );
};
