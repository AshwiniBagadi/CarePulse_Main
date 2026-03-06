import { useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'
import WhatsAppSection from '../components/UI/WhatsAppSection'
import { motion } from 'framer-motion'
import BlurText from '../components/BlurText'
import Masonry from '../components/Masonry'
import GooeyNav from '../components/GooeyNav'
import {
  HeartPulse, Activity, ArrowRight, Bell,
  Building, CalendarCheck, CheckCircle2, Clock, MapPin,
  ShieldCheck, Smartphone, Star, Users, Zap, AlertTriangle
} from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggleTheme, t } = useTheme()

  const bg = t('#FAFAFA', '#09090B')
  const cardBg = t('rgba(255, 255, 255, 0.7)', 'rgba(24, 24, 27, 0.6)')
  const border = t('rgba(228, 228, 231, 0.5)', 'rgba(63, 63, 70, 0.4)')
  const text = t('#09090B', '#FAFAFA')
  const subtext = t('#71717A', '#A1A1AA')
  const accent = t('#0F766E', '#14B8A6')
  const accentBg = t('rgba(204, 251, 241, 0.5)', 'rgba(19, 78, 74, 0.3)')
  const navBg = t('rgba(250, 250, 250, 0.8)', 'rgba(9, 9, 11, 0.8)')
  const gradientBg = theme === 'light'
    ? 'linear-gradient(135deg, #0D9488, #0EA5E9)'
    : 'linear-gradient(135deg, #0D9488, #3B82F6)'

  const reveal = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }} className="relative overflow-hidden">
      {/* Ambient gradients */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: theme === 'light' ? 'rgba(14,165,233,0.22)' : 'rgba(34,211,238,0.18)' }}
        animate={{ x: [0, 40, 0], y: [0, 22, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-44 -right-40 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ background: theme === 'light' ? 'rgba(13,148,136,0.18)' : 'rgba(59,130,246,0.18)' }}
        animate={{ x: [0, -36, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300"
        style={{
          background: navBg,
          borderBottom: `1px solid ${border}`,
          boxShadow: theme === 'light' ? '0 10px 40px -10px rgba(0,0,0,0.05)' : '0 10px 40px -10px rgba(0,0,0,0.2)'
        }}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => scrollTo('hero')}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight ml-1" style={{ color: text }}>CarePulse<span style={{ color: accent }}>AI</span></span>
        </div>
        <div className="hidden md:flex items-center" style={{ '--nav-blob-bg': accentBg, '--nav-active-text': text } as React.CSSProperties}>
          <GooeyNav
            items={[
              { label: 'Features', href: '#features' },
              { label: 'Hospitals', href: '#hospitals' },
              { label: 'Schemes', href: '#schemes' },
              { label: 'WhatsApp', href: '#whatsapp' },
              { label: 'About', href: '#about' },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme}
            className="p-2 rounded-xl transition-all hover:scale-105"
            style={{ background: cardBg, color: subtext, border: `1px solid ${border}` }}>
            {theme === 'light' ? <Star size={18} /> : <Zap size={18} />}
          </button>
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: text }}>
            Login
          </button>
          <button onClick={() => navigate('/register')}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: gradientBg, boxShadow: theme === 'light' ? '0 10px 25px -5px rgba(13, 148, 136, 0.4)' : '0 10px 25px -5px rgba(20, 184, 166, 0.4)' }}>
            Get Started
          </button>
        </div>
      </nav>
      {/* ── Hero ── */}
      <div id="hero" className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="flex-1 text-center md:text-left"
        >
          <motion.div variants={reveal} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-md"
            style={{ background: accentBg, color: accent, border: `1px solid ${border}` }}>
            <Activity size={16} className="animate-pulse" />
            AI-Powered Healthcare Queue System
          </motion.div>
          <motion.h1 variants={reveal} className="text-6xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
            style={{ fontFamily: 'Plus Jakarta Sans' }}>
            <span style={{ color: text }} className="block">
              <BlurText text="Skip the Queue," delay={50} animateBy="words" direction="top" />
            </span>
            <span style={{ color: accent }} className="block mt-2">
              <BlurText text="Not the Care." delay={50} animateBy="words" direction="top" />
            </span>
          </motion.h1>
          <motion.p variants={reveal} className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto md:mx-0" style={{ color: subtext }}>
            CarePulse AI reduces hospital waiting time from hours to minutes using
            real-time queue tracking, AI predictions, and WhatsApp notifications.
          </motion.p>
          <motion.div variants={reveal} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 group"
              style={{ background: gradientBg, boxShadow: theme === 'light' ? '0 20px 40px -10px rgba(13, 148, 136, 0.4)' : '0 20px 40px -10px rgba(20, 184, 166, 0.3)' }}>
              <span>Book Appointment Free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollTo('whatsapp')}
              className="px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm hover:shadow-lg"
              style={{ background: cardBg, border: `1px solid ${border}`, color: text }}>
              <Smartphone size={20} style={{ color: accent }} />
              WhatsApp Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="flex-1 flex justify-center w-full"
        >
          <div className="relative w-full max-w-md aspect-square">
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-[2.5rem] opacity-35"
              style={{ background: gradientBg, filter: 'blur(30px)' }}
              animate={{ rotate: [6, 10, 6], scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-4 rounded-[2rem] flex flex-col items-center justify-center p-8 backdrop-blur-2xl"
              style={{ background: cardBg, boxShadow: '0 24px 80px rgba(0,0,0,0.12)', border: `1px solid ${border}` }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30 mb-6">
                <Building className="text-white" size={40} />
              </div>
              <div className="text-center w-full">
                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight" style={{ color: text, fontFamily: 'JetBrains Mono' }}>
                  Token <span style={{ color: accent }}>#24</span>
                </div>
                <div className="text-base mb-6 font-medium" style={{ color: subtext }}>Your position in queue</div>
                <div className="w-full rounded-full h-4 mb-3 overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: gradientBg }}
                    initial={{ width: '22%' }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
                <div className="text-sm font-semibold flex items-center justify-center gap-2" style={{ color: accent }}>
                  <Clock size={16} />
                  ~14 minutes remaining
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-5xl mx-auto px-6 mb-20 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { number: '10,000+', label: 'Patients Served', icon: <Users size={28} style={{ color: accent }} /> },
            { number: '50+', label: 'Hospitals', icon: <Building size={28} style={{ color: accent }} /> },
            { number: '4 min', label: 'Avg Wait Time', icon: <Clock size={28} style={{ color: accent }} /> },
          ].map((stat) => (
            <motion.div
              variants={reveal}
              whileHover={{ y: -6, scale: 1.02 }}
              key={stat.label}
              className="text-center p-8 rounded-[2rem] transition-all shadow-sm backdrop-blur-md"
              style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-transform"
                style={{ background: accentBg }}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2 tracking-tight" style={{ color: accent, fontFamily: 'Plus Jakarta Sans' }}>
                {stat.number}
              </div>
              <div className="text-base font-medium" style={{ color: subtext }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Features ── */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-md"
            style={{ background: accentBg, color: accent, border: `1px solid ${border}` }}>
            <Star size={16} />
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            Everything You Need
          </h2>
          <p className="text-lg md:text-xl" style={{ color: subtext }}>Built for patients, doctors, and hospital admins</p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {[
            { icon: <Activity size={24} />, title: 'AI Wait Prediction', desc: 'Know your exact wait time before leaving home. 87% accuracy with confidence intervals.' },
            { icon: <Bell size={24} />, title: 'WhatsApp Updates', desc: 'Real-time notifications when your turn is near. Works on any phone, no app needed.' },
            { icon: <MapPin size={24} />, title: 'GPS Auto Check-In', desc: 'Auto check-in when you arrive within 200m of hospital. Zero effort required.' },
            { icon: <ShieldCheck size={24} />, title: 'Govt Schemes', desc: 'Auto-apply PM-JAY, Ayushman Bharat, CGHS. Save thousands on medical bills.' },
            { icon: <AlertTriangle size={24} />, title: 'Emergency Priority', desc: 'Emergency patients get instant queue jump. SOS button available on every screen.' },
            { icon: <Clock size={24} />, title: 'Live Queue Tracker', desc: 'See real-time position from your phone. Live countdown timer synced with hospital.' },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={reveal}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-8 rounded-[2rem] transition-all shadow-sm backdrop-blur-md hover:shadow-xl group"
              style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                style={{ background: accentBg, color: accent }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 tracking-tight" style={{ color: text }}>{f.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: subtext }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Hospitals ── */}
      <div id="hospitals" className="py-20 relative z-10"
        style={{ background: theme === 'light' ? 'rgba(248, 250, 252, 0.5)' : 'rgba(19, 22, 31, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-md"
              style={{ background: accentBg, color: accent, border: `1px solid ${border}` }}>
              <Building size={16} />
              Partner Hospitals
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
              50+ Hospitals Across Maharashtra
            </h2>
            <p className="text-lg md:text-xl" style={{ color: subtext }}>Real-time queue data from all partner hospitals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'CarePulse General Hospital', city: 'Pune', crowd: 'low', wait: 8, rating: 4.8, beds: 12, photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80' },
              { name: 'City Medical Center', city: 'Mumbai', crowd: 'medium', wait: 18, rating: 4.6, beds: 5, photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80' },
              { name: 'Apollo CarePulse', city: 'Nagpur', crowd: 'high', wait: 35, rating: 4.5, beds: 2, photo: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&q=80' },
            ].map((h) => {
              const crowdColor = h.crowd === 'low' ? '#10B981' : h.crowd === 'medium' ? '#F59E0B' : '#EF4444'
              const crowdBg = h.crowd === 'low' ? 'rgba(16, 185, 129, 0.15)' : h.crowd === 'medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'
              return (
                <div key={h.name} className="rounded-[2rem] overflow-hidden transition-all shadow-sm backdrop-blur-md hover:shadow-xl hover:-translate-y-2 group"
                  style={{ background: cardBg, border: `1px solid ${border}` }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={h.photo} alt={h.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10"
                      style={{ background: crowdBg, color: crowdColor }}>
                      <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ background: crowdColor }} />
                      <span className="capitalize">{h.crowd} crowd</span>
                    </div>
                    <div className="absolute bottom-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md border border-white/10 flex items-center gap-1.5"
                      style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                      <Clock size={14} />
                      ~{h.wait} min
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-bold text-xl mb-1 tracking-tight" style={{ color: text }}>{h.name}</div>
                    <div className="text-sm mb-4 flex items-center gap-1.5" style={{ color: subtext }}>
                      <MapPin size={14} /> {h.city}, Maharashtra
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium flex items-center gap-1 text-yellow-500">
                        <Star size={14} className="fill-current" /> {h.rating}
                      </div>
                      <div className="text-xs px-3 py-1 rounded-full font-semibold border"
                        style={{ background: accentBg, color: accent, borderColor: 'transparent' }}>
                        {h.beds} beds free
                      </div>
                    </div>
                    <button onClick={() => navigate('/register')}
                      className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                      style={{ background: gradientBg }}>
                      <span>Book Appointment</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 mx-auto hover:-translate-y-1 hover:shadow-md"
              style={{ border: `2px solid ${accent}`, color: accent, background: 'transparent' }}>
              <span>View All 50+ Hospitals</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Govt Schemes ── */}
      <div id="schemes" className="py-20 relative z-10"
        style={{ background: theme === 'light' ? 'rgba(204, 251, 241, 0.3)' : 'rgba(19, 78, 74, 0.15)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-md"
            style={{ background: cardBg, color: accent, border: `1px solid ${border}` }}>
            <ShieldCheck size={16} />
            Government Integration
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            Government Scheme Integration
          </h2>
          <p className="mb-12 text-lg md:text-xl max-w-2xl mx-auto" style={{ color: subtext }}>
            Auto-detect your eligible schemes and apply them instantly — save thousands on medical bills
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { name: 'PM-JAY', full: 'Pradhan Mantri Jan Arogya Yojana', color: '#F59E0B', bg: theme === 'light' ? '#FEF3C7' : 'rgba(245, 158, 11, 0.15)', benefit: '₹5 Lakh/year' },
              { name: 'Ayushman Bharat', full: 'Health & Wellness Centres', color: '#10B981', bg: theme === 'light' ? '#D1FAE5' : 'rgba(16, 185, 129, 0.15)', benefit: 'Free OPD' },
              { name: 'CGHS', full: 'Central Govt Health Scheme', color: '#0EA5E9', bg: theme === 'light' ? '#BAE6FD' : 'rgba(14, 165, 233, 0.15)', benefit: 'Unlimited' },
              { name: 'ESIC', full: 'Employees State Insurance', color: '#8B5CF6', bg: theme === 'light' ? '#EDE9FE' : 'rgba(139, 92, 246, 0.15)', benefit: 'Full Coverage' },
              { name: 'MJPJAY', full: 'Maharashtra State Scheme', color: '#EF4444', bg: theme === 'light' ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)', benefit: '₹1.5 Lakh/year' },
              { name: 'NHM', full: 'National Health Mission', color: '#14B8A6', bg: theme === 'light' ? '#CCFBF1' : 'rgba(20, 184, 166, 0.15)', benefit: 'Free Services' },
            ].map((s) => (
              <div key={s.name} className="p-6 rounded-[2rem] text-left transition-all shadow-sm backdrop-blur-md hover:shadow-xl hover:-translate-y-1"
                style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: s.bg, color: s.color }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-lg" style={{ color: s.color }}>{s.name}</div>
                    <div className="text-sm font-bold mt-0.5" style={{ color: text }}>{s.benefit}</div>
                  </div>
                </div>
                <div className="text-sm" style={{ color: subtext }}>{s.full}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/schemes')}
            className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 mx-auto group hover:shadow-2xl hover:-translate-y-1"
            style={{ background: gradientBg }}>
            <span>Check Your Eligibility</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── WhatsApp Section ── */}
      <div id="whatsapp">
        <WhatsAppSection />
      </div>

      {/* ── How It Works ── */}
      <div id="about" className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-md"
            style={{ background: accentBg, color: accent, border: `1px solid ${border}` }}>
            <Activity size={16} />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            How It Works
          </h2>
          <p className="text-lg md:text-xl" style={{ color: subtext }}>3 simple steps to skip the queue</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-0.5"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />

          {[
            { step: '01', icon: <Smartphone size={32} />, title: 'Book Online', desc: 'Select hospital, department, doctor and slot in under 2 minutes' },
            { step: '02', icon: <MapPin size={32} />, title: 'GPS Check-In', desc: 'Auto check-in activates when you enter 200m radius of hospital' },
            { step: '03', icon: <Bell size={32} />, title: 'Get Notified', desc: 'Receive WhatsApp alerts when your turn is near. Never miss your slot!' },
          ].map((item, i) => (
            <div key={item.step} className="text-center p-8 rounded-[2.5rem] relative transition-all shadow-sm backdrop-blur-md hover:shadow-xl hover:-translate-y-2 group"
              style={{ background: cardBg, border: `1px solid ${border}` }}>
              <div className="relative z-10 w-20 h-20 mx-auto bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-xl border-4"
                style={{ borderColor: cardBg }}>
                <div className="text-transparent bg-clip-text font-black group-hover:scale-110 transition-transform flex items-center justify-center"
                  style={{ backgroundImage: gradientBg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <div style={{ WebkitTextFillColor: accent }}>{item.icon}</div>
                </div>
              </div>
              <div className="absolute top-4 right-6 text-7xl font-black opacity-5 pointer-events-none transition-opacity group-hover:opacity-10"
                style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
                {item.step}
              </div>
              <h3 className="font-bold text-2xl mb-3 tracking-tight" style={{ color: text }}>{item.title}</h3>
              <p className="text-base leading-relaxed" style={{ color: subtext }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="py-20 relative z-10" style={{ background: theme === 'light' ? 'rgba(248, 250, 252, 0.5)' : 'rgba(19, 22, 31, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
              What Patients Say
            </h2>
            <p className="text-lg md:text-xl" style={{ color: subtext }}>Real experiences from real patients</p>
          </div>
          <div className="h-[400px] w-full mt-8">
            <Masonry
              items={[
                { id: 1, height: 350, content: { name: 'Priya S.', city: 'Pune', rating: 5, text: 'Saved 2 hours of waiting! Got WhatsApp alert exactly when my turn was near. Amazing app!' } },
                { id: 2, height: 400, content: { name: 'Rahul M.', city: 'Mumbai', rating: 5, text: 'PM-JAY scheme was auto-detected and applied. Saved ₹3,200 on my OPD visit. Truly helpful! The GPS check in is magic.' } },
                { id: 3, height: 320, content: { name: 'Sunita P.', city: 'Nagpur', rating: 5, text: 'My elderly mother used it easily. The GPS check-in worked perfectly when we reached hospital.' } },
                { id: 4, height: 440, content: { name: 'Amit K.', city: 'Nashik', rating: 4, text: 'The interface is so clean. I love knowing exactly when to leave my house. No more sitting in crowded waiting rooms for half the day!' } },
                { id: 5, height: 380, content: { name: 'Dr. Sharma', city: 'Pune', rating: 5, text: 'As a doctor, it helps manage patient expectations so much better. Our waiting room is significantly less crowded now.' } },
                { id: 6, height: 340, content: { name: 'Neha V.', city: 'Thane', rating: 5, text: 'Live queue tracking is a lifesaver with a toddler. Highly recommend CarePulse AI.' } },
              ].map(item => ({
                id: item.id,
                height: item.height,
                img: `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='${theme === 'light' ? '%23FFFFFF' : '%231A1D27'}' opacity='${theme === 'light' ? '0.7' : '0.6'}' rx='32' ry='32' stroke='${theme === 'light' ? '%23E4E4E7' : '%233F3F46'}' stroke-width='2' stroke-opacity='0.5' /%3E%3CforeignObject x='32' y='32' width='calc(100%25 - 64px)' height='calc(100%25 - 64px)'%3E%3Cdiv xmlns='http://www.w3.org/1999/xhtml' style='font-family: sans-serif; color: ${encodeURIComponent(theme === 'light' ? '#71717A' : '#A1A1AA')}; font-size: 16px; line-height: 1.6; height: 100%25; display: flex; flex-direction: column;'%3E%3Cdiv style='color: %23EAB308; margin-bottom: 24px; font-size: 18px;'%3E${'★'.repeat(item.content.rating)}%3C/div%3E%3Cp style='margin-bottom: 32px; font-style: italic; flex-grow: 1;'%3E%22${encodeURIComponent(item.content.text)}%22%3C/p%3E%3Cdiv style='display: flex; align-items: center; gap: 16px;'%3E%3Cdiv style='width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, %230D9488, %230EA5E9); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'%3E${item.content.name[0]}%3C/div%3E%3Cdiv%3E%3Cdiv style='font-weight: bold; color: ${encodeURIComponent(theme === 'light' ? '#09090B' : '#FAFAFA')}; font-size: 16px;'%3E${encodeURIComponent(item.content.name)}%3C/div%3E%3Cdiv style='font-size: 14px; margin-top: 4px;'%3E%F0%9F%93%8D ${encodeURIComponent(item.content.city)}%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/foreignObject%3E%3C/svg%3E`
              }))}
              scaleOnHover={true}
              blurToFocus={true}
              stagger={0.1}
              hoverScale={1.03}
              ease="back.out(1.4)"
            />
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-24 text-center relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-90" style={{ background: gradientBg }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

        <div className="relative max-w-4xl mx-auto px-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-2xl">
            <Activity className="text-white" size={40} />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Ready to Skip the Queue?
          </h2>
          <p className="text-white/90 mb-10 text-xl max-w-2xl mx-auto">
            Join 10,000+ patients already using CarePulse AI to save time and get better care.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button onClick={() => navigate('/register')}
              className="px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center justify-center gap-2"
              style={{ background: cardBg, color: accent }}>
              <span>Get Started Free</span>
              <ArrowRight size={20} />
            </button>
            <button onClick={() => scrollTo('whatsapp')}
              className="px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Smartphone size={20} />
              <span>Try WhatsApp Bot</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="py-12 border-t mt-auto relative z-10" style={{ background: navBg, borderColor: border }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => scrollTo('hero')}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md group-hover:scale-105 transition-transform">
                <HeartPulse className="text-white" size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight ml-1" style={{ color: text }}>CarePulse<span style={{ color: accent }}>AI</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Hospitals', id: 'hospitals' },
                { label: 'Schemes', id: 'schemes' },
                { label: 'WhatsApp', id: 'whatsapp' },
              ].map(link => (
                <button key={link.label}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm font-medium transition-all hover:opacity-100 hover:-translate-y-0.5"
                  style={{ color: subtext, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm" style={{ color: subtext }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:shadow-md" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                <AlertTriangle size={16} />
                <span>Emergency? Call <span className="font-bold">108</span></span>
              </div>
              <p className="flex items-center gap-1 font-medium">
                CarePulse AI © 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}