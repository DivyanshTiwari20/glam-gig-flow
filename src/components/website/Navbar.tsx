import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Assuming you use lucide-react for icons
import { Button } from '@/components/ui/button'; // Assuming a component library

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Your provided JSX code goes here
  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 mx-2 mt-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-1 bg-white/90 shadow-lg border-b border-white/20 rounded-2xl overflow-hidden">
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo-1.png" alt="GlamFlow Logo" className="h-14 w-auto object-contain" />
          </Link>
        </motion.div>

        {/* Desktop Nav Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600">
          {[
            { label: 'About', href: '/about' },
            { label: 'Pricing', href: '/pricing' },
            // { label: 'Talk to Manno', href: 'https://kaya-eight.vercel.app/', external: true },
            { label: 'Contact', href: '/contactpage' },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="relative font-medium transition-colors duration-300 hover:text-pink-600"
              whileHover={{ y: -2 }}
            // rel={item.external ? 'noopener noreferrer' : ''}
            >
              {item.label}
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                style={{ originX: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="hidden md:block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = "/auth"}
            >
              Join Us
            </Button>
          </motion.div>
          <motion.div
            className="md:hidden"
            whileHover={{ rotate: 90 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 cursor-pointer" /> : <Menu className="w-6 h-6 cursor-pointer" />}
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu (Animated dropdown) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -20,
          transitionEnd: {
            display: mobileMenuOpen ? 'block' : 'none',
          },
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden absolute top-full left-2 right-2 z-40 mt-2 px-3 pb-4 pt-2 bg-white/95 rounded-b-2xl shadow-lg shadow-pink-100/40 max-w-screen overflow-hidden"
      >
        {[
          { label: 'About', href: '/about' },
          { label: 'Pricing', href: '/pricing' },
          // { label: 'Talk to Manno', href: 'https://kaya-eight.vercel.app/', external: true },
          { label: 'Contact', href: '/contactpage' },
        ].map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-4 font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ opacity: 0.7 }}
          // rel={item.external ? 'noopener noreferrer' : ''}
          >
            {item.label}
          </motion.a>
        ))}
      </motion.div>
    </motion.nav>
  );
}