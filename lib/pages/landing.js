"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const ThemeContext_1 = require("../ThemeContext");
const WhatsAppSection_1 = __importDefault(require("../components/UI/WhatsAppSection"));
function Landing() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { theme, toggleTheme, t } = (0, ThemeContext_1.useTheme)();
    const bg = t('#FDF8F3', '#0F1117');
    const cardBg = t('#FFFFFF', '#1A1D27');
    const border = t('#E8E0D5', '#2A2D3A');
    const text = t('#1A1A2E', '#F0F4FF');
    const subtext = t('#6B7280', '#9CA3AF');
    const accent = t('#0D9488', '#22D3EE');
    const accentBg = t('#F0FDFA', '#0E2A35');
    const navBg = t('#FFFFFF', '#13161F');
    const gradientBg = theme === 'light'
        ? 'linear-gradient(135deg, #0D9488, #0EA5E9)'
        : 'linear-gradient(135deg, #06B6D4, #3B82F6)';
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el)
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    return (<div style={{ background: bg, minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 sticky top-0 z-50" style={{ background: navBg, borderBottom: `1.5px solid ${border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
          <span className="text-2xl">🏥</span>
          <span className="font-bold text-xl" style={{ color: accent }}>CarePulse AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', id: 'features' },
            { label: 'Hospitals', id: 'hospitals' },
            { label: 'Schemes', id: 'schemes' },
            { label: 'WhatsApp', id: 'whatsapp' },
            { label: 'About', id: 'about' },
        ].map(link => (<button key={link.label} onClick={() => scrollTo(link.id)} className="text-sm font-medium transition-all hover:opacity-100" style={{ color: subtext, background: 'none', border: 'none', cursor: 'pointer' }}>
              {link.label}
            </button>))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all" style={{ background: accentBg, color: accent, border: `1.5px solid ${border}` }}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ color: accent, border: `1.5px solid ${accent}`, background: 'transparent' }}>
            Login
          </button>
          <button onClick={() => navigate('/register')} className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105" style={{ background: gradientBg }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div id="hero" className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: accentBg, color: accent, border: `1px solid ${accent}30` }}>
            🚀 AI-Powered Healthcare Queue System
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            Skip the Queue,<br />
            <span style={{ color: accent }}>Not the Care</span>
          </h1>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: subtext }}>
            CarePulse AI reduces hospital waiting time from hours to minutes using
            real-time queue tracking, AI predictions, and WhatsApp notifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:shadow-xl hover:scale-105" style={{ background: gradientBg }}>
              Book Appointment Free 🏥
            </button>
            <button onClick={() => scrollTo('whatsapp')} className="px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-md" style={{ border: `2px solid ${accent}`, color: accent, background: 'transparent' }}>
              📲 WhatsApp Demo
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-3xl opacity-30" style={{ background: gradientBg, transform: 'rotate(6deg)' }}/>
            <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8" style={{ background: cardBg, boxShadow: '0 24px 80px rgba(0,0,0,0.12)', border: `1px solid ${border}` }}>
              <div className="text-6xl mb-4">🏥</div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: accent, fontFamily: 'JetBrains Mono' }}>
                  Token #24
                </div>
                <div className="text-sm mb-3" style={{ color: subtext }}>Your position in queue</div>
                <div className="w-full rounded-full h-3 mb-2" style={{ background: border }}>
                  <div className="h-3 rounded-full" style={{ width: '65%', background: gradientBg }}/>
                </div>
                <div className="text-xs font-medium" style={{ color: accent }}>~14 minutes remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 gap-6">
          {[
            { number: '10,000+', label: 'Patients Served', icon: '👥' },
            { number: '50+', label: 'Hospitals', icon: '🏥' },
            { number: '4 min', label: 'Avg Wait Time', icon: '⏱️' },
        ].map((stat) => (<div key={stat.label} className="text-center p-6 rounded-2xl transition-all hover:shadow-md" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1" style={{ color: accent, fontFamily: 'Plus Jakarta Sans' }}>
                {stat.number}
              </div>
              <div className="text-sm" style={{ color: subtext }}>{stat.label}</div>
            </div>))}
        </div>
      </div>

      {/* ── Features ── */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: accentBg, color: accent, border: `1px solid ${accent}30` }}>
            ✨ Platform Features
          </div>
          <h2 className="text-4xl font-bold mb-3" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            Everything You Need
          </h2>
          <p style={{ color: subtext }}>Built for patients, doctors, and hospital admins</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Wait Prediction', desc: 'Know your exact wait time before leaving home. 87% accuracy with confidence intervals.' },
            { icon: '📱', title: 'WhatsApp Updates', desc: 'Real-time notifications when your turn is near. Works on any phone, no app needed.' },
            { icon: '📍', title: 'GPS Auto Check-In', desc: 'Auto check-in when you arrive within 200m of hospital. Zero effort required.' },
            { icon: '🏛️', title: 'Govt Schemes', desc: 'Auto-apply PM-JAY, Ayushman Bharat, CGHS. Save thousands on medical bills.' },
            { icon: '🚨', title: 'Emergency Priority', desc: 'Emergency patients get instant queue jump. SOS button available on every screen.' },
            { icon: '📊', title: 'Live Queue Tracker', desc: 'See real-time position from your phone. Live countdown timer synced with hospital.' },
        ].map((f) => (<div key={f.title} className="p-6 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: accentBg }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: text }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: subtext }}>{f.desc}</p>
            </div>))}
        </div>
      </div>

      {/* ── Hospitals ── */}
      <div id="hospitals" className="py-16" style={{ background: theme === 'light' ? '#F8FAFC' : '#13161F' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: accentBg, color: accent, border: `1px solid ${accent}30` }}>
              🏥 Partner Hospitals
            </div>
            <h2 className="text-4xl font-bold mb-3" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
              50+ Hospitals Across Maharashtra
            </h2>
            <p style={{ color: subtext }}>Real-time queue data from all partner hospitals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { name: 'CarePulse General Hospital', city: 'Pune', crowd: 'low', wait: 8, rating: 4.8, beds: 12, photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80' },
            { name: 'City Medical Center', city: 'Mumbai', crowd: 'medium', wait: 18, rating: 4.6, beds: 5, photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80' },
            { name: 'Apollo CarePulse', city: 'Nagpur', crowd: 'high', wait: 35, rating: 4.5, beds: 2, photo: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&q=80' },
        ].map((h) => {
            const crowdColor = h.crowd === 'low' ? '#0D9488' : h.crowd === 'medium' ? '#F59E0B' : '#EF4444';
            const crowdBg = h.crowd === 'low' ? '#CCFBF1' : h.crowd === 'medium' ? '#FEF3C7' : '#FEE2E2';
            return (<div key={h.name} className="rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={h.photo} alt={h.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}/>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: crowdBg, color: crowdColor }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: crowdColor }}/>
                      {h.crowd} crowd
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                      ⏱ ~{h.wait} min
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-bold mb-1" style={{ color: text }}>{h.name}</div>
                    <div className="text-sm mb-2" style={{ color: subtext }}>📍 {h.city}, Maharashtra</div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-yellow-500">⭐ {h.rating}</div>
                      <div className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: accentBg, color: accent }}>
                        {h.beds} beds free
                      </div>
                    </div>
                    <button onClick={() => navigate('/register')} className="w-full mt-3 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md" style={{ background: gradientBg }}>
                      Book Appointment →
                    </button>
                  </div>
                </div>);
        })}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => navigate('/register')} className="px-8 py-3 rounded-2xl font-semibold text-sm transition-all hover:shadow-md" style={{ border: `1.5px solid ${accent}`, color: accent, background: 'transparent' }}>
              View All 50+ Hospitals →
            </button>
          </div>
        </div>
      </div>

      {/* ── Govt Schemes ── */}
      <div id="schemes" className="py-16" style={{ background: theme === 'light' ? '#F0FDFA' : '#0E2A35' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: cardBg, color: accent, border: `1px solid ${accent}30` }}>
            🏛️ Government Integration
          </div>
          <h2 className="text-4xl font-bold mb-3" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            Government Scheme Integration
          </h2>
          <p className="mb-10 text-lg" style={{ color: subtext }}>
            Auto-detect your eligible schemes and apply them instantly — save thousands on medical bills
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
            { name: 'PM-JAY', full: 'Pradhan Mantri Jan Arogya Yojana', color: '#F59E0B', bg: '#FEF3C7', benefit: '₹5 Lakh/year' },
            { name: 'Ayushman Bharat', full: 'Health & Wellness Centres', color: '#0D9488', bg: '#CCFBF1', benefit: 'Free OPD' },
            { name: 'CGHS', full: 'Central Govt Health Scheme', color: '#0EA5E9', bg: '#BAE6FD', benefit: 'Unlimited' },
            { name: 'ESIC', full: 'Employees State Insurance', color: '#7C3AED', bg: '#EDE9FE', benefit: 'Full Coverage' },
            { name: 'MJPJAY', full: 'Maharashtra State Scheme', color: '#EF4444', bg: '#FEE2E2', benefit: '₹1.5 Lakh/year' },
            { name: 'NHM', full: 'National Health Mission', color: '#10B981', bg: '#D1FAE5', benefit: 'Free Services' },
        ].map((s) => (<div key={s.name} className="p-4 rounded-2xl text-left transition-all hover:shadow-md" style={{ background: cardBg, border: `1.5px solid ${s.color}30` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: s.bg, color: s.color }}>✓</div>
                  <div className="font-bold text-sm" style={{ color: s.color }}>{s.name}</div>
                </div>
                <div className="text-xs mb-1" style={{ color: subtext }}>{s.full}</div>
                <div className="text-sm font-bold" style={{ color: text }}>{s.benefit}</div>
              </div>))}
          </div>
          <button onClick={() => navigate('/schemes')} className="px-8 py-3 rounded-2xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105" style={{ background: gradientBg }}>
            Check Your Eligibility →
          </button>
        </div>
      </div>

      {/* ── WhatsApp Section ── */}
      <div id="whatsapp">
        <WhatsAppSection_1.default />
      </div>

      {/* ── How It Works ── */}
      <div id="about" className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ background: accentBg, color: accent, border: `1px solid ${accent}30` }}>
            🔄 Simple Process
          </div>
          <h2 className="text-4xl font-bold mb-3" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            How It Works
          </h2>
          <p style={{ color: subtext }}>3 simple steps to skip the queue</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', icon: '📱', title: 'Book Online', desc: 'Select hospital, department, doctor and slot in under 2 minutes' },
            { step: '02', icon: '📍', title: 'GPS Check-In', desc: 'Auto check-in activates when you enter 200m radius of hospital' },
            { step: '03', icon: '🔔', title: 'Get Notified', desc: 'Receive WhatsApp alerts when your turn is near. Never miss your slot!' },
        ].map((item, i) => (<div key={item.step} className="text-center p-6 rounded-2xl relative" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
              {i < 2 && (<div className="hidden md:block absolute top-1/2 -right-4 text-2xl z-10" style={{ color: accent }}>→</div>)}
              <div className="text-5xl font-black mb-3" style={{ color: accentBg, fontFamily: 'Plus Jakarta Sans', WebkitTextStroke: `2px ${accent}` }}>
                {item.step}
              </div>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2" style={{ color: text }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: subtext }}>{item.desc}</p>
            </div>))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="py-16" style={{ background: theme === 'light' ? '#F8FAFC' : '#13161F' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
              What Patients Say
            </h2>
            <p style={{ color: subtext }}>Real experiences from real patients</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { name: 'Priya S.', city: 'Pune', rating: 5, text: 'Saved 2 hours of waiting! Got WhatsApp alert exactly when my turn was near. Amazing app!' },
            { name: 'Rahul M.', city: 'Mumbai', rating: 5, text: 'PM-JAY scheme was auto-detected and applied. Saved ₹3,200 on my OPD visit. Truly helpful!' },
            { name: 'Sunita P.', city: 'Nagpur', rating: 5, text: 'My elderly mother used it easily. The GPS check-in worked perfectly when we reached hospital.' },
        ].map((t2) => (<div key={t2.name} className="p-5 rounded-2xl" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
                <div className="text-yellow-400 text-lg mb-3">{'⭐'.repeat(t2.rating)}</div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: subtext }}>"{t2.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: gradientBg }}>
                    {t2.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: text }}>{t2.name}</div>
                    <div className="text-xs" style={{ color: subtext }}>📍 {t2.city}</div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-20 text-center" style={{ background: gradientBg }}>
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          Ready to Skip the Queue?
        </h2>
        <p className="text-white/80 mb-8 text-lg">Join 10,000+ patients already using CarePulse AI</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/register')} className="px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:scale-105" style={{ background: cardBg, color: accent }}>
            Get Started Free 🚀
          </button>
          <button onClick={() => scrollTo('whatsapp')} className="px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white' }}>
            📲 Try WhatsApp Bot
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="py-10 border-t" style={{ background: navBg, borderColor: border }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏥</span>
              <span className="font-bold text-lg" style={{ color: accent }}>CarePulse AI</span>
            </div>
            <div className="flex gap-6">
              {[
            { label: 'Features', id: 'features' },
            { label: 'Hospitals', id: 'hospitals' },
            { label: 'Schemes', id: 'schemes' },
            { label: 'WhatsApp', id: 'whatsapp' },
        ].map(link => (<button key={link.label} onClick={() => scrollTo(link.id)} className="text-sm transition-all hover:opacity-80" style={{ color: subtext, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {link.label}
                </button>))}
            </div>
            <p className="text-sm text-center" style={{ color: subtext }}>
              Emergency? Call <span className="font-bold" style={{ color: '#EF4444' }}>108</span> &nbsp;|&nbsp;
              CarePulse AI © 2026 &nbsp;|&nbsp; Made with ❤️ for India
            </p>
          </div>
        </div>
      </div>
    </div>);
}
exports.default = Landing;
//# sourceMappingURL=landing.js.map