import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import socket from '../socket/socket.js';
import Navbar from '../components/Navbar.jsx';
import ReservationBanner from '../components/ReservationBanner.jsx';
import DropCard from '../components/DropCard.jsx';

const DashboardPage = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrops();
  }, []);

  useEffect(() => {
    // Live stock update — update availableStock for the matching drop
    const handleStockUpdate = ({ dropId, availableStock }) => {
      setDrops((prev) =>
        prev.map((drop) =>
          drop.id === dropId ? { ...drop, availableStock } : drop
        )
      );
    };

    // Feed update — update recentPurchasers for the matching drop
    const handleFeedUpdate = ({ dropId, recentPurchasers }) => {
      setDrops((prev) =>
        prev.map((drop) =>
          drop.id === dropId ? { ...drop, recentPurchasers } : drop
        )
      );
    };

    // Drop activated — prepend to the top of the list
    const handleDropActivated = (drop) => {
      setDrops((prev) => {
        // Avoid duplicates in case of race condition
        const exists = prev.some((d) => d.id === drop.id);
        if (exists) return prev;
        return [drop, ...prev];
      });
      toast.success(`New drop is live: ${drop.name}`, {
        duration: 5000,
        icon: '🔥',
      });
    };

    // Drop ended — remove from list and notify user
    const handleDropEnded = ({ dropId }) => {
      setDrops((prev) => prev.filter((drop) => drop.id !== dropId));
      toast('A drop has ended.', {
        duration: 4000,
        icon: '🏁',
        style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' },
      });
    };

    socket.on('stock:updated', handleStockUpdate);
    socket.on('feed:updated', handleFeedUpdate);
    socket.on('drop:activated', handleDropActivated);
    socket.on('drop:ended', handleDropEnded);

    return () => {
      socket.off('stock:updated', handleStockUpdate);
      socket.off('feed:updated', handleFeedUpdate);
      socket.off('drop:activated', handleDropActivated);
      socket.off('drop:ended', handleDropEnded);
    };
  }, []);

  const fetchDrops = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/drops');
      setDrops(res.data.data);
    } catch (err) {
      console.log('Error fetching drops:', err);
      setError('Failed to load drops. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <ReservationBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white">
            Live <span className="text-red-500">Drops</span>
          </h2>
          <p className="text-zinc-500 mt-1 text-sm">
            Limited stock. Reserve now before it's gone.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-zinc-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                  <div className="h-8 bg-zinc-800 rounded w-1/3" />
                  <div className="h-10 bg-zinc-800 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchDrops}
              className="mt-4 text-zinc-400 hover:text-white text-sm underline transition"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && drops.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👟</p>
            <h3 className="text-white font-bold text-xl">No active drops right now</h3>
            <p className="text-zinc-500 text-sm mt-2">Check back soon for the next release.</p>
          </div>
        )}

        {/* Drop cards grid */}
        {!loading && !error && drops.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;