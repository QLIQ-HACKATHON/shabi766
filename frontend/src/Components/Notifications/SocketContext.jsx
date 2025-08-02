// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {

    const newSocket = io(import.meta.env.VITE_API_URL, {
 
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      if (userId) {
        newSocket.emit('authenticate', userId);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};