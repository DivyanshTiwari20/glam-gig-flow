import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';

const PromoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Side - Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 p-6 sm:p-8 md:p-12 flex items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-0"
                >
                  <div className="relative">
                    {/* Decorative circles */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-white rounded-full blur-3xl"
                    />

                    {/* Main image/icon */}
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', duration: 0.8 }}
                      className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 flex items-center justify-center">
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 text-pink-500" />
                        </motion.div>
                      </div>

                      {/* Floating badges */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-yellow-400 text-yellow-900 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg transform rotate-12"
                      >
                        100% FREE
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-green-400 text-green-900 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg transform -rotate-12"
                      >
                        Limited Offer
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="p-6 sm:p-8 md:p-12 flex flex-col justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-4">
                      🎉 EXCLUSIVE LAUNCH OFFER
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                      Get Pro Plan for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">FREE!</span>
                    </h2>

                    <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                      We're offering our <strong>Pro Plan</strong> absolutely free for the first <strong>30 days</strong>. This is a limited-time opportunity to unlock premium features at no cost!
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-start sm:items-center gap-2 sm:gap-3"
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">Profile recommendation & visibility</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-start sm:items-center gap-2 sm:gap-3"
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">Unlimited Client Booking</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-start sm:items-center gap-2 sm:gap-3"
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">Permium looking presonal Website</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex items-start sm:items-center gap-2 sm:gap-3"
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">24/7 priority support</span>
                      </motion.div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/auth'}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      Claim Your Free Pro Plan
                    </motion.button>

                    <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                      No credit card required • Cancel anytime
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PromoModal;