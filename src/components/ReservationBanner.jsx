import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';

const ReservationBanner = () => {
  const { reservation } = useReservation();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!reservation) return;

    // Calculate initial seconds remaining
    const calc = () => {
      const diff = Math.max(0, Math.floor((new Date(reservation.expiresAt) - new Date()) / 1000));
      setSecondsLeft(diff);
      return diff;
    };

    calc();
    const interval = setInterval(() => {
      const remaining = calc();
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  if (!reservation || secondsLeft <= 0) return null;

  const isUrgent = secondsLeft <= 15;

  return (
    <div className={`${isUrgent ? 'bg-red-600' : 'bg-zinc-800'} border-b ${isUrgent ? 'border-red-500' : 'border-zinc-700'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isUrgent ? 'bg-white animate-ping' : 'bg-red-500 animate-pulse'}`} />
            <p className="text-sm text-white">
              <span className="font-bold">{reservation.drop?.name}</span>
              {' '}is reserved —{' '}
              <span className={`font-black ${isUrgent ? 'text-white' : 'text-red-400'}`}>
                {secondsLeft}s
              </span>
              {' '}remaining
            </p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-lg transition ${
              isUrgent
                ? 'bg-white text-red-600 hover:bg-zinc-100'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationBanner;