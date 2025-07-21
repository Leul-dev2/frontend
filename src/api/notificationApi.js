import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;
console.log('🔵 API BASE_URL:', BASE_URL);

export async function fetchNotifications(userId) {
  console.log('🔵 Calling fetchNotifications for userId:', userId);
  try {
    const res = await axios.get(`${BASE_URL}/notifications/${userId}`);
    console.log('🟢 fetchNotifications success:', res.data);
    return res.data;
  } catch (error) {
    console.error('🔴 fetchNotifications ERROR:', error);
    throw error;
  }
}

export async function markNotificationAsRead(userId, notificationId) {
  console.log('🔵 Marking notification as read:', userId, notificationId);
  try {
    const res = await axios.patch(`${BASE_URL}/notifications/${userId}/${notificationId}/read`);
    console.log('🟢 Marked as read:', res.data);
    return res.data;
  } catch (error) {
    console.error('🔴 markNotificationAsRead ERROR:', error);
    throw error;
  }
}
