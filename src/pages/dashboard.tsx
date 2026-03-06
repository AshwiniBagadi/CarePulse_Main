import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../lib/firebase/config'
import { useTheme } from '../ThemeContext'
import WhatsAppScanner from '../components/UI/WhatsAppScanner'
import { 
  HeartPulse, Sun, Moon, LogOut, Calendar, Bed, 
  MapPin, ShieldCheck, UserCircle, Settings, MessageSquare, 
  AlertTriangle, FileText, Clock, Activity, ArrowRight, Building
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { theme, toggleTheme, t } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())

  const bg =       t('#FDF8F3', '#0F1117')
  const cardBg =   t('#FFFFFF', '#1A1D27')
  const border =   t('#E8E0D5', '#2A2D3A')
  const text =     t('#1A1A2E', '#F0F4FF')
  const subtext =  t('#6B7280', '#9CA3AF')
  const accent =   t('#0D9488', '#22D3EE')
  const accentBg = t('#F0FDFA', '#0E2A35')
  const navBg =    t('#FFFFFF', '#13161F')
  const gradientBg = theme === 'light'
    ? 'linear-gradient(135deg, #0D9488, #0EA5E9)'
    : 'linear-gradient(135deg, #06B6D4, #3B82F6)'

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) { navigate('/login'); return }
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) setUser(userDoc.data())
      const q = query(collection(db, 'appointments'), where('patientId', '==', firebaseUser.uid))
      onSnapshot(q, (snapshot) => {
        setAppointments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      })
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => { await signOut(auth); navigate('/') }

  const getGreeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const activeAppt = appointments.find(a =>
    ['booked', 'checkedIn', 'waiting', 'serving'].includes(a.status)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🏥</div>
          <div style={{ color: subtext }}>Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl transition-all duration-300"
        style={{
          background: navBg,
          borderBottom: `1px solid ${border}`,
          boxShadow: theme === 'light' ? '0 10px 40px -10px rgba(0,0,0,0.05)' : '0 10px 40px -10px rgba(0,0,0,0.2)'
        }}>
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight ml-1" style={{ color: text }}>CarePulse<span style={{ color: accent }}>AI</span></span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-sm hidden md:block font-medium" style={{ color: subtext, fontFamily: 'JetBrains Mono' }}>
            <Clock size={16} className="inline mr-1" />
            {time.toLocaleTimeString()}
          </span>
          <button onClick={toggleTheme}
            className="p-2 rounded-xl transition-all hover:scale-105"
            style={{ background: cardBg, color: subtext, border: `1px solid ${border}` }}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md text-base"
            style={{ background: gradientBg }}>
            {user?.name?.[0] || 'U'}
          </div>
          <button onClick={handleLogout}
            className="p-2 md:px-4 md:py-2 rounded-xl text-sm font-medium transition-all hover:bg-red-50 hover:border-red-200 flex items-center gap-2"
            style={{ color: '#EF4444', border: '1px solid currentColor', background: 'transparent' }}>
            <LogOut size={16} />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1" style={{ color: subtext }}>
            {time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Active Appointment */}
        {activeAppt ? (
          <div className="rounded-[2rem] p-8 mb-10 text-white relative overflow-hidden transition-all hover:shadow-2xl"
            style={{ background: gradientBg, boxShadow: theme === 'light' ? '0 20px 40px -10px rgba(13, 148, 136, 0.4)' : '0 20px 40px -10px rgba(20, 184, 166, 0.3)' }}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="flex items-center justify-between flex-wrap gap-6 relative z-10">
              <div>
                <div className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                  Active Appointment
                </div>
                <div className="text-5xl md:text-6xl font-black tracking-tight" style={{ fontFamily: 'JetBrains Mono' }}>
                  Token #{activeAppt.tokenNumber || '—'}
                </div>
                <div className="text-white/80 text-base mt-2 font-medium capitalize flex items-center gap-2">
                  <Activity size={16} /> Status: {activeAppt.status}
                </div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-5xl font-black mb-1" style={{ fontFamily: 'JetBrains Mono' }}>
                  {activeAppt.estimatedWait || '—'}
                </div>
                <div className="text-white/80 text-sm font-semibold tracking-wider uppercase">mins wait</div>
              </div>
              <button onClick={() => navigate('/queue')}
                className="px-6 py-4 rounded-2xl font-bold transition-all hover:scale-105 flex items-center gap-2 shadow-lg backdrop-blur-sm group"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                <span>Track Queue</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] p-10 mb-10 text-center shadow-sm backdrop-blur-md transition-all hover:shadow-xl hover:-translate-y-1"
            style={{ background: cardBg, border: `1.5px dashed ${border}` }}>
            <div className="w-20 h-20 mx-auto bg-teal-50 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-teal-100 dark:border-teal-800">
              <Calendar className="text-teal-600 dark:text-teal-400" size={40} />
            </div>
            <div className="text-2xl font-bold mb-2 tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>No active appointments</div>
            <div className="text-base mb-8" style={{ color: subtext }}>Book an appointment to get started</div>
            <button onClick={() => navigate('/book')}
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1 inline-flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
              style={{ background: gradientBg }}>
              <Calendar size={20} />
              <span>Book Appointment</span>
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-4 flex items-center gap-2">
          <Activity size={20} style={{ color: accent }} />
          <h2 className="font-bold text-xl tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { icon: <Calendar size={24} />, label: 'Book Appointment', path: '/book' },
            { icon: <Bed size={24} />, label: 'Bed Booking', path: '/beds' },
            { icon: <FileText size={24} />, label: 'My Queue', path: '/queue' },
            { icon: <ShieldCheck size={24} />, label: 'Govt Schemes', path: '/schemes' },
            { icon: <UserCircle size={24} />, label: 'Doctor Portal', path: '/doctor' },
            { icon: <Settings size={24} />, label: 'Admin Portal', path: '/admin' },
            { icon: <MessageSquare size={24} />, label: 'AI Symptom', path: '/chat' },
            { icon: <AlertTriangle size={24} />, label: 'Emergency', path: '/emergency' },
          ].map((action) => (
            <button key={action.label} onClick={() => navigate(action.path)}
              className="p-6 rounded-[2rem] text-center transition-all bg-white dark:bg-zinc-900 border backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1"
              style={{ background: cardBg, borderColor: border }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
                style={{ background: accentBg, color: accent }}>
                {action.icon}
              </div>
              <div className="text-sm font-bold tracking-tight" style={{ color: text }}>{action.label}</div>
            </button>
          ))}
        </div>

        {/* Appointment History */}
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare size={20} style={{ color: accent }} />
          <h2 className="font-bold text-xl tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            WhatsApp Assistant
          </h2>
        </div>
        <div className="mb-12">
          <WhatsAppScanner />
        </div>
        
        <div className="mb-4 flex items-center gap-2">
          <FileText size={20} style={{ color: accent }} />
          <h2 className="font-bold text-xl tracking-tight" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            Recent Appointments
          </h2>
        </div>
        {appointments.length === 0 ? (
          <div className="rounded-[2rem] p-12 text-center"
            style={{ background: cardBg, border: `1.5px solid ${border}` }}>
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <FileText size={32} />
            </div>
            <div className="font-medium text-lg" style={{ color: text }}>No appointments yet</div>
            <div className="text-sm mt-1" style={{ color: subtext }}>Your consultation history will appear here.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id}
                className="flex items-center justify-between p-6 rounded-[1.5rem] transition-all hover:shadow-md"
                style={{ background: cardBg, border: `1px solid ${border}` }}>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                    style={{ background: accentBg, color: accent }}>
                    <Building size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg tracking-tight" style={{ color: text, fontFamily: 'JetBrains Mono' }}>
                      Token #{appt.tokenNumber || '—'}
                    </div>
                    <div className="text-sm font-medium mt-1" style={{ color: subtext }}>
                      {appt.symptoms || 'No symptoms noted'}
                    </div>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: appt.status === 'completed' ? accentBg : '#FEF3C7',
                    color: appt.status === 'completed' ? accent : '#F59E0B'
                  }}>
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}