import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { useState } from "react";

type NotificationType = "success" | "info" | "warning";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

const initialNotifications: Notification[] = [];

const notificationConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-100",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-600",
    bgClass: "bg-yellow-100",
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F3D7] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-[#355E3B]" />

            <h1 className="text-3xl font-bold text-[#1B1B1B]">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-[#355E3B] px-3 py-1 text-xs font-semibold text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="text-gray-500 mt-2">
            Stay updated with your tasks, projects and team activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#355E3B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2d4f31] transition-colors"
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="max-w-4xl space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const config =
              notificationConfig[notification.type];

            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-2xl border p-5 shadow-sm transition ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-[#fdf8e8] border-[#b8c094]"
                }`}
              >
                <div
                  className={`h-11 w-11 shrink-0 rounded-full ${config.bgClass} flex items-center justify-center`}
                >
                  <Icon
                    size={21}
                    className={config.iconClass}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-[#1B1B1B]">
                        {notification.title}
                      </h2>

                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#355E3B] shrink-0 mt-2" />
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="text-xs font-medium text-[#355E3B] hover:underline"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                      className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
            <Bell className="mx-auto w-10 h-10 text-gray-300 mb-4" />

            <h2 className="text-lg font-semibold text-gray-700">
              No notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              You're all caught up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
