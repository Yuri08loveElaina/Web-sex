import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiLink, FiShoppingBag, FiUser, FiCheck } from 'react-icons/fi';
import Background3D from '../components/Background3D';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card3D from '../components/Card3D';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: <FiLink className="w-8 h-8 text-primary-600" />,
      title: 'Multiple Links',
      description: 'Share all your important links in one place. Customize and organize them to match your style.',
    },
    {
      icon: <FiShoppingBag className="w-8 h-8 text-primary-600" />,
      title: 'Digital Products',
      description: 'Showcase and sell your digital products directly from your profile page.',
    },
    {
      icon: <FiUser className="w-8 h-8 text-primary-600" />,
      title: 'Personal Branding',
      description: 'Create a unique online presence that represents you and your brand.',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Content Creator',
      content: 'MultiLink has transformed how I share my content with my audience. Everything in one place!',
    },
    {
      name: 'Sarah Williams',
      role: 'Digital Artist',
      content: 'Selling my digital art has never been easier. The platform is intuitive and beautiful.',
    },
    {
      name: 'Michael Chen',
      role: 'Entrepreneur',
      content: 'The perfect solution for my personal branding needs. Highly recommended!',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      features: [
        'Up to 5 links',
        '1 digital product',
        'Basic analytics',
        'Standard themes',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9',
      period: '/month',
      features: [
        'Unlimited links',
        '10 digital products',
        'Advanced analytics',
        'Custom themes',
        'Remove branding',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited links',
        'Unlimited digital products',
        'Team collaboration',
        'White-label option',
        'API access',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Background3D />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                className="font-display font-bold text-4xl md:text-6xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                All Your Links & Products in{' '}
                <span className="text-transparent bg-clip-text gradient-bg">One Place</span>
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Create a beautiful, customizable page to share your links and sell your digital products. 
                Join thousands of creators, entrepreneurs, and businesses.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/register">
                  <a className="btn btn-primary text-lg px-8 py-3">
                    Get Started Free
                    <FiArrowRight className="ml-2" />
                  </a>
                </Link>
                <Link href="/demo">
                  <a className="btn btn-secondary text-lg px-8 py-3">
                    View Demo
                  </a>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-dark-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.h2
                className="font-display font-bold text-3xl md:text-4xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Everything You Need to Succeed
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Powerful features designed to help you grow your online presence and increase your revenue.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card3D className="p-8 h-full">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.h2
                className="font-display font-bold text-3xl md:text-4xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Loved by Thousands
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                See what our users have to say about their experience with MultiLink.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card3D className="p-8 h-full">
                    <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50 dark:bg-dark-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.h2
                className="font-display font-bold text-3xl md:text-4xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Simple, Transparent Pricing
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Choose the plan that works best for you. Upgrade or downgrade at any time.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <Card3D className={`p-8 h-full ${plan.popular ? 'border-2 border-primary-500' : ''}`}>
                    <h3 className="font-display font-bold text-2xl mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="font-display font-bold text-4xl">{plan.price}</span>
                      {plan.period && <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>}
                    </div>
                    
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={plan.name === 'Business' ? '/contact' : '/register'}>
                      <a
                        className={`btn w-full ${
                          plan.popular ? 'btn-primary' : 'btn-secondary'
                        }`}
                      >
                        {plan.cta}
                      </a>
                    </Link>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="gradient-bg rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of creators, entrepreneurs, and businesses who are already using MultiLink to grow their online presence.
              </p>
              <Link href="/register">
                <a className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Create Your Free Account
                </a>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
