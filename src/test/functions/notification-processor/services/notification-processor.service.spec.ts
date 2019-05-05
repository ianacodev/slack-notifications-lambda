// services
import {
  NotificationProcessorService,
  SlackNotificationService,
  SqsNotificationService,
} from './../../../../functions/notification-processor/services';
// models
import { SQSRecord } from 'aws-lambda';
import {
  SlackNotification,
  SlackNotificationResult,
  // ResponseStatusTypes,
} from './../../../../functions/notification-processor/models';
// mocks
import * as fromMocks from '../../../mocks';

/**
 * NotificationProcessorService Test
 */
describe('notificationProcessorService', () => {
  let notificationProcessorService: NotificationProcessorService;
  let slackNotificationServiceSpy: jasmine.SpyObj<SlackNotificationService>;
  let sqsNotificationServiceSpy: jasmine.SpyObj<SqsNotificationService>;

  beforeEach(() => {
    slackNotificationServiceSpy = jasmine.createSpyObj(
      'SlackNotificationService',
      ['sendSlackNotifications'],
    );
    sqsNotificationServiceSpy = jasmine.createSpyObj('SqsNotificationService', [
      'sendSqsDeadLetterNotifications',
    ]);
    notificationProcessorService = new NotificationProcessorService(
      slackNotificationServiceSpy,
      sqsNotificationServiceSpy,
    );
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  it('should have test obj', () => {
    expect(notificationProcessorService).toBeTruthy();
  });

  it('should convert sqs record to slack notification', () => {
    const slackNotifications: SlackNotification[] = notificationProcessorService.convertSqsRecordsToSlackNotifications(
      fromMocks.sqsRecords,
    );
    expect(slackNotifications.length).toBe(fromMocks.sqsRecords.length);
    expect(slackNotifications).toEqual(fromMocks.slackNotifications);
  });

  it('should send slack notifications', async () => {
    const slackNotificationResultsPromise: Promise<
      SlackNotificationResult[]
    > = Promise.resolve(fromMocks.slackNotificationResults);
    slackNotificationServiceSpy.sendSlackNotifications.and.returnValue(
      slackNotificationResultsPromise,
    );
    const [
      successNotificationReceiptHandles,
      errorNotificationReceiptHandles,
    ] = await notificationProcessorService.sendSlackNotifications(
      fromMocks.slackNotifications,
    );
    expect(successNotificationReceiptHandles.length).toBe(1);
    expect(errorNotificationReceiptHandles.length).toBe(1);
  });

  it('should send dead letter notifications', () => {
    const errorNotificationReceiptHandles: string[] = fromMocks.sqsRecords.map(
      (sqsRecord: SQSRecord) => sqsRecord.receiptHandle,
    );
    notificationProcessorService.sendSqsDeadLetterNotifications(
      errorNotificationReceiptHandles,
      fromMocks.sqsRecords,
    );
    const callCount: number = sqsNotificationServiceSpy.sendSqsDeadLetterNotifications.calls.count();
    expect(callCount).toBe(1);
  });
});
