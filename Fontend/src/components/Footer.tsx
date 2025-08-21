import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/integrations', label: 'Integrations' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Blog' },
        { href: '/careers', label: 'Careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { href: '/docs', label: 'Documentation' },
        { href: '/support', label: 'Support' },
        { href: '/api', label: 'API' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/cookies', label: 'Cookie Policy' },
      ],
    },
  ];

  const socialLinks = [
    { href: 'https://github.com', icon: <FiGithub className="w-5 h-5" />, label: 'GitHub' },
    { href: 'https://twitter.com', icon: <FiTwitter className="w-5 h-5" />, label: 'Twitter' },
    { href: 'https://linkedin.com', icon: <FiLinkedin className="w-5 h-5" />, label: 'LinkedIn' },
    { href: 'mailto:contact@multilink.com', icon: <FiMail className="w-5 h-5" />, label: 'Email' },
  ];

  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">M</span>
              </motion.div>
              <span className="font-display font-bold text-2xl">MultiLink</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Create your personalized link page and digital products showcase. 
              Connect with your audience in one place.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full neumorphic dark:neumorphic-dark text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-dark-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} MultiLink. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy">
              <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                Terms of Service
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
