import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  async function handleSend() {
    try {
      setStatus('Sending...');

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');

      const idToken = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_API_URL}/notifications/send-to-all`,
        { title, message },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setStatus('✅ Sent to all users!');
      setTitle('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to send.');
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto' }}>
      <h2>Admin: Send Notification To All Users</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Notification Title"
        style={{ display: 'block', marginBottom: 8, width: '100%' }}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Notification Message"
        rows="4"
        style={{ display: 'block', marginBottom: 8, width: '100%' }}
      />
      <button onClick={handleSend}>Send To All</button>
      <p>{status}</p>
    </div>
  );
}
