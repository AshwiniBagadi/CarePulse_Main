"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const config_1 = require("../lib/firebase/config");
const ThemeContext_1 = require("../ThemeContext");
const WhatsAppScanner_1 = __importDefault(require("../components/UI/WhatsAppScanner"));
function Dashboard() {
    var _a, _b;
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { theme, toggleTheme, t } = (0, ThemeContext_1.useTheme)();
    const [user, setUser] = (0, react_1.useState)(null);
    const [appointments, setAppointments] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [time, setTime] = (0, react_1.useState)(new Date());
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
    (0, react_1.useEffect)(() => {
        const unsubscribe = config_1.auth.onAuthStateChanged(async (firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
                return;
            }
            const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(config_1.db, 'users', firebaseUser.uid));
            if (userDoc.exists())
                setUser(userDoc.data());
            const q = (0, firestore_1.query)((0, firestore_1.collection)(config_1.db, 'appointments'), (0, firestore_1.where)('patientId', '==', firebaseUser.uid));
            (0, firestore_1.onSnapshot)(q, (snapshot) => {
                setAppointments(snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data()))));
                setLoading(false);
            });
        });
        return () => unsubscribe();
    }, []);
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const handleLogout = async () => { await (0, auth_1.signOut)(config_1.auth); navigate('/'); };
    const getGreeting = () => {
        const h = time.getHours();
        if (h < 12)
            return 'Good Morning';
        if (h < 17)
            return 'Good Afternoon';
        return 'Good Evening';
    };
    const activeAppt = appointments.find(a => ['booked', 'checkedIn', 'waiting', 'serving'].includes(a.status));
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🏥</div>
          <div style={{ color: subtext }}>Loading your dashboard...</div>
        </div>
      </div>);
    }
    return (<div style={{ background: bg, minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: navBg, borderBottom: `1.5px solid ${border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏥</span>
          <span className="font-bold text-lg" style={{ color: accent }}>CarePulse AI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm hidden md:block" style={{ color: subtext }}>
            🕐 {time.toLocaleTimeString()}
          </span>
          <button onClick={toggleTheme} className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all" style={{ background: accentBg, color: accent, border: `1.5px solid ${border}` }}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: gradientBg }}>
            {((_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a[0]) || 'U'}
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ color: '#EF4444', border: '1.5px solid #FCA5A5' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            {getGreeting()}, {(_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.split(' ')[0]} 👋
          </h1>
          <p className="mt-1" style={{ color: subtext }}>
            {time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Active Appointment */}
        {activeAppt ? (<div className="rounded-3xl p-6 mb-8 text-white" style={{ background: gradientBg, boxShadow: '0 8px 40px rgba(13,148,136,0.25)' }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">🟢 Active Appointment</div>
                <div className="text-4xl font-bold" style={{ fontFamily: 'JetBrains Mono' }}>
                  Token #{activeAppt.tokenNumber || '—'}
                </div>
                <div className="text-white/70 text-sm mt-1 capitalize">Status: {activeAppt.status}</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold" style={{ fontFamily: 'JetBrains Mono' }}>
                  {activeAppt.estimatedWait || '—'}
                </div>
                <div className="text-white/70 text-sm">mins wait</div>
              </div>
              <button onClick={() => navigate('/queue')} className="px-6 py-3 rounded-2xl font-semibold transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                Track Queue →
              </button>
            </div>
          </div>) : (<div className="rounded-3xl p-8 mb-8 text-center" style={{ background: cardBg, border: `2px dashed ${border}` }}>
            <div className="text-5xl mb-3">📅</div>
            <div className="font-semibold mb-1" style={{ color: text }}>No active appointments</div>
            <div className="text-sm mb-5" style={{ color: subtext }}>Book an appointment to get started</div>
            <button onClick={() => navigate('/book')} className="px-6 py-3 rounded-2xl text-white font-semibold transition-all hover:shadow-lg hover:scale-105" style={{ background: gradientBg }}>
              Book Appointment
            </button>
          </div>)}

        {/* Quick Actions */}
        <h2 className="font-bold text-lg mb-4" style={{ color: text }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '📅', label: 'Book Appointment', path: '/book' },
            { icon: '🛏️', label: 'Bed Booking', path: '/beds' },
            { icon: '🎫', label: 'My Queue', path: '/queue' },
            { icon: '🏛️', label: 'Govt Schemes', path: '/schemes' },
            { icon: '👨‍⚕️', label: 'Doctor Portal', path: '/doctor' },
            { icon: '📊', label: 'Admin Portal', path: '/admin' },
            { icon: '🤖', label: 'AI Symptom', path: '/chat' },
            { icon: '🚨', label: 'Emergency', path: '/emergency' },
        ].map((action) => (<button key={action.label} onClick={() => navigate(action.path)} className="p-5 rounded-2xl text-center transition-all hover:shadow-md hover:-translate-y-1" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3" style={{ background: accentBg }}>
                {action.icon}
              </div>
              <div className="text-sm font-semibold" style={{ color: text }}>{action.label}</div>
            </button>))}
        </div>

        {/* Appointment History */}
        {/* WhatsApp Assistant */}
    <h2 className="font-bold text-lg mb-4" style={{ color: '#0F172A' }}>
  💬 WhatsApp Assistant
    </h2>
    <WhatsAppScanner_1.default />
        {appointments.length === 0 ? (<div className="rounded-2xl p-10 text-center" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
            <div className="text-4xl mb-3">📋</div>
            <div style={{ color: subtext }}>No appointments yet</div>
          </div>) : (<div className="space-y-3">
            {appointments.map((appt) => (<div key={appt.id} className="flex items-center justify-between p-5 rounded-2xl" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: accentBg }}>
                    🏥
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: text }}>
                      Token #{appt.tokenNumber || '—'}
                    </div>
                    <div className="text-sm mt-0.5" style={{ color: subtext }}>
                      {appt.symptoms || 'No symptoms noted'}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                    background: appt.status === 'completed' ? accentBg : '#FEF3C7',
                    color: appt.status === 'completed' ? accent : '#F59E0B'
                }}>
                  {appt.status}
                </span>
              </div>))}
          </div>)}
      </div>
    </div>);
}
exports.default = Dashboard;
//# sourceMappingURL=dashboard.js.map