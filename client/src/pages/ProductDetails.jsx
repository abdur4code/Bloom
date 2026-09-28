import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import axiosInstance from '../services/axiosConfig';
import { getImageUrl } from '../utils/image';
import { getApiErrorMessage } from '../utils/apiError';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.data || response.data);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to fetch product'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-6">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-zinc-900 font-medium hover:text-zinc-500 transition"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="bg-zinc-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={getImageUrl(product.image, 'https://via.placeholder.com/600x600?text=No+Image')}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-zinc-900">
                  {product.currency} {parseFloat(product.price).toFixed(2)}
                </span>
                <span
                  className={`px-4 py-2 rounded font-medium ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                Description
              </h2>
              <p className="text-zinc-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-3 pt-6 border-t border-zinc-200">
              <div className="flex justify-between">
                <span className="text-zinc-600">Product ID</span>
                <span className="font-medium text-zinc-900">{product._id || product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Currency</span>
                <span className="font-medium text-zinc-900">{product.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Stock Available</span>
                <span className="font-medium text-zinc-900">{product.stock}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={product.stock === 0}
              onClick={() => alert('Add to cart feature coming soon!')}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 rounded-lg font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ShoppingCart size={24} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
