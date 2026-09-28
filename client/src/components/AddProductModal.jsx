import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosConfig';
import { X } from 'lucide-react';

function AddProductModal({ onClose }) {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      currency: 'USD',
      stock: '',
      image: null,
    },
  });

  const [imageError, setImageError] = useState('');
  const imageFile = watch('image');

  const validateImage = (file) => {
    if (!file) {
      setImageError('Image is required');
      return false;
    }
    if (file[0].size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return false;
    }
    setImageError('');
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateImage(imageFile)) return;

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', parseFloat(data.price));
      formData.append('currency', data.currency);
      formData.append('stock', parseInt(data.stock));
      formData.append('image', imageFile[0]);

      await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product added successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Add Product</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Product Name
            </label>
            <input
              {...register('name', { required: 'Product name is required' })}
              type="text"
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter product description"
              rows="3"
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Price
            </label>
            <input
              {...register('price', { required: 'Price is required' })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Currency
            </label>
            <select
              {...register('currency')}
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Stock
            </label>
            <input
              {...register('stock', { required: 'Stock is required' })}
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Image (Max 5MB)
            </label>
            <input
              {...register('image', { required: 'Image is required' })}
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
            {imageError && <p className="text-red-600 text-sm mt-1">{imageError}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-900 text-white py-2 rounded font-medium hover:bg-zinc-800 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
