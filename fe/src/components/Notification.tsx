import React from "react";

type NotificationProps = {
  notifications: {
    id: number;
    message: string;
    timestamp: string;
  }[];
};

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="relative">
      {/* Notification Container */}
      <div className="absolute top-0 right-0 w-72 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700">Notifikasi</h3>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex justify-between items-start p-4 border-b border-gray-200 hover:bg-gray-100"
            >
              <div>
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 text-sm focus:outline-none"
                aria-label="Go to notification"
              >
                &gt;
              </button>
            </li>
          ))}
          {notifications.length === 0 && (
            <li className="p-4 text-center text-gray-500">Tidak ada notifikasi</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
