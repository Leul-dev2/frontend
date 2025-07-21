import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL; // https://backend-ecomm-jol4.onrender.com/api

export async function fetchNotifications(userId) {
  try {
    const res = await axios.get(`${BASE_URL}/notifications/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(userId, notificationId) {
  try {
    const res = await axios.patch(`${BASE_URL}/notifications/${userId}/${notificationId}/read`);
    return res.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}
