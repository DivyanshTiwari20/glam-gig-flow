import { motion } from 'framer-motion';
import { Star } from 'lucide-react'; // Or your icon library

// Your AnimatedSection component (can be in this file or imported)
const AnimatedSection = ({ children, className = "", id = "" }) => (
  <motion.section
    id={id}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ staggerChildren: 0.15 }}
  >
    {children}
  </motion.section>
);

// Animation variants for the staggered children
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
      <AnimatedSection className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2">
                <img
                  src="/glamflow-logo.jpeg"
                  alt="GlamFlow Logo"
                  className="w-12 h-12 rounded-xl object-contain"
                />
                {/* <span className="text-xl font-bold text-white">GlamFlow</span> */}
              </div>
              <p className="mt-4 text-gray-400 max-w-md">
                Empowering beauty freelancers with the tools they need to build successful, sustainable businesses.
              </p>
              {/* <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
                  <Star className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors">
                  <Star className="w-5 h-5" />
                </a>
              </div> */}
            </motion.div>

            <motion.div variants={itemVariants}>
              {/* <h3 className="text-lg font-semibold text-white mb-4">Product</h3> */}
              <div className="space-y-3">
                {/* <a href="#features" className="block hover:text-pink-500 transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-pink-500 transition-colors">Pricing</a> */}
                {/* <a href="/security" className="block hover:text-pink-500 transition-colors">Security</a>
                <a href="/updates" className="block hover:text-pink-500 transition-colors">Updates</a> */}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <div className="space-y-3">
                <a href="/help" className="block hover:text-pink-500 transition-colors">Help Center</a>
                <a href="/contactpage" className="block hover:text-pink-500 transition-colors">Contact Us</a>
                <a href="/privacypolicy" className="block hover:text-pink-500 transition-colors">Privacy Policy</a>
                <a href="/termspage" className="block hover:text-pink-500 transition-colors">Terms of Service</a>
                <a href="/refundpage" className="block hover:text-pink-500 transition-colors">Refund & cancellation</a>
              </div>
            </motion.div>
          </div>

          <hr className="my-8 border-gray-800" />

          <p className="text-center text-gray-500">
            © 2025 GlamFlow. All rights reserved. Built for beauty professionals. Powered by Aksus Studios.
          </p>
        </div>
      </AnimatedSection>
    </footer>
  );
}