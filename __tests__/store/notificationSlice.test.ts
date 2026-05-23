import notificationReducer, {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  selectNotifications,
  selectUnreadCount,
} from '@/store/features/notificationSlice';

describe('Notification Slice', () => {
  const initialState = {
    notifications: [],
    unreadCount: 0,
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(notificationReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addNotification', () => {
      const notification = {
        type: 'info' as const,
        title: 'Test Notification',
        message: 'This is a test',
      };

      const state = notificationReducer(initialState, addNotification(notification));

      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].title).toBe('Test Notification');
      expect(state.notifications[0].read).toBe(false);
      expect(state.unreadCount).toBe(1);
    });

    it('should handle markAsRead', () => {
      const stateWithNotification = {
        notifications: [
          {
            id: '1',
            type: 'info' as const,
            title: 'Test',
            message: 'Test',
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        unreadCount: 1,
      };

      const state = notificationReducer(stateWithNotification, markAsRead('1'));

      expect(state.notifications[0].read).toBe(true);
      expect(state.unreadCount).toBe(0);
    });

    it('should handle markAllAsRead', () => {
      const stateWithNotifications = {
        notifications: [
          { id: '1', type: 'info' as const, title: 'Test 1', message: 'Test', timestamp: new Date().toISOString(), read: false },
          { id: '2', type: 'info' as const, title: 'Test 2', message: 'Test', timestamp: new Date().toISOString(), read: false },
        ],
        unreadCount: 2,
      };

      const state = notificationReducer(stateWithNotifications, markAllAsRead());

      expect(state.notifications.every(n => n.read)).toBe(true);
      expect(state.unreadCount).toBe(0);
    });

    it('should handle removeNotification', () => {
      const stateWithNotification = {
        notifications: [
          { id: '1', type: 'info' as const, title: 'Test', message: 'Test', timestamp: new Date().toISOString(), read: false },
        ],
        unreadCount: 1,
      };

      const state = notificationReducer(stateWithNotification, removeNotification('1'));

      expect(state.notifications).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
    });

    it('should handle clearAllNotifications', () => {
      const stateWithNotifications = {
        notifications: [
          { id: '1', type: 'info' as const, title: 'Test 1', message: 'Test', timestamp: new Date().toISOString(), read: false },
          { id: '2', type: 'info' as const, title: 'Test 2', message: 'Test', timestamp: new Date().toISOString(), read: true },
        ],
        unreadCount: 1,
      };

      const state = notificationReducer(stateWithNotifications, clearAllNotifications());

      expect(state.notifications).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
    });

    it('should limit notifications to 50', () => {
      let state = initialState;

      // Add 55 notifications
      for (let i = 0; i < 55; i++) {
        state = notificationReducer(state, addNotification({
          type: 'info' as const,
          title: `Notification ${i}`,
          message: 'Test',
        }));
      }

      expect(state.notifications.length).toBeLessThanOrEqual(50);
    });
  });

  describe('selectors', () => {
    const mockNotifications = [
      { id: '1', type: 'info' as const, title: 'Test 1', message: 'Test', timestamp: new Date().toISOString(), read: false },
      { id: '2', type: 'info' as const, title: 'Test 2', message: 'Test', timestamp: new Date().toISOString(), read: true },
    ];

    const rootState = {
      notifications: {
        notifications: mockNotifications,
        unreadCount: 1,
      },
    };

    it('selectNotifications should return all notifications', () => {
      expect(selectNotifications(rootState)).toEqual(mockNotifications);
    });

    it('selectUnreadCount should return unread count', () => {
      expect(selectUnreadCount(rootState)).toBe(1);
    });
  });
});
