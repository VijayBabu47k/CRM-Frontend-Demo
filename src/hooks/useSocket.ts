import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './useRedux';
import { selectToken, selectIsAdmin } from '../store/features/authSlice';
import { addNotification } from '../store/features/notificationSlice';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const isAdmin = useAppSelector(selectIsAdmin);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      
      // Join admin room if user is admin
      if (isAdmin) {
        socketRef.current?.emit('join:admin');
      }
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for user registration events
    socketRef.current.on('user:registered', (data) => {
      dispatch(addNotification({
        type: 'user_registered',
        title: 'New User Registered',
        message: data.message,
        data: data.user,
      }));
    });

    // Listen for user creation events
    socketRef.current.on('user:created', (data) => {
      dispatch(addNotification({
        type: 'info',
        title: 'User Created',
        message: data.message,
        data: data.user,
      }));
    });

    // Listen for user updates
    socketRef.current.on('user:updated', (data) => {
      dispatch(addNotification({
        type: 'info',
        title: 'User Updated',
        message: data.message,
        data: data.user,
      }));
    });

    // Listen for user deletion
    socketRef.current.on('user:deleted', (data) => {
      dispatch(addNotification({
        type: 'warning',
        title: 'User Deleted',
        message: data.message,
      }));
    });

    // Listen for activity events
    socketRef.current.on('activity:new', (data) => {
      dispatch(addNotification({
        type: 'activity',
        title: 'New Activity',
        message: data.message,
        data,
      }));
    });

    // Listen for online/offline events
    socketRef.current.on('user:online', (data) => {
      console.log('User online:', data.userId);
    });

    socketRef.current.on('user:offline', (data) => {
      console.log('User offline:', data.userId);
    });

  }, [token, isAdmin, dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  useEffect(() => {
    if (token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    emit,
    isConnected: socketRef.current?.connected || false,
  };
};

export default useSocket;
