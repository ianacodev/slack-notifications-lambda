// test obj
import * as fromNotificationProcessor from '../../../functions/notification-processor/notification-processor';

/**
 * NotificationProcessor
 */
describe('notificationsProcessor', () => {
  it('should have test obj', () => {
    expect(
      fromNotificationProcessor.processIncomingSqsNotifications,
    ).toBeTruthy();
  });
});
