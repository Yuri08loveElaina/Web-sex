import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiLink, FiShoppingBag, FiSettings, FiBarChart2, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import Background3D from '../components/Background3D';
import Header from '../components/Header';
import { useAuth } from '../lib/auth';
import api from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'links' | 'products' | 'analytics' | 'settings'>('links');
  const [links, setLinks] = useState<Link[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
    fetchProducts();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await api.get('/links');
      setLinks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await api.delete(`/links/${id}`);
      setLinks(links.filter(link => link._id !== id));
    } catch (error) {
      console.error('Failed to delete link:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const toggleLinkStatus = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/links/${id}`, { isActive: !isActive });
      setLinks(links.map(link => 
        link._id === id ? { ...link, isActive: !isActive } : link
      ));
    } catch (error) {
      console.error('Failed to toggle link status:', error);
    }
  };

  const toggleProductStatus = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive });
      setProducts(products.map(product => 
        product._id === id ? { ...product, isActive: !isActive } : product
      ));
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    }
  };

  const tabs = [
    { id: 'links', label: 'Links', icon: <FiLink className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <FiShoppingBag className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

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

  return (
    <div className="min-h-screen flex flex-col">
      <Background3D />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <div className="card p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-lg">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold">{user?.username}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              
              <Link href={`/${user?.username}`}>
                <a className="btn btn-secondary w-full mb-4">
                  View Public Page
                </a>
              </Link>
              
              <button 
                onClick={logout}
                className="btn btn-outline w-full"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-display font-bold text-3xl">Dashboard</h1>
              
              {activeTab === 'links' && (
                <Link href="/dashboard/links/new">
                  <a className="btn btn-primary">
                    <FiPlus className="mr-2" />
                    Add Link
                  </a>
                </Link>
              )}
              
              {activeTab === 'products' && (
                <Link href="/dashboard/products/new">
                  <a className="btn btn-primary">
                    <FiPlus className="mr-2" />
                    Add Product
                  </a>
                </Link>
              )}
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-dark-700 mb-8">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-dark-600'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'links' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Your Links</h2>
                  
                  {links.length === 0 ? (
                    <div className="card p-12 text-center">
                      <FiLink className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No links yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Add your first link to get started
                      </p>
                      <Link href="/dashboard/links/new">
                        <a className="btn btn-primary">
                          <FiPlus className="mr-2" />
                          Add Link
                        </a>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {links.map((link) => (
                        <motion.div
                          key={link._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="card p-4 flex items-center justify-between"
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
                                <FiLink className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{link.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {link.url}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleLinkStatus(link._id, link.isActive)}
                              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                                link.isActive ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-700'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                  link.isActive ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            
                            <Link href={`/dashboard/links/${link._id}/edit`}>
                              <a className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700">
                                <FiSettings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              </a>
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteLink(link._id)}
                              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'products' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Your Products</h2>
                  
                  {products.length === 0 ? (
                    <div className="card p-12 text-center">
                      <FiShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No products yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Add your first product to get started
                      </p>
                      <Link href="/dashboard/products/new">
                        <a className="btn btn-primary">
                          <FiPlus className="mr-2" />
                          Add Product
                        </a>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="card overflow-hidden"
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
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => toggleProductStatus(product._id, product.isActive)}
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                                  product.isActive ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-700'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                    product.isActive ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              
                              <div className="flex space-x-2">
                                <Link href={`/dashboard/products/${product._id}/edit`}>
                                  <a className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700">
                                    <FiSettings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                  </a>
                                </Link>
                                
                                <button
                                  onClick={() => handleDeleteProduct(product._id)}
                                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Analytics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card p-6">
                      <h3 className="text-lg font-medium mb-2">Total Views</h3>
                      <p className="text-3xl font-bold">1,234</p>
                      <p className="text-green-500 text-sm mt-2">+12% from last month</p>
                    </div>
                    
                    <div className="card p-6">
                      <h3 className="text-lg font-medium mb-2">Link Clicks</h3>
                      <p className="text-3xl font-bold">567</p>
                      <p className="text-green-500 text-sm mt-2">+8% from last month</p>
                    </div>
                    
                    <div className="card p-6">
                      <h3 className="text-lg font-medium mb-2">Product Views</h3>
                      <p className="text-3xl font-bold">89</p>
                      <p className="text-red-500 text-sm mt-2">-3% from last month</p>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="text-lg font-medium mb-4">Traffic Sources</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      Analytics chart would be displayed here
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Settings</h2>
                  
                  <div className="card p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input 
                          type="text" 
                          defaultValue={user?.username}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <button className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card p-6 mb-6">
                    <h3 className="text-lg font-medium mb-4">Security</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.mfaEnabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                        <button className={`btn ${user?.mfaEnabled ? 'btn-secondary' : 'btn-primary'}`}>
                          {user?.mfaEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Change Password</h4>
                        <button className="btn btn-secondary">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card p-6">
                    <h3 className="text-lg font-medium mb-4">Appearance</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Theme</h4>
                        <div className="flex space-x-4">
                          <button className="p-4 rounded-lg border-2 border-primary-500 bg-white">
                            <span className="block mb-2">Light</span>
                            <div className="w-full h-12 bg-gray-200 rounded"></div>
                          </button>
                          <button className="p-4 rounded-lg border-2 border-gray-300 dark:border-dark-700 bg-dark-800">
                            <span className="block mb-2 text-white">Dark</span>
                            <div className="w-full h-12 bg-dark-700 rounded"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
