// services
import { NotificationProcessorService } from './services';
// models
import { Handler, SQSEvent, SQSRecord, Context } from 'aws-lambda';
import { Response } from '../../models';
import { SlackNotification } from './models';

/**
 * Handler
 * @param sqsEvent
 */
export const notificationHandler: Handler = async (
  event: SQSEvent,
  context: Context,
) => {
  const response: Response = await processIncomingSqsNotifications(
    event,
    new NotificationProcessorService(),
  );
  return response;
};

/**
 * Process incoming sqs notifications.
 * @param sqsEvent
 * @returns response
 */
export const processIncomingSqsNotifications: Function = async (
  sqsEvent: SQSEvent,
  notificationProcessorService: NotificationProcessorService,
): Promise<string> => {
  let responseMessage: string = 'no messages processed';
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
  // handle success notifications
  if (successNotificationReceiptHandles.length) {
    await notificationProcessorService.deleteSqsNotifications(
      successNotificationReceiptHandles,
    );
    responseMessage = `success: ${successNotificationReceiptHandles.length}`;
  }
  // handle error notifications
  if (errorNotificationReceiptHandles.length) {
    throw new Error(
      `success: ${successNotificationReceiptHandles.length} error: ${
        errorNotificationReceiptHandles.length
      }`,
    );
  }
  return responseMessage;
};
