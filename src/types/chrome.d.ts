// Ambient types for Chrome Extension APIs (Manifest V3)

declare namespace chrome {
  namespace runtime {
    interface InstalledDetails {
      reason: string;
      previousVersion?: string;
    }
    const onInstalled: {
      addListener(callback: (details: InstalledDetails) => void): void;
    };
    function getURL(path: string): string;
  }

  namespace alarms {
    interface Alarm {
      name: string;
      scheduledTime: number;
      periodInMinutes?: number;
    }
    interface AlarmCreateInfo {
      when?: number;
      delayInMinutes?: number;
      periodInMinutes?: number;
    }
    function create(name: string, alarmInfo: AlarmCreateInfo): void;
    function clear(name: string): Promise<boolean>;
    const onAlarm: {
      addListener(callback: (alarm: Alarm) => void): void;
    };
  }

  namespace action {
    function setBadgeText(details: { text: string }): Promise<void>;
    function setBadgeBackgroundColor(details: { color: string }): Promise<void>;
  }

  namespace notifications {
    interface NotificationOptions {
      type: 'basic' | 'image' | 'list' | 'progress';
      iconUrl: string;
      title: string;
      message: string;
      silent?: boolean;
      priority?: number;
    }
    function create(
      notificationId: string,
      options: NotificationOptions,
      callback?: (notificationId: string) => void
    ): void;
  }

  namespace storage {
    interface StorageChange {
      oldValue?: unknown;
      newValue?: unknown;
    }
    interface StorageArea {
      get(keys?: string | string[] | Record<string, unknown> | null): Promise<Record<string, unknown>>;
      set(items: Record<string, unknown>): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
    }
    const local: StorageArea;
    const session: StorageArea;
    const onChanged: {
      addListener(
        callback: (changes: Record<string, StorageChange>, areaName: string) => void
      ): void;
    };
  }
}

