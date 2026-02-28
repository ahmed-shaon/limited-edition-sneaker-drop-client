import { createContext, useContext } from "react";

export const ReservationContext = createContext(null);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) throw new Error('useReservation must be used within ReservationProvider');
  return context;
};