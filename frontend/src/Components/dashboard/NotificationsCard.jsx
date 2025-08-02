import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useNotifications } from '../Hooks/useNotification'; 

const NotificationsCard = ({ userId }) => {
  
    const { notifications, loading, markAsRead, deleteNotification } = useNotifications(userId);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            toast.success("Notification marked as read.");
        } catch (error) {
            toast.error("Failed to mark notification as read.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            toast.success("Notification deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete notification.");
        }
    };

    return (
        <Card className="md:col-span-2 shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Your latest alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-center text-gray-500">Loading notifications...</p>
                ) : notifications.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.map((notif) => (
                            <div 
                                key={notif._id} 
                                className={`flex items-start gap-4 p-2 rounded-lg transition-colors ${!notif.read ? 'bg-sky-50 hover:bg-sky-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <span className={`${!notif.read ? 'text-sky-500 font-bold' : 'text-gray-400'}`}>•</span>
                                <div className="flex-grow">
                                    <p className={`text-sm font-medium ${notif.read ? 'text-gray-500' : 'text-gray-800'}`}>{notif.title}</p>
                                    <p className={`text-xs ${notif.read ? 'text-gray-400' : 'text-gray-600'}`}>{notif.message}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!notif.read && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notif._id)} 
                                            className="text-xs text-sky-500 hover:text-sky-700"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(notif._id)} 
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You have no notifications.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationsCard;