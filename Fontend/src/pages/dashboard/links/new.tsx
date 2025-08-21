import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiLink, FiSave, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import { useAuth } from '../../../lib/auth';
import api from '../../../lib/api';

const linkSchema = yup.object({
  title: yup.string().required('Title is required').max(50),
  url: yup.string().required('URL is required').url('Invalid URL'),
  icon: yup.string().url('Invalid icon URL'),
  isActive: yup.boolean().default(true),
  order: yup.number().default(0),
});

type LinkFormData = yup.InferType<typeof linkSchema>;

export default function NewLink() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: yupResolver(linkSchema),
    defaultValues: {
      isActive: true,
      order: 0,
    },
  });

  const onSubmit = async (data: LinkFormData) => {
    setIsLoading(true);
    
    try {
      await api.post('/links', data);
      toast.success('Link created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create link');
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
            <h1 className="font-display font-bold text-3xl">Add New Link</h1>
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
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                {...register('title')}
                id="title"
                type="text"
                className="input"
                placeholder="Enter link title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                URL
              </label>
              <input
                {...register('url')}
                id="url"
                type="text"
                className="input"
                placeholder="https://example.com"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="icon" className="block text-sm font-medium mb-1">
                Icon URL (optional)
              </label>
              <input
                {...register('icon')}
                id="icon"
                type="text"
                className="input"
                placeholder="https://example.com/icon.png"
              />
              {errors.icon && (
                <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
              )}
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
            
            <div>
              <label htmlFor="order" className="block text-sm font-medium mb-1">
                Order
              </label>
              <input
                {...register('order', { valueAsNumber: true })}
                id="order"
                type="number"
                className="input"
                placeholder="0"
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
              )}
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
                {isLoading ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
