// api/notificationApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
export async function fetchNotifications(userId) {
  const res = await axios.get(`${BASE_URL}/${userId}`);
  return res.data;
}

export async function markNotificationAsRead(userId, notificationId) {
  const res = await axios.patch(`${BASE_URL}/${userId}/${notificationId}/read`);
  return res.data;
}

export async function sendNotificationToAll(title, message, idToken) {
  const res = await axios.post(
    `${BASE_URL}/send-to-all`,
    { title, message },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return res.data;
}
