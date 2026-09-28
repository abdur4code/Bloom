import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import axiosInstance from '../services/axiosConfig';
import { getApiErrorMessage } from '../utils/apiError';

function EditProductModal({ product, onClose, onProductUpdated }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    reset({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      currency: product.currency || 'USD',
      stock: product.stock ?? '',
    });
  }, [product, reset]);

  const onSubmit = async (data) => {
    const image = data.image?.[0];
    if (image && image.size > 5 * 1024 * 1024) {
      setImageError('Image must be less than 5MB');
      return;
    }
    setImageError('');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', parseFloat(data.price));
      formData.append('currency', data.currency);
      formData.append('stock', parseInt(data.stock, 10));
      if (image) formData.append('image', image);

      const productId = product._id || product.id;
      const response = await axiosInstance.put(`/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product updated successfully!');
      onProductUpdated(response.data.data || response.data);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update product'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">Edit Product</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name', { required: 'Product name is required' })} placeholder="Product name" className="w-full px-3 py-2 border border-zinc-300 rounded" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          <textarea {...register('description', { required: 'Description is required' })} placeholder="Description" rows="3" className="w-full px-3 py-2 border border-zinc-300 rounded" />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          <input {...register('price', { required: 'Price is required' })} type="number" step="0.01" placeholder="Price" className="w-full px-3 py-2 border border-zinc-300 rounded" />
          {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          <select {...register('currency')} className="w-full px-3 py-2 border border-zinc-300 rounded">
            <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="INR">INR</option>
          </select>
          <input {...register('stock', { required: 'Stock is required' })} type="number" placeholder="Stock" className="w-full px-3 py-2 border border-zinc-300 rounded" />
          {errors.stock && <p className="text-red-600 text-sm">{errors.stock.message}</p>}
          <label className="block text-sm font-medium text-zinc-900">
            Replace image (optional)
            <input {...register('image')} type="file" accept="image/*" className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded" />
          </label>
          {imageError && <p className="text-red-600 text-sm">{imageError}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-zinc-900 text-white py-2 rounded font-medium hover:bg-zinc-800 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
