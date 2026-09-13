export const notificationService = {
  requestPermission: async (): Promise<NotificationPermission | 'unsupported'> => {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  },

  notify: (title: string, body: string, icon = '/vite.svg') => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon,
          silent: false,
        });
      }
    } catch (e) {
      console.warn('Unable to dispatch notification:', e);
    }
  },
};

