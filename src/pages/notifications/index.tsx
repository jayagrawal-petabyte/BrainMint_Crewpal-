import {
  Bell,
  Mail,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { notificationService } from "../../services/notificationService";
import { getErrorMessage } from "../../services/apiErrors";
import { ErrorState } from "../../components/errors/ErrorState";
import type { Notification } from "../../types/notification";

const notificationConfig = {
  in_app: {
    icon: Bell,
    iconClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  email: {
    icon: Mail,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-100",
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
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
        {isLoading ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#355E3B] border-t-transparent" />
            <p className="text-sm font-medium text-gray-500">
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <ErrorState
            title="Couldn't load notifications"
            message={error}
            onRetry={fetchNotifications}
          />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => {
            const config =
              notificationConfig[notification.type];

            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-2xl border p-5 shadow-sm transition ${
                  notification.is_read
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
                        {notification.created_at}
                      </p>
                    </div>

                    {!notification.is_read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#355E3B] shrink-0 mt-2" />
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!notification.is_read && (
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