import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiExternalLink, FiShoppingBag, FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Background3D from '../components/Background3D';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../lib/api';

interface Link {
  _id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  isActive: boolean;
}

interface User {
  username: string;
  email: string;
}

export default function PublicProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserData();
      fetchLinks();
      fetchProducts();
    }
  }, [username]);

  const fetchUserData = async () => {
    try {
      // In a real app, you would have an endpoint to get user data by username
      // For now, we'll just use the username from the URL
      setUser({ username: username as string, email: '' });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await api.get(`/links/public/${username}`);
      setLinks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/public/${username}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Background3D />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Background3D />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display font-bold text-3xl mb-4">User Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The user you're looking for doesn't exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Background3D />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-3xl mx-auto mb-4">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-display font-bold text-3xl mb-2">@{user.username}</h1>
            <div className="flex justify-center space-x-4">
              <button
                onClick={copyToClipboard}
                className="btn btn-secondary flex items-center"
              >
                {copied ? <FiCheck className="mr-2" /> : <FiCopy className="mr-2" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
          
          {/* Links Section */}
          {links.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display font-bold text-2xl mb-6">Links</h2>
              <div className="space-y-4">
                {links.map((link) => (
                  <motion.a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-4 flex items-center justify-between group"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-4">
                      {link.icon ? (
                        <img 
                          src={link.icon} 
                          alt={link.title} 
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
                          <FiExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <h3 className="font-medium">{link.title}</h3>
                    </div>
                    <FiExternalLink className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
          )}
          
          {/* Products Section */}
          {products.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl mb-6">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    className="card overflow-hidden"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {product.imageUrl && (
                      <div className="h-48 bg-gray-200 dark:bg-dark-700">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <span className="font-bold text-lg">
                          {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : '£'}
                          {product.price}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {product.description}
                      </p>
                      
                      <button className="btn btn-primary w-full">
                        <FiShoppingBag className="mr-2" />
                        Purchase
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {links.length === 0 && products.length === 0 && (
            <div className="card p-12 text-center">
              <h3 className="text-lg font-medium mb-2">No content yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                This user hasn't added any links or products yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
