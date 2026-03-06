"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const config_1 = require("../lib/firebase/config");
const ThemeContext_1 = require("../ThemeContext");
function Auth() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { theme, t } = (0, ThemeContext_1.useTheme)();
    const [isLogin, setIsLogin] = (0, react_1.useState)(true);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [form, setForm] = (0, react_1.useState)({
        name: '', email: '', password: '', phone: '',
        role: 'patient'
    });
    const bg = t('#FDF8F3', '#0F1117');
    const cardBg = t('#FFFFFF', '#1A1D27');
    const border = t('#E8E0D5', '#2A2D3A');
    const text = t('#1A1A2E', '#F0F4FF');
    const subtext = t('#6B7280', '#9CA3AF');
    const inputBg = t('#F8FAFC', '#13161F');
    const gradientBg = theme === 'light'
        ? 'linear-gradient(135deg, #0D9488, #0EA5E9)'
        : 'linear-gradient(135deg, #06B6D4, #3B82F6)';
    const handleChange = (e) => {
        setForm(Object.assign(Object.assign({}, form), { [e.target.name]: e.target.value }));
        setError('');
    };
    const redirectByRole = (role) => {
        navigate(role === 'doctor' ? '/doctor' : role === 'admin' ? '/admin' : '/dashboard');
    };
    const handleEmailAuth = async () => {
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                const result = await (0, auth_1.signInWithEmailAndPassword)(config_1.auth, form.email, form.password);
                const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(config_1.db, 'users', result.user.uid));
                redirectByRole(userDoc.exists() ? userDoc.data().role : 'patient');
            }
            else {
                const result = await (0, auth_1.createUserWithEmailAndPassword)(config_1.auth, form.email, form.password);
                await (0, firestore_1.setDoc)((0, firestore_1.doc)(config_1.db, 'users', result.user.uid), {
                    uid: result.user.uid,
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    role: form.role,
                    createdAt: new Date()
                });
                redirectByRole(form.role);
            }
        }
        catch (err) {
            setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)/, ''));
        }
        setLoading(false);
    };
    const handleGoogle = async () => {
        setLoading(true);
        try {
            const provider = new auth_1.GoogleAuthProvider();
            const result = await (0, auth_1.signInWithPopup)(config_1.auth, provider);
            const userRef = (0, firestore_1.doc)(config_1.db, 'users', result.user.uid);
            const userDoc = await (0, firestore_1.getDoc)(userRef);
            if (!userDoc.exists()) {
                await (0, firestore_1.setDoc)(userRef, {
                    uid: result.user.uid,
                    name: result.user.displayName,
                    email: result.user.email,
                    phone: '',
                    role: 'patient',
                    createdAt: new Date()
                });
            }
            redirectByRole(userDoc.exists() ? userDoc.data().role : 'patient');
        }
        catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };
    return (<div className="min-h-screen flex" style={{ background: bg }}>

      {/* Left Panel */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-12" style={{ background: gradientBg }}>
        <div className="text-white mb-8">
          <div className="text-4xl mb-4">🏥</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Skip the Queue,<br />Not the Care
          </h2>
          <p className="text-white/80 text-lg">
            AI-powered hospital queue management that saves hours of your time.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: '⚡', text: 'Real-time queue tracking' },
            { icon: '🤖', text: 'AI wait time prediction' },
            { icon: '📱', text: 'WhatsApp notifications' },
            { icon: '🏛️', text: 'Government scheme auto-apply' },
        ].map((item) => (<div key={item.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.2)' }}>
                {item.icon}
              </div>
              <span className="text-white/90 font-medium">{item.text}</span>
            </div>))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="md:hidden text-center mb-8">
            <span className="text-3xl">🏥</span>
            <h1 className="text-xl font-bold mt-1" style={{ color: t('#0D9488', '#22D3EE') }}>
              CarePulse AI
            </h1>
          </div>

          <div className="rounded-3xl p-8 shadow-xl" style={{ background: cardBg, border: `1.5px solid ${border}` }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
              {isLogin ? 'Welcome back 👋' : 'Create account'}
            </h2>
            <p className="text-sm mb-6" style={{ color: subtext }}>
              {isLogin ? 'Login to your CarePulse account' : 'Join CarePulse AI today'}
            </p>

            {/* Tabs */}
            <div className="flex rounded-2xl p-1 mb-6" style={{ background: t('#F1F5F9', '#0F1117') }}>
              {['Login', 'Register'].map((tab) => (<button key={tab} onClick={() => { setIsLogin(tab === 'Login'); setError(''); }} className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all" style={{
                background: (isLogin ? tab === 'Login' : tab === 'Register')
                    ? gradientBg : 'transparent',
                color: (isLogin ? tab === 'Login' : tab === 'Register')
                    ? 'white' : subtext
            }}>
                  {tab}
                </button>))}
            </div>

            <div className="space-y-4">
              {!isLogin && (<input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}/>)}
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}/>
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}/>
              {!isLogin && (<>
                  <input name="phone" placeholder="Phone Number (+91)" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}/>
                  <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl outline-none text-sm" style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}>
                    <option value="patient">🧑‍⚕️ Patient</option>
                    <option value="doctor">👨‍⚕️ Doctor</option>
                    <option value="admin">🏥 Hospital Admin</option>
                  </select>
                </>)}

              {error && (<div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444' }}>
                  ⚠️ {error}
                </div>)}

              <button onClick={handleEmailAuth} disabled={loading} className="w-full py-3 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50" style={{ background: gradientBg }}>
                {loading ? '⏳ Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: border }}/>
                <span className="text-xs" style={{ color: subtext }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: border }}/>
              </div>

              <button onClick={handleGoogle} disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-3" style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}>
                <span className="text-lg font-bold" style={{ color: t('#0EA5E9', '#22D3EE') }}>G</span>
                Continue with Google
              </button>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: subtext }}>
            By continuing you agree to CarePulse AI Terms of Service
          </p>
        </div>
      </div>
    </div>);
}
exports.default = Auth;
//# sourceMappingURL=Auth.js.map