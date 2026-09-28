import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react';
import axiosInstance from '../services/axiosConfig';
import ProductCard from '../components/ProductCard';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, accessToken } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(accessToken && user);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axiosInstance.get('/products?limit=4');
        const products = response.data.data?.products || response.data.products || response.data;
        setFeaturedProducts(Array.isArray(products) ? products.slice(0, 4) : []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 tracking-tight">
                {isAuthenticated ? `Welcome back, ${user.name}` : 'Discover Premium Products'}
              </h1>
              <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                {isAuthenticated
                  ? 'Explore the latest products and find something you will love.'
                  : 'Explore our curated collection of high-quality products. From everyday essentials to premium selections, find everything you need.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded font-medium hover:bg-zinc-800 transition"
              >
                Shop Now
                <ArrowRight size={20} />
              </Link>
              <a
                href="#featured"
                className="inline-flex items-center justify-center gap-2 border border-zinc-900 text-zinc-900 px-8 py-4 rounded font-medium hover:bg-zinc-50 transition"
              >
                See Featured
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="bg-zinc-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Featured Products</h2>
            <p className="text-zinc-500 text-lg">
              Check out our hand-picked selection of trending items
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-zinc-500">Loading featured products...</div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-300 rounded-lg">
              <p className="text-2xl font-semibold text-zinc-900 mb-2">
                {isAuthenticated ? 'Your store is ready to grow' : 'No products available yet'}
              </p>
              <p className="text-zinc-500">
                {isAuthenticated
                  ? 'There are no products yet. Add your first product from the navigation bar.'
                  : 'Check back later for new arrivals.'}
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-zinc-900 font-medium hover:text-zinc-500 transition"
            >
              View All Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && <section className="bg-zinc-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers. Create an account and start shopping today.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-zinc-900 px-8 py-4 rounded font-medium hover:bg-zinc-50 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>}
    </div>
  );
}

export default Home;
