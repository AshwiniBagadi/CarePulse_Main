import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '../lib/firebase/config'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const hourlyData = [
  { time: '8am', patients: 12 }, { time: '9am', patients: 28 },
  { time: '10am', patients: 45 }, { time: '11am', patients: 52 },
  { time: '12pm', patients: 38 }, { time: '1pm', patients: 25 },
  { time: '2pm', patients: 42 }, { time: '3pm', patients: 48 },
  { time: '4pm', patients: 35 }, { time: '5pm', patients: 20 },
]

const deptData = [
  { dept: 'General', patients: 85 },
  { dept: 'Cardio', patients: 42 },
  { dept: 'Ortho', patients: 38 },
  { dept: 'Neuro', patients: 25 },
  { dept: 'Peds', patients: 31 },
  { dept: 'Derm', patients: 19 },
]

const statusData = [
  { name: 'Completed', value: 145, color: '#0D9488' },
  { name: 'Waiting', value: 38, color: '#0EA5E9' },
  { name: 'Serving', value: 12, color: '#7C3AED' },
  { name: 'No Show', value: 8, color: '#EF4444' },
]

const DEPARTMENTS = [
  { name: 'General Medicine', queue: 18, wait: 25, crowd: 'high', doctors: 3 },
  { name: 'Cardiology', queue: 8, wait: 14, crowd: 'medium', doctors: 2 },
  { name: 'Orthopedics', queue: 12, wait: 18, crowd: 'medium', doctors: 2 },
  { name: 'Neurology', queue: 5, wait: 8, crowd: 'low', doctors: 1 },
  { name: 'Pediatrics', queue: 10, wait: 15, crowd: 'medium', doctors: 2 },
  { name: 'Dermatology', queue: 6, wait: 10, crowd: 'low', doctors: 1 },
]

