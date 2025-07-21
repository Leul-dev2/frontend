import React, { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationAsRead } from '../api/notificationApi';

export default function NotificationsPage({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (e) {
        console.error('Error loading notifications:', e);
      } finally {
        setLoading(false);
      }
    }

    if (!userId) return;
    loadNotifications();
  }, [userId]);

  async function handleMarkRead(notificationId) {
    try {
      await markNotificationAsRead(userId, notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  }

  if (loading) return <p>Loading notifications...</p>;

  if (notifications.length === 0) return <p>No notifications available.</p>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            onClick={() => handleMarkRead(notif.id)}
            style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 8,
              backgroundColor: notif.isRead ? '#f0f0f0' : '#d0ebff',
              cursor: 'pointer',
            }}
          >
            <strong>{notif.title}</strong>
            <p>{notif.message}</p>
            <small>{new Date(notif.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
