import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import socket from '../socket/socket';
import Navbar from '../components/Navbar';
import ReservationBanner from '../components/ReservationBanner';
import DropCard from '../components/DropCard';

const DashboardPage = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch active drops on mount
  useEffect(() => {
    fetchDrops();
  }, []);

  // Socket listeners for live updates
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

    socket.on('stock:updated', handleStockUpdate);
    socket.on('feed:updated', handleFeedUpdate);

    return () => {
      socket.off('stock:updated', handleStockUpdate);
      socket.off('feed:updated', handleFeedUpdate);
    };
  }, [drops]);

  const fetchDrops = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/drops');
      setDrops(res.data.data);
    } catch (err) {
      console.log(err);
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

        {/* Loading */}
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
              <DropCard
                key={drop.id}
                drop={drop}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;