import { useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import { useAuth } from '../context/authContext';
import { useState } from 'react';

const DropCard = ({ drop, onReserveSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { reservation, makeReservation } = useReservation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isOutOfStock = drop.availableStock === 0;
  const isCurrentlyReserved = reservation?.dropId === drop.id;
  const hasOtherReservation = reservation && reservation.dropId !== drop.id;

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await makeReservation(drop.id);
      onReserveSuccess?.();
      navigate('/checkout');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reserve. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getButtonState = () => {
    if (isOutOfStock) return { label: 'Sold Out', disabled: true, style: 'bg-zinc-700 text-zinc-400 cursor-not-allowed' };
    if (isCurrentlyReserved) return { label: 'Reserved ✓', disabled: true, style: 'bg-green-600/20 text-green-400 border border-green-600/30 cursor-not-allowed' };
    if (hasOtherReservation) return { label: 'Reserve', disabled: true, style: 'bg-zinc-700 text-zinc-400 cursor-not-allowed' };
    return { label: loading ? 'Reserving...' : 'Reserve', disabled: loading, style: 'bg-red-500 hover:bg-red-600 text-white' };
  };

  const button = getButtonState();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-zinc-700 transition">
      {/* Image */}
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        {drop.imageUrl ? (
          <img
            src={drop.imageUrl}
            alt={drop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-600 text-5xl">👟</span>
          </div>
        )}
        {/* Stock badge */}
        <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
          isOutOfStock
            ? 'bg-zinc-800 text-zinc-400'
            : drop.availableStock <= 5
            ? 'bg-red-500/90 text-white'
            : 'bg-black/70 text-white'
        }`}>
          {isOutOfStock ? 'Sold Out' : `${drop.availableStock} left`}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg leading-tight">{drop.name}</h3>
        {drop.description && (
          <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{drop.description}</p>
        )}
        <p className="text-red-400 font-black text-2xl mt-3">${Number(drop.price).toFixed(2)}</p>

        {/* Recent purchasers */}
        {drop.recentPurchasers?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-zinc-600 text-xs font-medium mb-1.5">Recent Buyers</p>
            <div className="flex flex-wrap gap-1.5">
              {drop.recentPurchasers.map((username, i) => (
                <span
                  key={i}
                  className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-full"
                >
                  @{username}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-xs mt-3">{error}</p>
        )}

        {/* Reserve button */}
        <button
          onClick={handleReserve}
          disabled={button.disabled}
          className={`mt-auto pt-4 w-full py-3 rounded-xl font-bold text-sm transition ${button.style}`}
        >
          {button.label}
        </button>
      </div>
    </div>
  );
};

export default DropCard;