import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL; // Your backend URL

export async function fetchNotifications(userId) {
  const res = await axios.get(`${BASE_URL}/${userId}`);
  return res.data;
}

export async function markNotificationAsRead(userId, notificationId) {
  const res = await axios.patch(`${BASE_URL}/${userId}/${notificationId}/read`);
  return res.data;
}
