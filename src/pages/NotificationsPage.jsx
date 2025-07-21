import React, { useEffect, useState } from 'react';
import {
  fetchNotifications,
  markNotificationAsRead,
  sendNotificationToAll,
} from '../api/notificationApi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      if (usr) {
        const tokenResult = await usr.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
        setNotifications([]);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchNotifications(user.uid)
      .then((data) => setNotifications(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleMarkRead(notifId) {
    try {
      await markNotificationAsRead(user.uid, notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSend() {
    if (!title || !message) {
      setStatus('Please enter both title and message');
      return;
    }
    setStatus('');
    try {
      const idToken = await user.getIdToken();
      await sendNotificationToAll(title, message, idToken);
      setStatus('Notification sent to all users!');
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('Failed to send notification.');
    }
  }

  if (!user) return <p>Please log in to see your notifications.</p>;
  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      {isAdmin && (
        <div style={{ marginBottom: 30 }}>
          <h2>Send Notification to All Users (Admin Only)</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', marginBottom: 8, width: '300px' }}
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ display: 'block', marginBottom: 8, width: '300px', height: '100px' }}
          />
          <button onClick={handleSend}>Send</button>
          {status && <p>{status}</p>}
          <hr />
        </div>
      )}

      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
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
      )}
    </div>
  );
}
