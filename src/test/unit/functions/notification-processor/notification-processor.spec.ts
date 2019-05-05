// test obj
import { processIncomingSqsNotifications } from '../../../../functions/notification-processor/notification-processor';
// services
import { NotificationProcessorService } from '../../../../functions/notification-processor/services';
// models
import { Response } from '../../../../models';
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
        'sendSqsDeadLetterNotifications',
      ],
    );
  });

  it('should have test obj', () => {
    expect(processIncomingSqsNotifications).toBeTruthy();
  });

  xit('should process notifications', () => {
    notificationProcessorServiceSpy.convertSqsRecordsToSlackNotifications.and.returnValue(
      fromMocks.slackNotifications,
    );
    notificationProcessorServiceSpy.sendSlackNotifications.and.returnValue(
      ['123']['456'],
    );
    const response: Promise<Response> = processIncomingSqsNotifications(
      fromMocks.sqsEvent,
      notificationProcessorServiceSpy,
    );
    let callCount: number = 0;
    callCount += notificationProcessorServiceSpy.convertSqsRecordsToSlackNotifications.calls.count();
    callCount += notificationProcessorServiceSpy.sendSlackNotifications.calls.count();
    callCount += notificationProcessorServiceSpy.sendSqsDeadLetterNotifications.calls.count();
    console.log(callCount, response);
    // TODO: fix test
    // expect(callCount).toBe(3);
    // expect(response).toEqual(fromMocks.responsePromise);
  });
});
