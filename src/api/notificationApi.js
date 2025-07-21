import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL; 
// ✅ Should end with /api, e.g. https://backend-ecomm-jol4.onrender.com/api

export async function fetchNotifications(userId) {
  const res = await axios.get(`${BASE_URL}/notifications/${userId}`);
  return res.data;
}

export async function markNotificationAsRead(userId, notificationId) {
  const res = await axios.patch(`${BASE_URL}/notifications/${userId}/${notificationId}/read`);
  return res.data;
}

export async function sendNotificationToAll(title, message, idToken) {
  const res = await axios.post(
    `${BASE_URL}/notifications/send-to-all`,
    { title, message },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return res.data;
}
