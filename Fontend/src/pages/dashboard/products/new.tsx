import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiSave, FiX, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { useAuth } from '../../../lib/auth';
import api from '../../../lib/api';

const productSchema = yup.object({
  name: yup.string().required('Name is required').max(100),
  description: yup.string().required('Description is required').max(1000),
  price: yup.number().required('Price is required').min(0),
  currency: yup.string().default('USD').oneOf(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']),
  imageUrl: yup.string().url('Invalid image URL'),
  isActive: yup.boolean().default(true),
});

type ProductFormData = yup.InferType<typeof productSchema>;

export default function NewProduct() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      currency: 'USD',
      isActive: true,
    },
  });

  const imageUrl = watch('imageUrl');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      await api.post('/products', data);
      toast.success('Product created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-display font-bold text-3xl">Add New Product</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-secondary"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className="input"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="input"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium mb-1">
                  Currency
                </label>
                <select
                  {...register('currency')}
                  id="currency"
                  className="input"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Image
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-700 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imagePreview || imageUrl ? (
                    <div className="mb-4">
                      <img 
                        src={imagePreview || imageUrl} 
                        alt="Product preview" 
                        className="mx-auto h-48 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white dark:bg-dark-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="pl-1">or paste URL</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              
              <div className="mt-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                  Or enter image URL
                </label>
                <input
                  {...register('imageUrl')}
                  id="imageUrl"
                  type="text"
                  className="input"
                  placeholder="https://example.com/image.png"
                  onChange={(e) => {
                    setValue('imageUrl', e.target.value);
                    setImagePreview(null);
                  }}
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                {...register('isActive')}
                id="isActive"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Active (visible on public page)
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                <FiSave className="mr-2" />
                {isLoading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
