// test obj
import { processIncomingSqsNotifications } from '../../../../functions/notification-processor/notification-processor';
// services
import { NotificationProcessorService } from '../../../../functions/notification-processor/services';
// mocks
import * as fromMocks from '../../mocks';

/**
 * NotificationProcessor
 */
// TODO fix test
describe('notificationsProcessor', () => {
  let notificationProcessorServiceSpy: jasmine.SpyObj<
    NotificationProcessorService
  >;

  beforeEach(() => {
    notificationProcessorServiceSpy = jasmine.createSpyObj(
      'NotificationProcessorService',
      [
        'convertSqsRecordsToSlackNotifications',
        'sendSlackNotifications',
        'deleteSqsNotifications',
      ],
    );
  });

  it('should have test obj', () => {
    expect(processIncomingSqsNotifications).toBeTruthy();
  });

  xit('should process notifications', async () => {
    notificationProcessorServiceSpy.convertSqsRecordsToSlackNotifications.and.returnValue(
      fromMocks.slackNotifications,
    );
    await notificationProcessorServiceSpy.sendSlackNotifications.and.returnValue(
      Promise.resolve(['1234']['5678']),
    );
    let responseMessage: string = '';
    try {
      responseMessage = processIncomingSqsNotifications(
        fromMocks.sqsEvent,
        notificationProcessorServiceSpy,
      );
    } catch {
      let callCount: number = 0;
      callCount += notificationProcessorServiceSpy.convertSqsRecordsToSlackNotifications.calls.count();
      callCount += notificationProcessorServiceSpy.sendSlackNotifications.calls.count();
      callCount += notificationProcessorServiceSpy.deleteSqsNotifications.calls.count();
      expect(callCount).toBe(3);
      expect(responseMessage).toEqual(fromMocks.responseErrorMessage);
    }
  });
});
