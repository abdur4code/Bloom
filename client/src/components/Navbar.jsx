import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Plus, LogOut, Home, Package, UserRound } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosConfig';
import AddProductModal from './AddProductModal';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // Clear the local session even if the backend session is already invalid.
      console.error('Logout request failed:', error);
    } finally {
      dispatch(logout());
      toast.success('You have been logged out.');
      navigate('/');
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-zinc-900">
              Bloom
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition"
              >
                <Package size={20} />
                <span>Products</span>
              </Link>

              {/* Auth Section */}
              {accessToken && user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-800 transition"
                  >
                    <Plus size={20} />
                    <span>Add Product</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-700">
                      <UserRound size={18} aria-hidden="true" />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      aria-label="Log out"
                      title="Log out"
                      className="flex items-center gap-2 text-zinc-500 hover:text-red-600 transition"
                    >
                      <LogOut size={20} />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-zinc-900 border border-zinc-900 rounded hover:bg-zinc-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-800 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add Product Modal */}
      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Navbar;
