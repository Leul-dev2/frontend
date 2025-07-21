import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL; // e.g. https://backend-ecomm-jol4.onrender.com/api

export async function fetchNotifications(userId) {
  return axios.get(`${BASE_URL}/notifications/${userId}`).then(res => res.data);
}

export async function markNotificationAsRead(userId, notificationId) {
  return axios.patch(`${BASE_URL}/notifications/${userId}/${notificationId}/read`).then(res => res.data);
}

export async function sendNotificationToAll(title, message, idToken) {
  return axios.post(
    `${BASE_URL}/notifications/send-to-all`,
    { title, message },
    { headers: { Authorization: `Bearer ${idToken}` } }
  ).then(res => res.data);
}
