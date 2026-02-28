import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useReservation } from '../context/ReservationContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { reservation } = useReservation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-black text-white tracking-tight">
            SNKR<span className="text-red-500">DROP</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Active reservation indicator */}
                {reservation && (
                  <Link
                    to="/checkout"
                    className="hidden sm:flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-red-500/20 transition"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Active Reservation
                  </Link>
                )}
                <span className="text-zinc-400 text-sm hidden sm:block">
                  Hey, <span className="text-white font-medium">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-white text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-zinc-400 hover:text-white text-sm transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
                >
                  Join Drop
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;