const DOCTORS = [
  { name: 'Dr. Priya Sharma', dept: 'Cardiology', patients: 18, status: 'online', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&q=80' },
  { name: 'Dr. Rajesh Mehta', dept: 'Cardiology', patients: 14, status: 'online', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80' },
  { name: 'Dr. Anita Desai', dept: 'Orthopedics', patients: 22, status: 'online', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80' },
  { name: 'Dr. Vikram Joshi', dept: 'General', patients: 31, status: 'busy', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80' },
  { name: 'Dr. Kavita Singh', dept: 'Pediatrics', patients: 19, status: 'offline', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80' },
]

const KPI_CARDS = [
  { label: "Today's Patients", value: '247', icon: '👥', gradient: 'linear-gradient(135deg, #0D9488, #0EA5E9)', change: '+12% vs yesterday' },
  { label: 'Avg Wait Time', value: '14 min', icon: '⏱️', gradient: 'linear-gradient(135deg, #0EA5E9, #6366F1)', change: '↓ 18% improved' },
  { label: 'Active Doctors', value: '12', icon: '👨‍⚕️', gradient: 'linear-gradient(135deg, #7C3AED, #0EA5E9)', change: '+2 online now' },
  { label: 'Emergencies', value: '3', icon: '🚨', gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)', change: 'Requires attention' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) { navigate('/login'); return }
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) setAdmin(userDoc.data())
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const crowdColor = (level: string) => {
    if (level === 'low') return '#0D9488'
    if (level === 'medium') return '#F59E0B'
    return '#EF4444'
  }

  const crowdBg = (level: string) => {
    if (level === 'low') return '#CCFBF1'
    if (level === 'medium') return '#FEF3C7'
    return '#FEE2E2'
  }

  const tabs = ['overview', 'queue', 'doctors', 'analytics', 'schemes']

  return (
    <div style={{ background: '#EFF6FF', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1.5px solid #E0F2FE', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">🏥</span>
          <span className="font-bold text-lg" style={{ color: '#0D9488' }}>CarePulse AI</span>
          <span className="text-sm px-3 py-1 rounded-full font-medium"
            style={{ background: '#FEF3C7', color: '#F59E0B' }}>
            Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:block" style={{ color: '#94A3B8' }}>
            🕐 {time.toLocaleTimeString()}
          </span>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
            {admin?.name?.[0] || 'A'}
          </div>
          <button onClick={() => { signOut(auth); navigate('/') }}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ color: '#EF4444', border: '1.5px solid #FCA5A5' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white border-b px-6 overflow-x-auto"
        style={{ borderColor: '#E0F2FE' }}>
        <div className="flex gap-1 max-w-6xl mx-auto">
          {tabs.map((tab) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-4 text-sm font-semibold capitalize transition-all whitespace-nowrap"
              style={{
                color: activeTab === tab ? '#0D9488' : '#94A3B8',
                borderBottom: activeTab === tab ? '2px solid #0D9488' : '2px solid transparent'
              }}>
              {tab === 'overview' ? '📊 Overview' :
               tab === 'queue' ? '🎫 Queue Monitor' :
               tab === 'doctors' ? '👨‍⚕️ Doctors' :
               tab === 'analytics' ? '📈 Analytics' : '🏛️ Schemes'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {KPI_CARDS.map((kpi) => (
                <div key={kpi.label}
                  className="p-6 rounded-3xl text-white relative overflow-hidden"
                  style={{ background: kpi.gradient, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                    style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
                  <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-10"
                    style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
                  <div className="text-3xl mb-3">{kpi.icon}</div>
                  <div className="text-3xl font-bold mb-1"
                    style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {kpi.value}
                  </div>
                  <div className="text-white/70 text-sm mb-2">{kpi.label}</div>
                  <div className="text-white/90 text-xs font-semibold px-2 py-1 rounded-full inline-block"
                    style={{ background: 'rgba(255,255,255,0.2)' }}>
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
                <h3 className="font-bold mb-4" style={{ color: '#0F172A' }}>📈 Hourly Patient Volume</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={hourlyData}>
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E0F2FE', fontSize: 12 }} />
                    <Line type="monotone" dataKey="patients" stroke="#0D9488" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-3xl bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
                <h3 className="font-bold mb-4" style={{ color: '#0F172A' }}>🍩 Queue Status</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {statusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-xs" style={{ color: '#64748B' }}>{item.name}</span>
                        <span className="text-xs font-bold" style={{ color: '#0F172A' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="p-6 rounded-3xl bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
              <h3 className="font-bold mb-4" style={{ color: '#0F172A' }}>📊 Patients per Department</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deptData}>
                  <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E0F2FE', fontSize: 12 }} />
                  <Bar dataKey="patients" fill="#0D9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* QUEUE MONITOR TAB */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>🎫 Live Queue Monitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.name} className="p-5 rounded-2xl bg-white"
                  style={{ border: `2px solid ${crowdColor(dept.crowd)}30`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm" style={{ color: '#0F172A' }}>{dept.name}</h3>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ background: crowdBg(dept.crowd), color: crowdColor(dept.crowd) }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: crowdColor(dept.crowd) }} />
                      {dept.crowd}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Queue', value: dept.queue },
                      { label: 'Wait', value: dept.wait + 'm' },
                      { label: 'Doctors', value: dept.doctors },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-2 rounded-xl"
                        style={{ background: '#F8FAFC' }}>
                        <div className="font-bold text-lg" style={{ color: crowdColor(dept.crowd) }}>
                          {stat.value}
                        </div>
                        <div className="text-xs" style={{ color: '#94A3B8' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: '#F1F5F9' }}>
                    <div className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (dept.queue / 20) * 100)}%`,
                        background: crowdColor(dept.crowd)
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCTORS TAB */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>👨‍⚕️ Doctor Management</h2>
              <button className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                + Add Doctor
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOCTORS.map((doc) => (
                <div key={doc.name} className="p-5 rounded-2xl bg-white flex items-center gap-4"
                  style={{ border: '1.5px solid #E0F2FE', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <img src={doc.avatar} alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="font-bold" style={{ color: '#0F172A' }}>{doc.name}</div>
                    <div className="text-sm" style={{ color: '#64748B' }}>{doc.dept}</div>
                    <div className="text-sm mt-1" style={{ color: '#0D9488' }}>
                      {doc.patients} patients today
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{
                      background: doc.status === 'online' ? '#CCFBF1' : doc.status === 'busy' ? '#FEF3C7' : '#F1F5F9',
                      color: doc.status === 'online' ? '#0D9488' : doc.status === 'busy' ? '#F59E0B' : '#94A3B8'
                    }}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>📈 Hospital Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total This Month', value: '4,821', color: '#0D9488', bg: '#CCFBF1' },
                { label: 'Avg Daily Patients', value: '156', color: '#0EA5E9', bg: '#BAE6FD' },
                { label: 'Peak Hour', value: '11 AM', color: '#7C3AED', bg: '#DDD6FE' },
                { label: 'Satisfaction', value: '4.7 ⭐', color: '#F59E0B', bg: '#FEF3C7' },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-white text-center"
                  style={{ border: '1.5px solid #E0F2FE' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-3xl bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
              <h3 className="font-bold mb-4" style={{ color: '#0F172A' }}>📊 Department Workload</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptData}>
                  <XAxis dataKey="dept" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E0F2FE' }} />
                  <Bar dataKey="patients" radius={[8, 8, 0, 0]}>
                    {deptData.map((_, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? '#0D9488' : '#0EA5E9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* SCHEMES TAB */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: '#0F172A' }}>🏛️ Government Schemes Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { scheme: 'PM-JAY', patients: 48, savings: '₹1.2L', color: '#F59E0B', bg: '#FEF3C7' },
                { scheme: 'Ayushman Bharat', patients: 62, savings: '₹2.4L', color: '#0D9488', bg: '#CCFBF1' },
                { scheme: 'CGHS', patients: 23, savings: '₹84K', color: '#0EA5E9', bg: '#BAE6FD' },
                { scheme: 'ESIC', patients: 31, savings: '₹1.1L', color: '#7C3AED', bg: '#DDD6FE' },
              ].map((item) => (
                <div key={item.scheme} className="p-5 rounded-2xl bg-white"
                  style={{ border: `1.5px solid ${item.color}30`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
                    style={{ background: item.bg }}>
                    🏛️
                  </div>
                  <div className="font-bold text-sm mb-1" style={{ color: '#0F172A' }}>{item.scheme}</div>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>{item.patients}</div>
                  <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>patients today</div>
                  <div className="text-sm font-semibold mt-2" style={{ color: item.color }}>
                    {item.savings} saved
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-3xl bg-white" style={{ border: '1.5px solid #E0F2FE' }}>
              <h3 className="font-bold mb-2" style={{ color: '#0F172A' }}>💰 Total Savings This Month</h3>
              <div className="text-4xl font-bold mb-1" style={{ color: '#0D9488' }}>₹5,60,000</div>
              <div className="text-sm" style={{ color: '#64748B' }}>
                164 patients benefited from government schemes this month
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}