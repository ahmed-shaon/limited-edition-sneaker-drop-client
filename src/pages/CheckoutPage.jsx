import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useReservation } from '../context/ReservationContext';
import Navbar from '../components/Navbar.jsx';
import ReservationBanner from '../components/ReservationBanner';

const CheckoutPage = () => {
  const { reservation, cancelReservation, clearReservation } = useReservation();
  const navigate = useNavigate();

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [error, setError] = useState('');

  // Redirect to dashboard if no active reservation
  useEffect(() => {
    if (!reservation) {
      navigate('/');
    }
  }, [reservation, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!reservation) return;

    const calc = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(reservation.expiresAt) - new Date()) / 1000)
      );
      setSecondsLeft(diff);
      return diff;
    };

    calc();
    const interval = setInterval(() => {
      const remaining = calc();
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError('');
    try {
      const res = await api.post('/purchases', { dropId: reservation.dropId });
      setPurchaseSuccess(res.data.data);
      clearReservation();
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    try {
      await cancelReservation(reservation.dropId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setCancelling(false);
    }
  };

  const isExpired = secondsLeft <= 0;
  const isUrgent = secondsLeft <= 15 && secondsLeft > 0;

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Purchase success screen
  if (purchaseSuccess) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-white mb-2">You got 'em!</h2>
          <p className="text-zinc-400 text-sm mb-8">
            Your purchase of{' '}
            <span className="text-white font-semibold">{purchaseSuccess.drop?.name}</span>{' '}
            is confirmed.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Order ID</span>
              <span className="text-zinc-300 font-mono text-xs">{purchaseSuccess.purchaseId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Item</span>
              <span className="text-white font-medium">{purchaseSuccess.drop?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Price Paid</span>
              <span className="text-red-400 font-black text-lg">${Number(purchaseSuccess.pricePaid).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Purchased At</span>
              <span className="text-zinc-300">{new Date(purchaseSuccess.purchasedAt).toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
          >
            Back to Drops
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) return null;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <ReservationBanner />

      <main className="max-w-lg mx-auto px-4 py-10">
        <h2 className="text-3xl font-black text-white mb-8">
          Complete <span className="text-red-500">Purchase</span>
        </h2>

        {/* Countdown timer */}
        <div className={`rounded-2xl p-6 mb-6 text-center border ${
          isExpired
            ? 'bg-zinc-900 border-zinc-700'
            : isUrgent
            ? 'bg-red-500/10 border-red-500/40'
            : 'bg-zinc-900 border-zinc-800'
        }`}>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-2">
            {isExpired ? 'Reservation Expired' : 'Time Remaining'}
          </p>
          <p className={`text-6xl font-black tabular-nums ${
            isExpired ? 'text-zinc-600' : isUrgent ? 'text-red-500' : 'text-white'
          }`}>
            {formatTime(secondsLeft)}
          </p>
          {isUrgent && !isExpired && (
            <p className="text-red-400 text-xs mt-2 animate-pulse">Hurry! Your reservation is about to expire.</p>
          )}
          {isExpired && (
            <p className="text-zinc-500 text-xs mt-2">Your reservation has expired. The item has been returned to stock.</p>
          )}
        </div>

        {/* Drop details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
          {/* Image */}
          {reservation.drop?.imageUrl ? (
            <img
              src={reservation.drop.imageUrl}
              alt={reservation.drop.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
              <span className="text-6xl">👟</span>
            </div>
          )}

          {/* Details */}
          <div className="p-6 space-y-3">
            <h3 className="text-white font-bold text-xl">{reservation.drop?.name}</h3>
            {reservation.drop?.description && (
              <p className="text-zinc-500 text-sm">{reservation.drop.description}</p>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
              <span className="text-zinc-500 text-sm">Total</span>
              <span className="text-red-400 font-black text-3xl">
                ${Number(reservation.drop?.price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePurchase}
            disabled={purchasing || isExpired}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition text-lg"
          >
            {purchasing ? 'Processing...' : isExpired ? 'Reservation Expired' : `Buy Now · $${Number(reservation.drop?.price).toFixed(2)}`}
          </button>

          {!isExpired && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full bg-transparent hover:bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white font-medium py-3 rounded-xl transition text-sm"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
            </button>
          )}

          {isExpired && (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-transparent hover:bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white font-medium py-3 rounded-xl transition text-sm"
            >
              Back to Drops
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;