import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const WAITLIST_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdrmAvDt_Ja3BlNehbjlxxYaAS-J7USiR4GNzHWR8HpJOCXPA/viewform';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════
          HERO  –  blue gradient
      ═══════════════════════════════════════════ */}
      <section
        className="relative flex flex-col min-h-screen w-full overflow-hidden"
        style={{ background: 'linear-gradient(175deg, #dbeafe 0%, #bae6fd 48%, #7dd3fc 100%)' }}
      >
        {/* ── Minimal Nav ── */}
        <nav className="w-full flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-6 pb-2 z-10">
          <Link to="/">
            <img
              src="/glamflow-logo.jpeg"
              alt="GlamFlow"
              className="h-10 w-10 sm:h-11 sm:w-11 object-cover rounded-xl shadow-sm"
            />
          </Link>
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-700 bg-white/60 hover:bg-white/90 border border-white/80 backdrop-blur-sm rounded-full px-5 py-2 transition-all duration-200"
          >
            Log in →
          </a>
        </nav>

        {/* ── Hero Content ── */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-10 lg:px-16 py-16 w-full">

          {/* Coming soon badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/45 backdrop-blur-sm border border-white/60 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-blue-800 tracking-wide">Coming soon</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight"
          >
            Get early<br />access
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-gray-600 max-w-sm sm:max-w-md leading-relaxed"
          >
            We're getting close. Sign up to get early access to GlamFlow
            and start building your beauty business.
          </motion.p>

          {/* Join Waitlist button */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <a
              href={WAITLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-700 active:scale-95 text-white text-sm font-bold uppercase tracking-widest rounded-xl shadow-md transition-all duration-200"
            >
              Join Waitlist →
            </a>
          </motion.div>

        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full border-t border-blue-200/50"
        >
          <div className="max-w-xl mx-auto px-6 py-8 grid grid-cols-3 divide-x divide-blue-200/70">
            {[
              { value: '500+', label: 'Users' },
              { value: '1',    label: 'City' },
              { value: '4.8',  label: 'Rating' },
            ].map(stat => (
              <div key={stat.label} className="text-center px-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 sm:px-12 bg-white">
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Features designed<br />for your success.
            </h2>
            <p className="mt-4 text-base text-gray-400 max-w-sm leading-relaxed">
              Explore the features designed to keep you organised and on track.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Card 1 – Booking Management */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-3xl p-6 flex flex-col"
            >
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Booking Manager</span>
                </div>
                {[
                  { name: 'Bridal Makeup – Priya',  dot: 'bg-red-400',    time: '9:00 AM' },
                  { name: 'Nail Extension – Ankita', dot: 'bg-yellow-400', time: '2:30 PM' },
                  { name: 'Hair Color – Sneha',      dot: 'bg-green-400',  time: '5:00 PM' },
                  { name: 'Facial – Ritika',         dot: 'bg-red-400',    time: 'Tomorrow' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-t border-gray-50">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                    <p className="flex-1 text-[12px] font-semibold text-gray-700 truncate">{item.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-base font-bold text-gray-900">Booking Management</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                Stay on top of everything, from day-to-day to long-term projects.
              </p>
            </motion.div>

            {/* Card 2 – Client Management */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 rounded-3xl p-6 flex flex-col"
            >
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Client Manager</span>
                  </div>
                  <span className="text-[10px] text-blue-500 font-semibold">View all</span>
                </div>
                {[
                  { name: 'Priya Sharma',  tag: 'Regular', tc: 'text-green-700',  bg: 'bg-green-100' },
                  { name: 'Meena Gupta',   tag: 'New',     tc: 'text-blue-700',   bg: 'bg-blue-100'  },
                  { name: 'Ankita Das',    tag: 'VIP',     tc: 'text-yellow-700', bg: 'bg-yellow-100'},
                  { name: 'Ritika Joshi',  tag: 'Regular', tc: 'text-green-700',  bg: 'bg-green-100' },
                ].map(c => (
                  <div key={c.name} className="flex items-center gap-3 py-2.5 border-t border-gray-50">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                      {c.name[0]}
                    </div>
                    <p className="flex-1 text-[12px] font-semibold text-gray-700 truncate">{c.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${c.bg} ${c.tc}`}>{c.tag}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-base font-bold text-gray-900">Client Management</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                Build lasting relationships with every client you serve.
              </p>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          FOOTER  –  minimal, horizontal links only
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { label: 'Help Center',           href: '/help' },
            { label: 'Contact Us',            href: '/contactpage' },
            { label: 'Privacy Policy',        href: '/privacypolicy' },
            { label: 'Terms of Service',      href: '/termspage' },
            { label: 'Refund & Cancellation', href: '/refundpage' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}
