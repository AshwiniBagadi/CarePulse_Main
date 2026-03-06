"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const firestore_1 = require("firebase/firestore");
const config_1 = require("../lib/firebase/config");
function QueueTracker() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [appointment, setAppointment] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [currentTime, setCurrentTime] = (0, react_1.useState)(new Date());
    (0, react_1.useEffect)(() => {
        const unsubscribe = config_1.auth.onAuthStateChanged((firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
                return;
            }
            const q = (0, firestore_1.query)((0, firestore_1.collection)(config_1.db, 'appointments'), (0, firestore_1.where)('patientId', '==', firebaseUser.uid), (0, firestore_1.where)('status', 'in', ['booked', 'checkedIn', 'waiting', 'serving']));
            (0, firestore_1.onSnapshot)(q, (snapshot) => {
                if (!snapshot.empty) {
                    setAppointment(Object.assign({ id: snapshot.docs[0].id }, snapshot.docs[0].data()));
                }
                setLoading(false);
            });
        });
        return () => unsubscribe();
    }, []);
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    const getUrgencyColor = (mins) => {
        if (mins <= 5)
            return '#EF4444';
        if (mins <= 15)
            return '#F59E0B';
        return '#0D9488';
    };
    const getUrgencyBg = (mins) => {
        if (mins <= 5)
            return '#FEF2F2';
        if (mins <= 15)
            return '#FFFBEB';
        return '#F0FDFA';
    };
    const getStatusLabel = (status) => {
        if (status === 'serving')
            return '🟢 You are being served now!';
        if (status === 'checkedIn')
            return '✅ Checked in — waiting for turn';
        if (status === 'waiting')
            return '⏳ In queue — please wait';
        return '📅 Appointment booked';
    };
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{ background: '#EFF6FF' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🏥</div>
          <div style={{ color: '#64748B' }}>Loading queue status...</div>
        </div>
      </div>);
    }
    if (!appointment) {
        return (<div className="min-h-screen flex items-center justify-center" style={{ background: '#EFF6FF' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>No Active Queue</h2>
          <p className="mb-6" style={{ color: '#64748B' }}>You don't have any active appointments</p>
          <button onClick={() => navigate('/book')} className="px-6 py-3 rounded-2xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
            Book Appointment
          </button>
        </div>
      </div>);
    }
    const wait = appointment.estimatedWait || 0;
    const token = appointment.tokenNumber || 0;
    const position = appointment.position || 3;
    const totalQueue = 12;
    const progress = Math.max(0, Math.min(100, ((totalQueue - position) / totalQueue) * 100));
    return (<div style={{ background: '#EFF6FF', minHeight: '100vh' }}>

      {/* Header */}
      <div className="bg-white sticky top-0 z-50 px-6 py-4 flex items-center gap-4" style={{ borderBottom: '1.5px solid #E0F2FE', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <button onClick={() => navigate('/dashboard')} className="text-sm font-medium transition-colors" style={{ color: '#64748B' }}>
          ← Dashboard
        </button>
        <h1 className="font-bold text-lg" style={{ color: '#0F172A' }}>Live Queue Tracker</h1>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#CCFBF1', color: '#0D9488' }}>
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"/>
          LIVE
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Token Card */}
        <div className="rounded-3xl p-8 text-center bg-white" style={{
            border: `2px solid ${getUrgencyColor(wait)}30`,
            boxShadow: `0 8px 40px ${getUrgencyColor(wait)}20`
        }}>
          <div className="text-sm font-semibold mb-2" style={{ color: '#64748B' }}>
            YOUR TOKEN NUMBER
          </div>
          <div className="text-8xl font-bold mb-2" style={{ color: getUrgencyColor(wait), fontFamily: 'JetBrains Mono' }}>
            #{token}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: getUrgencyBg(wait), color: getUrgencyColor(wait) }}>
            {getStatusLabel(appointment.status)}
          </div>
        </div>

        {/* Wait Time Card */}
        <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)', boxShadow: '0 8px 40px rgba(13,148,136,0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/70 text-sm">Estimated Wait Time</div>
              <div className="text-5xl font-bold mt-1" style={{ fontFamily: 'JetBrains Mono' }}>
                {wait} <span className="text-2xl text-white/70">min</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-white/70 text-sm">Queue Position</div>
              <div className="text-5xl font-bold mt-1" style={{ fontFamily: 'JetBrains Mono' }}>
                #{position}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Queue Progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: 'white' }}/>
            </div>
          </div>
          <div className="text-white/60 text-xs text-center">
            {position} patients ahead of you
          </div>
        </div>

        {/* Queue Visual */}
        <div className="rounded-3xl p-6 bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
          <div className="font-bold mb-4" style={{ color: '#0F172A' }}>Queue Visualization</div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: totalQueue }, (_, i) => {
            const tokenPos = i + 1;
            const isServing = tokenPos === 1;
            const isYou = tokenPos === position;
            const isDone = tokenPos < position && !isServing;
            return (<div key={i} className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all" style={{
                    background: isServing ? '#0D9488' : isYou ? '#0EA5E9' : isDone ? '#F1F5F9' : '#EFF6FF',
                    color: isServing || isYou ? 'white' : isDone ? '#94A3B8' : '#475569',
                    border: isYou ? '2px solid #0EA5E9' : '1.5px solid #E2E8F0',
                    transform: isYou ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isYou ? '0 4px 16px rgba(14,165,233,0.3)' : 'none'
                }}>
                  {isYou ? 'YOU' : isServing ? '🩺' : tokenPos}
                </div>);
        })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: '#64748B' }}>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: '#0D9488' }}/>
              Serving now
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: '#0EA5E9' }}/>
              Your position
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: '#F1F5F9' }}/>
              Completed
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="rounded-3xl p-6 bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
          <div className="font-bold mb-4" style={{ color: '#0F172A' }}>Appointment Details</div>
          <div className="space-y-3">
            {[
            { icon: '🏥', label: 'Hospital', value: 'CarePulse General Hospital' },
            { icon: '🏨', label: 'Department', value: appointment.departmentId || 'General Medicine' },
            { icon: '🕐', label: 'Time Slot', value: appointment.slot || 'Morning' },
            { icon: '📅', label: 'Date', value: appointment.date || 'Today' },
            { icon: '🤒', label: 'Symptoms', value: appointment.symptoms || 'Not specified' },
        ].map((item) => (<div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  <span>{item.icon}</span>
                  {item.label}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{item.value}</span>
              </div>))}
          </div>
        </div>

        {/* QR Check In */}
        {appointment.status === 'booked' && (<div className="rounded-3xl p-6 text-center bg-white" style={{ border: '2px dashed #0D9488' }}>
            <div className="text-4xl mb-3">📱</div>
            <div className="font-bold mb-1" style={{ color: '#0F172A' }}>Scan QR to Check In</div>
            <div className="text-sm mb-4" style={{ color: '#64748B' }}>
              Arrive at hospital and scan the QR code to activate your queue position
            </div>
            <button className="px-6 py-3 rounded-2xl text-white font-semibold transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
              📷 Open QR Scanner
            </button>
          </div>)}

        {/* Nearby Hospital Suggestion */}
        {wait > 20 && (<div className="rounded-3xl p-5 bg-white" style={{ border: '1.5px solid #FDE68A', background: '#FFFBEB' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#92400E' }}>
                  Shorter wait nearby!
                </div>
                <div className="text-sm mb-3" style={{ color: '#78350F' }}>
                  City Medical Center (2.1km away) has only 8 min wait time
                </div>
                <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#F59E0B' }}>
                  View Hospital →
                </button>
              </div>
            </div>
          </div>)}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="py-4 rounded-2xl font-semibold text-sm transition-all hover:shadow-md" style={{ background: 'white', color: '#EF4444', border: '1.5px solid #FCA5A5' }}>
            ❌ Cancel Appointment
          </button>
          <button className="py-4 rounded-2xl font-semibold text-sm text-white transition-all hover:shadow-md" style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
            📞 Call Hospital
          </button>
        </div>

      </div>
    </div>);
}
exports.default = QueueTracker;
//# sourceMappingURL=QueueTraker.js.map