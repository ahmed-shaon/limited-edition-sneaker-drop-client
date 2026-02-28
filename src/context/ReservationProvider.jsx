import { useState, useEffect } from 'react';
import socket from '../socket/socket';
import api from '../api/axios';
import { useAuth } from './authContext';
import { ReservationContext } from './ReservationContext';
import toast from 'react-hot-toast';

export const ReservationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch active reservation when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setReservation(null);
      return;
    }
    fetchActiveReservation();
  }, [isAuthenticated]);

  // Listen for reservation expiry from socket
  useEffect(() => {
    const handleExpiry = ({ dropId }) => {
      if (reservation?.dropId === dropId) {
        setReservation(null);
        toast.error('Your reservation has expired. The item has been returned to stock.', {
          duration: 5000,
          icon: '⏰',
        });
      }
    };

    socket.on('reservation:expired', handleExpiry);
    return () => socket.off('reservation:expired', handleExpiry);
  }, [reservation]);

  const fetchActiveReservation = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reservations/active');
      setReservation(res.data.data); // null if no active reservation
    } catch (error) {
      console.error('Failed to fetch active reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const makeReservation = async (dropId) => {
    const res = await api.post('/reservations', { dropId });
    await fetchActiveReservation(); // refresh reservation state
    return res.data;
  };

  const cancelReservation = async (dropId) => {
    await api.delete(`/reservations/${dropId}`);
    setReservation(null);
  };

  const clearReservation = () => setReservation(null);

  return (
    <ReservationContext.Provider
      value={{
        reservation,
        loading,
        makeReservation,
        cancelReservation,
        clearReservation,
        fetchActiveReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

