import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils/image';

function ProductCard({ product, onDelete }) {
  const productId = product._id || product.id;

  return (
    <Link to={`/products/${productId}`}>
      <div className="bg-white border border-zinc-200 rounded overflow-hidden hover:shadow-lg transition">
        {/* Image */}
        <div className="aspect-square bg-zinc-100 overflow-hidden">
          <img
            src={getImageUrl(product.image, 'https://via.placeholder.com/300x300?text=No+Image')}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">{product.name}</h3>
          <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Stock */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-zinc-900">
              {product.currency} {parseFloat(product.price).toFixed(2)}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                product.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              alert('Add to cart feature coming soon!');
            }}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2 rounded hover:bg-zinc-800 transition"
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete(productId);
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 border border-red-200 text-red-700 py-2 rounded hover:bg-red-50 transition"
            >
              <Trash2 size={18} />
              <span>Delete Product</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
