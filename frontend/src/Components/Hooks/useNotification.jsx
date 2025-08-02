
import { useEffect, useState } from 'react';
import { useSocket } from '../Notifications/SocketContext'; 
import API from '../API'; 

export const useNotifications = (userId) => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const fetchNotifications = async () => {
    try {

      setLoading(true);

      const response = await API.get('/notifications');

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Error fetching notifications:', error);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (userId) {
      fetchNotifications();
    }
    
    if (socket) {
      socket.on('newNotification', (newNotification) => {
        console.log('New notification received:', newNotification);
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        setUnreadCount((prevCount) => prevCount + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off('newNotification');
      }
    };
  }, [socket, userId]);
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/mark-read`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
  
      await API.delete(`/notifications/${id}`);
      setNotifications((prevNotifications) => prevNotifications.filter(n => n._id !== id));
     
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };


  return { notifications, unreadCount, loading, markAsRead, deleteNotification };
};