import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import ProductCard from '../components/ProductCard';
import { getApiErrorMessage } from '../utils/apiError';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import EditProductModal from '../components/EditProductModal';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user, accessToken } = useSelector((state) => state.auth);
  const canManageProducts = Boolean(user && accessToken);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        const products = response.data.data?.products || response.data.products || response.data;
        setProducts(Array.isArray(products) ? products : []);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.addEventListener('product-added', fetchProducts);
    return () => window.removeEventListener('product-added', fetchProducts);
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await axiosInstance.delete(`/products/${productId}`);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => (product._id || product.id) !== productId)
      );
      toast.success('Product deleted successfully.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete product'));
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((currentProducts) => currentProducts.map((product) =>
      (product._id || product.id) === (updatedProduct._id || updatedProduct.id)
        ? updatedProduct
        : product
    ));
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">All Products</h1>
          <p className="text-zinc-500 text-lg">
            Browse our complete collection of premium products
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-500">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onEdit={canManageProducts ? setEditingProduct : undefined}
                    onDelete={canManageProducts ? handleDelete : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-zinc-500 text-lg mb-2">No products found</p>
                <p className="text-zinc-400">
                  Check back later for new arrivals
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
}

export default Products;
