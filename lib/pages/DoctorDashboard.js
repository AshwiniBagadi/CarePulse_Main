"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const config_1 = require("../lib/firebase/config");
const SAMPLE_PATIENTS = [
    { id: 'p1', name: 'Rahul Sharma', age: 34, token: 23, symptoms: 'Chest pain, shortness of breath', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', checkedIn: true },
    { id: 'p2', name: 'Priya Patel', age: 28, token: 24, symptoms: 'Fever, cold, headache', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', checkedIn: true },
    { id: 'p3', name: 'Amit Kumar', age: 45, token: 25, symptoms: 'Joint pain in knee', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', checkedIn: false },
    { id: 'p4', name: 'Sunita Desai', age: 62, token: 26, symptoms: 'Skin rash on arms', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', checkedIn: false },
    { id: 'p5', name: 'Vikram Joshi', age: 38, token: 27, symptoms: 'Eye irritation, blurry vision', status: 'waiting', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', checkedIn: false },
];
function DoctorDashboard() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [doctor, setDoctor] = (0, react_1.useState)(null);
    const [patients, setPatients] = (0, react_1.useState)(SAMPLE_PATIENTS);
    const [currentPatient, setCurrentPatient] = (0, react_1.useState)(SAMPLE_PATIENTS[0]);
    const [isOnline, setIsOnline] = (0, react_1.useState)(true);
    const [notes, setNotes] = (0, react_1.useState)('');
    const [time, setTime] = (0, react_1.useState)(new Date());
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const unsubscribe = config_1.auth.onAuthStateChanged(async (firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
                return;
            }
            const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(config_1.db, 'users', firebaseUser.uid));
            if (userDoc.exists())
                setDoctor(userDoc.data());
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const handleComplete = () => {
        const remaining = patients.filter(p => p.id !== currentPatient.id);
        setPatients(remaining);
        setCurrentPatient(remaining[0] || null);
        setNotes('');
    };
    const handleSkip = () => {
        const rest = patients.filter(p => p.id !== currentPatient.id);
        setPatients([...rest, Object.assign(Object.assign({}, currentPatient), { status: 'skipped' })]);
        setCurrentPatient(rest[0] || null);
    };
    const handleLogout = async () => { await (0, auth_1.signOut)(config_1.auth); navigate('/'); };
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{ background: '#EFF6FF' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">👨‍⚕️</div>
          <div style={{ color: '#64748B' }}>Loading doctor dashboard...</div>
        </div>
      </div>);
    }
    return (<div style={{ background: '#EFF6FF', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1.5px solid #E0F2FE', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">🏥</span>
          <span className="font-bold text-lg" style={{ color: '#0D9488' }}>CarePulse AI</span>
          <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ background: '#CCFBF1', color: '#0D9488' }}>
            Doctor Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:block" style={{ color: '#94A3B8' }}>
            🕐 {time.toLocaleTimeString()}
          </span>

          {/* Online Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#64748B' }}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
            <button onClick={() => setIsOnline(!isOnline)} className="w-12 h-6 rounded-full transition-all relative" style={{ background: isOnline ? '#0D9488' : '#E2E8F0' }}>
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm" style={{ left: isOnline ? '26px' : '2px' }}/>
            </button>
          </div>

          <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ color: '#EF4444', border: '1.5px solid #FCA5A5' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Doctor Info */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #CCFBF1, #BAE6FD)' }}>
              👨‍⚕️
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0F172A', fontFamily: 'Plus Jakarta Sans' }}>
                Dr. {(doctor === null || doctor === void 0 ? void 0 : doctor.name) || 'Doctor'}
              </h1>
              <p style={{ color: '#64748B' }}>Cardiologist • CarePulse General Hospital</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            {[
            { label: 'Today', value: patients.length, icon: '👥', color: '#CCFBF1', text: '#0D9488' },
            { label: 'Completed', value: SAMPLE_PATIENTS.length - patients.length, icon: '✅', color: '#BAE6FD', text: '#0EA5E9' },
            { label: 'Avg Time', value: '12 min', icon: '⏱️', color: '#DDD6FE', text: '#7C3AED' },
        ].map((stat) => (<div key={stat.label} className="text-center px-5 py-3 rounded-2xl bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold" style={{ color: stat.text }}>{stat.value}</div>
                <div className="text-xs" style={{ color: '#94A3B8' }}>{stat.label}</div>
              </div>))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Current Patient */}
          <div className="lg:col-span-2 space-y-6">

            {currentPatient ? (<div className="rounded-3xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 24px rgba(13,148,136,0.12)', border: '2px solid #0D9488' }}>

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                  <div className="text-white font-semibold">🩺 Currently Serving</div>
                  <div className="text-white/80 text-sm">
                    Token #{currentPatient.token}
                  </div>
                </div>

                {/* Patient Info */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={currentPatient.avatar} alt={currentPatient.name} className="w-20 h-20 rounded-2xl object-cover" style={{ border: '3px solid #CCFBF1' }}/>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>
                        {currentPatient.name}
                      </h2>
                      <p style={{ color: '#64748B' }}>Age: {currentPatient.age} years</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#CCFBF1', color: '#0D9488' }}>
                          ✅ Checked In
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#BAE6FD', color: '#0EA5E9' }}>
                          Normal Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="p-4 rounded-2xl mb-4" style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
                    <div className="text-sm font-semibold mb-1" style={{ color: '#92400E' }}>
                      🤒 Reported Symptoms
                    </div>
                    <div style={{ color: '#78350F' }}>{currentPatient.symptoms}</div>
                  </div>

                  {/* AI Summary */}
                  <div className="p-4 rounded-2xl mb-4" style={{ background: '#DDD6FE', border: '1.5px solid #C4B5FD' }}>
                    <div className="text-sm font-semibold mb-1" style={{ color: '#5B21B6' }}>
                      🤖 AI Summary
                    </div>
                    <div className="text-sm" style={{ color: '#4C1D95' }}>
                      Patient reports {currentPatient.symptoms.toLowerCase()}.
                      Recommend standard examination and vitals check.
                    </div>
                  </div>

                  {/* Notes */}
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add consultation notes..." rows={3} className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none mb-4" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}/>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <button onClick={handleComplete} className="py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                      ✅ Complete
                    </button>
                    <button onClick={handleSkip} className="py-3 rounded-2xl font-semibold text-sm transition-all hover:shadow-md" style={{ background: '#FEF3C7', color: '#F59E0B', border: '1.5px solid #FDE68A' }}>
                      ⏭️ Skip
                    </button>
                    <button className="py-3 rounded-2xl font-semibold text-sm transition-all hover:shadow-md" style={{ background: '#FEE2E2', color: '#EF4444', border: '1.5px solid #FCA5A5' }}>
                      ⏸️ Pause
                    </button>
                  </div>
                </div>
              </div>) : (<div className="rounded-3xl p-12 text-center bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>All Done!</h2>
                <p style={{ color: '#64748B' }}>No more patients in queue</p>
              </div>)}
          </div>

          {/* Queue Panel */}
          <div className="space-y-4">
            <div className="rounded-3xl p-5 bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: '#0F172A' }}>Today's Queue</h3>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: '#CCFBF1', color: '#0D9488' }}>
                  {patients.length} waiting
                </span>
              </div>

              <div className="space-y-3">
                {patients.map((patient, index) => (<div key={patient.id} className="flex items-center gap-3 p-3 rounded-2xl transition-all" style={{
                background: (currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.id) === patient.id ? '#CCFBF1' : '#F8FAFC',
                border: `1.5px solid ${(currentPatient === null || currentPatient === void 0 ? void 0 : currentPatient.id) === patient.id ? '#0D9488' : '#E2E8F0'}`
            }}>
                    <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: '#0F172A' }}>
                        {patient.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: '#94A3B8' }}>
                        {patient.symptoms}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold" style={{ color: '#0D9488' }}>
                        #{patient.token}
                      </div>
                      <div className="w-2 h-2 rounded-full mt-1 mx-auto" style={{ background: patient.checkedIn ? '#0D9488' : '#E2E8F0' }}/>
                    </div>
                  </div>))}

                {patients.length === 0 && (<div className="text-center py-6 text-sm" style={{ color: '#94A3B8' }}>
                    No patients in queue
                  </div>)}
              </div>
            </div>

            {/* AI Predictions */}
            <div className="rounded-3xl p-5 bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
              <h3 className="font-bold mb-4" style={{ color: '#0F172A' }}>🤖 AI Predictions</h3>
              <div className="space-y-3">
                {[
            { label: 'Est. finish time', value: '2:30 PM', icon: '🕐' },
            { label: 'Avg consult time', value: '12 min', icon: '⏱️' },
            { label: 'Queue speed', value: 'Normal', icon: '📊' },
        ].map((item) => (<div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <span className="text-sm flex items-center gap-2" style={{ color: '#64748B' }}>
                      {item.icon} {item.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#0D9488' }}>{item.value}</span>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
exports.default = DoctorDashboard;
//# sourceMappingURL=DoctorDashboard.js.map