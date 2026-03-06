import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase/config'

const HOSPITALS = [
  {
    id: 'h1', name: 'CarePulse General Hospital', address: 'Pune, Maharashtra',
    crowd: 'low', wait: 8, rating: 4.8, beds: 12,
    photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80',
  },
  {
    id: 'h2', name: 'City Medical Center', address: 'Mumbai, Maharashtra',
    crowd: 'medium', wait: 18, rating: 4.6, beds: 5,
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
  },
  {
    id: 'h3', name: 'Apollo CarePulse', address: 'Nagpur, Maharashtra',
    crowd: 'high', wait: 35, rating: 4.5, beds: 0,
    photo: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=600&q=80',
  },
]

const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️', symptoms: ['chest pain', 'heart', 'palpitation'] },
  { id: 'orthopedics', name: 'Orthopedics', icon: '🦴', symptoms: ['bone', 'joint', 'fracture', 'knee'] },
  { id: 'general', name: 'General Medicine', icon: '🩺', symptoms: ['fever', 'cold', 'cough', 'headache'] },
  { id: 'neurology', name: 'Neurology', icon: '🧠', symptoms: ['brain', 'seizure', 'memory', 'migraine'] },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶', symptoms: ['child', 'baby', 'infant'] },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴', symptoms: ['skin', 'rash', 'acne', 'allergy'] },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️', symptoms: ['eye', 'vision', 'blind'] },
  { id: 'ent', name: 'ENT', icon: '👂', symptoms: ['ear', 'nose', 'throat', 'hearing'] },
]

const DOCTORS: Record<string, any[]> = {
  cardiology: [
    { id: 'd1', name: 'Dr. Priya Sharma', exp: '12 years', rating: 4.8, slots: ['9:00 AM', '10:00 AM', '2:00 PM'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
    { id: 'd2', name: 'Dr. Rajesh Mehta', exp: '8 years', rating: 4.6, slots: ['11:00 AM', '3:00 PM', '4:00 PM'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
  ],
  orthopedics: [
    { id: 'd3', name: 'Dr. Anita Desai', exp: '15 years', rating: 4.9, slots: ['9:30 AM', '11:30 AM', '1:00 PM'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' },
  ],
  general: [
    { id: 'd4', name: 'Dr. Vikram Joshi', exp: '10 years', rating: 4.7, slots: ['8:00 AM', '10:30 AM', '3:30 PM'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
    { id: 'd5', name: 'Dr. Sunita Patil', exp: '6 years', rating: 4.5, slots: ['9:00 AM', '12:00 PM', '4:00 PM'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
  ],
  neurology: [
    { id: 'd6', name: 'Dr. Amit Kumar', exp: '14 years', rating: 4.8, slots: ['10:00 AM', '2:00 PM'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
  ],
  pediatrics: [
    { id: 'd7', name: 'Dr. Kavita Singh', exp: '11 years', rating: 4.9, slots: ['9:00 AM', '11:00 AM', '1:00 PM'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' },
  ],
  dermatology: [
    { id: 'd8', name: 'Dr. Neha Gupta', exp: '7 years', rating: 4.7, slots: ['10:30 AM', '2:30 PM', '4:30 PM'], photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&q=80' },
  ],
  ophthalmology: [
    { id: 'd9', name: 'Dr. Suresh Nair', exp: '9 years', rating: 4.6, slots: ['9:00 AM', '11:00 AM', '3:00 PM'], photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80' },
  ],
  ent: [
    { id: 'd10', name: 'Dr. Pooja Verma', exp: '13 years', rating: 4.8, slots: ['8:30 AM', '12:30 PM', '4:00 PM'], photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80' },
  ],
}

const BED_CATEGORIES = [
  { id: 'general', name: 'General Ward', price: 3500, icon: '🛏️', desc: 'Shared ward, basic facilities', photo: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80' },
  { id: 'twin', name: 'Twin Sharing', price: 4950, icon: '🛏️', desc: 'Semi-private, 2 patients', photo: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=80' },
  { id: 'single', name: 'Single Classic', price: 12000, icon: '🏨', desc: 'Private room, AC', photo: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=400&q=80' },
  { id: 'deluxe', name: 'Deluxe Single', price: 16000, icon: '🌟', desc: 'Deluxe private with sofa', photo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80' },
  { id: 'suite', name: 'Premium Suite', price: 23000, icon: '👑', desc: 'Premium suite, attendant bed', photo: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=80' },
]

const crowdColor = (level: string) => {
  if (level === 'low') return '#0D9488'
  if (level === 'medium') return '#F59E0B'
  return '#EF4444'
}

const crowdBg = (level: string) => {
  if (level === 'low') return '#ECFDF5'
  if (level === 'medium') return '#FFFBEB'
  return '#FEF2F2'
}

export default function BookAppointment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState<'opd' | 'bed'>('opd')
  const [search, setSearch] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [suggested, setSuggested] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selected, setSelected] = useState({
    hospital: '', department: '', doctor: '', slot: '', date: '', bed: '',
  })

  const filteredHospitals = HOSPITALS.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.address.toLowerCase().includes(search.toLowerCase())
  )

  const analyzeSymptoms = () => {
    const lower = symptoms.toLowerCase()
    const match = DEPARTMENTS.find(d => d.symptoms.some(s => lower.includes(s)))
    setSuggested(match ? match.id : 'general')
  }

  const handleBook = async () => {
  setLoading(true)

  try {
    const user = auth.currentUser
    if (!user) return

    const tokenNumber = Math.floor(Math.random() * 50) + 1

    const appointmentRef = await addDoc(collection(db, "appointments"), {
      patientId: user.uid,
      hospitalId: selected.hospital,
      departmentId: selected.department,
      doctorId: selected.doctor,
      slot: selected.slot,
      date: selected.date,
      bedId: selected.bed,
      tokenNumber,
      symptoms,
      mode,
      status: "booked",
      priority: "normal",
      bookedAt: new Date()
    })

    /* Create queue entry */

    await addDoc(collection(db, "queue"), {
      appointmentId: appointmentRef.id,
      doctorId: selected.doctor,
      hospitalId: selected.hospital,
      patientId: user.uid,
      tokenNumber,
      status: "waiting",
      createdAt: new Date()
    })

    setSuccess(true)

    setTimeout(() => {
      navigate("/dashboard")
    }, 3000)

  } catch (err) {
    console.error(err)
  }

  setLoading(false)
}
  const steps = mode === 'opd'
    ? ['Hospital', 'Department', 'Doctor', 'Confirm']
    : ['Hospital', 'Bed Type', 'Confirm']

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0FDFA' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#0F172A' }}>
            {mode === 'bed' ? 'Bed Booked!' : 'Appointment Booked!'}
          </h2>
          <p style={{ color: '#64748B' }}>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 bg-white shadow-sm border-b border-gray-100">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
          className="flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: '#64748B' }}>
          ← Back
        </button>
        <h1 className="font-bold text-lg" style={{ color: '#0F172A' }}>Book Appointment</h1>
        <div className="ml-auto flex rounded-xl p-1 gap-1" style={{ background: '#F1F5F9' }}>
          {[{ key: 'opd', label: '🩺 OPD' }, { key: 'bed', label: '🛏️ Bed Booking' }].map((m) => (
            <button key={m.key}
              onClick={() => { setMode(m.key as any); setStep(1) }}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: mode === m.key ? 'linear-gradient(135deg, #0D9488, #0EA5E9)' : 'transparent',
                color: mode === m.key ? 'white' : '#94A3B8'
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm"
                  style={{
                    background: step > i + 1 ? '#0D9488' : step === i + 1
                      ? 'linear-gradient(135deg, #0D9488, #0EA5E9)' : '#F1F5F9',
                    color: step >= i + 1 ? 'white' : '#94A3B8'
                  }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="text-xs mt-1 font-medium hidden md:block"
                  style={{ color: step === i + 1 ? '#0D9488' : '#94A3B8' }}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-10 md:w-20 h-0.5 mb-4 rounded-full transition-all"
                  style={{ background: step > i + 1 ? '#0D9488' : '#E2E8F0' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">

        {/* STEP 1: Hospital */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0F172A' }}>Select Hospital</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>Hospitals near you, sorted by wait time</p>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by hospital name or city..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none text-sm shadow-sm"
                style={{ background: 'white', border: '1.5px solid #E2E8F0', color: '#0F172A' }}
              />
            </div>
            <div className="space-y-4">
              {filteredHospitals.map((h) => (
                <button key={h.id}
                  onClick={() => { setSelected({ ...selected, hospital: h.id }); setStep(2) }}
                  className="w-full rounded-2xl overflow-hidden text-left transition-all hover:shadow-lg bg-white"
                  style={{ border: `2px solid ${selected.hospital === h.id ? '#0D9488' : '#F1F5F9'}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={h.photo} alt={h.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: crowdBg(h.crowd), color: crowdColor(h.crowd) }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: crowdColor(h.crowd) }} />
                      {h.crowd} crowd
                    </div>
                    {mode === 'bed' && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: h.beds > 0 ? '#ECFDF5' : '#FEF2F2', color: h.beds > 0 ? '#0D9488' : '#EF4444' }}>
                        {h.beds > 0 ? `${h.beds} beds free` : 'No beds'}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>
                      ⏱ ~{h.wait} min wait
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold" style={{ color: '#0F172A' }}>{h.name}</div>
                      <div className="text-sm mt-0.5" style={{ color: '#64748B' }}>📍 {h.address}</div>
                      <div className="text-sm mt-1 text-yellow-500 font-medium">⭐ {h.rating}</div>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                      <span className="text-white text-sm">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 OPD: Department */}
        {step === 2 && mode === 'opd' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0F172A' }}>Select Department</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>Use AI to find the right department</p>
            <div className="p-4 rounded-2xl mb-6 bg-white shadow-sm"
              style={{ border: '1.5px solid #E9D5FF' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <span className="font-semibold text-sm" style={{ color: '#7C3AED' }}>AI Symptom Assistant</span>
              </div>
              <div className="flex gap-2">
                <input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe symptoms (e.g. chest pain, fever...)"
                  className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                  style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}
                />
                <button onClick={analyzeSymptoms}
                  className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #0EA5E9)' }}>
                  Analyze
                </button>
              </div>
              {suggested && (
                <div className="mt-2 text-sm font-medium" style={{ color: '#0D9488' }}>
                  ✨ Recommended: {DEPARTMENTS.find(d => d.id === suggested)?.name}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DEPARTMENTS.map((dept) => (
                <button key={dept.id}
                  onClick={() => { setSelected({ ...selected, department: dept.id }); setStep(3) }}
                  className="p-4 rounded-2xl text-left transition-all hover:shadow-md bg-white"
                  style={{
                    border: `2px solid ${suggested === dept.id ? '#0D9488' : '#F1F5F9'}`,
                    boxShadow: suggested === dept.id ? '0 4px 20px rgba(13,148,136,0.15)' : '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                  <div className="text-2xl mb-2">{dept.icon}</div>
                  <div className="font-semibold text-sm" style={{ color: '#0F172A' }}>{dept.name}</div>
                  {suggested === dept.id && (
                    <div className="text-xs mt-1 font-medium" style={{ color: '#0D9488' }}>✨ AI Pick</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 BED: Visual Bed Grid */}
        {step === 2 && mode === 'bed' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0F172A' }}>Select Your Bed</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>Tap a vacant bed to book it</p>
            <div className="flex items-center gap-6 mb-6 p-4 rounded-2xl bg-white"
              style={{ border: '1.5px solid #E0F2FE' }}>
              {[
                { color: '#0D9488', label: 'Vacant' },
                { color: '#EF4444', label: 'Occupied' },
                { color: '#F59E0B', label: 'Maintenance' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm font-medium" style={{ color: '#475569' }}>{item.label}</span>
                </div>
              ))}
            </div>
            {[
              {
                ward: 'General Ward',
                beds: [
                  { id: 'G-B001', status: 'vacant' }, { id: 'G-B002', status: 'occupied' },
                  { id: 'G-B003', status: 'occupied' }, { id: 'G-B004', status: 'vacant' },
                  { id: 'G-B005', status: 'maintenance' }, { id: 'G-B006', status: 'vacant' },
                  { id: 'G-B007', status: 'vacant' }, { id: 'G-B008', status: 'occupied' },
                  { id: 'G-B009', status: 'vacant' }, { id: 'G-B010', status: 'vacant' },
                ]
              },
              {
                ward: 'Private Ward',
                beds: [
                  { id: 'P-B001', status: 'vacant' }, { id: 'P-B002', status: 'vacant' },
                  { id: 'P-B003', status: 'occupied' }, { id: 'P-B004', status: 'vacant' },
                  { id: 'P-B005', status: 'maintenance' }, { id: 'P-B006', status: 'vacant' },
                ]
              },
              {
                ward: 'Emergency Ward',
                beds: [
                  { id: 'E-B001', status: 'occupied' }, { id: 'E-B002', status: 'occupied' },
                  { id: 'E-B003', status: 'vacant' }, { id: 'E-B004', status: 'vacant' },
                  { id: 'E-B005', status: 'vacant' },
                ]
              },
            ].map((wardData) => (
              <div key={wardData.ward} className="mb-6 p-5 rounded-2xl bg-white"
                style={{ border: '1.5px solid #E0F2FE', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: '#0F172A' }}>{wardData.ward}</h3>
                  <span className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: '#CCFBF1', color: '#0D9488' }}>
                    {wardData.beds.filter(b => b.status === 'vacant').length} vacant
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {wardData.beds.map((bed) => {
                    const isVacant = bed.status === 'vacant'
                    const isOccupied = bed.status === 'occupied'
                    const color = isVacant ? '#0D9488' : isOccupied ? '#EF4444' : '#F59E0B'
                    const bg = isVacant ? '#CCFBF1' : isOccupied ? '#FEE2E2' : '#FEF3C7'
                    const isSelected = selected.bed === bed.id
                    return (
                      <button key={bed.id}
                        disabled={!isVacant}
                        onClick={() => isVacant && setSelected({ ...selected, bed: bed.id })}
                        className="flex flex-col items-center justify-center rounded-xl transition-all"
                        style={{
                          width: '72px', height: '72px',
                          background: isSelected ? color : bg,
                          border: `2px solid ${isSelected ? color : color + '40'}`,
                          cursor: isVacant ? 'pointer' : 'not-allowed',
                          opacity: isVacant ? 1 : 0.85,
                          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                          boxShadow: isSelected ? `0 4px 16px ${color}40` : 'none'
                        }}>
                        <span className="text-xs font-bold" style={{ color: isSelected ? 'white' : color }}>
                          {bed.id}
                        </span>
                        <span className="text-xs mt-0.5 capitalize font-medium"
                          style={{ color: isSelected ? 'white' : color }}>
                          {bed.status}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {selected.bed && (
              <div className="p-4 rounded-2xl mb-4"
                style={{ background: '#CCFBF1', border: '1.5px solid #0D9488' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold" style={{ color: '#0D9488' }}>✅ Bed Selected</div>
                    <div className="text-sm mt-0.5" style={{ color: '#065F46' }}>Bed ID: {selected.bed}</div>
                  </div>
                  <button onClick={() => setStep(3)}
                    className="px-5 py-2 rounded-xl text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 OPD: Doctor Cards */}
        {step === 3 && mode === 'opd' && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0F172A' }}>Select Doctor</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>Choose your preferred doctor and time</p>
            <div className="space-y-4">
              {(DOCTORS[selected.department] || DOCTORS.general).map((doc) => (
                <div key={doc.id} className="rounded-2xl bg-white overflow-hidden transition-all hover:shadow-lg"
                  style={{ border: '1.5px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

                  {/* Doctor Info Row */}
                  <div className="flex">
                    <div className="flex-shrink-0 overflow-hidden" style={{ width: '140px', height: '180px', background: '#F0FDFA' }}>
                      <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: '#0F172A' }}>{doc.name}</h3>
                        <p className="text-sm font-medium mt-0.5" style={{ color: '#0D9488' }}>
                          {DEPARTMENTS.find(d => d.id === selected.department)?.name}
                        </p>
                        <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                          CarePulse General Hospital
                        </p>
                        <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                          📍 1.3 Km Away &nbsp;•&nbsp; {doc.exp} exp
                        </p>
                        <p className="text-sm mt-1 text-yellow-500">⭐ {doc.rating}</p>
                      </div>
                      <div className="flex items-center gap-6 mt-2">
                        <div>
                          <div className="font-bold text-sm" style={{ color: '#0F172A' }}>₹ 1,400</div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>Doctor Fees</div>
                        </div>
                        <div>
                          <div className="font-bold text-sm" style={{ color: '#0F172A' }}>₹ 100</div>
                          <div className="text-xs" style={{ color: '#94A3B8' }}>Booking Fees</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slots & Date */}
                  <div className="px-4 py-3 border-t" style={{ borderColor: '#F1F5F9' }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>AVAILABLE SLOTS</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {doc.slots.map((slot: string) => (
                        <button key={slot}
                          onClick={() => setSelected({ ...selected, doctor: doc.id, slot })}
                          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                          style={{
                            background: selected.slot === slot && selected.doctor === doc.id
                              ? 'linear-gradient(135deg, #0D9488, #0EA5E9)' : '#F8FAFC',
                            color: selected.slot === slot && selected.doctor === doc.id ? 'white' : '#475569',
                            border: `1.5px solid ${selected.slot === slot && selected.doctor === doc.id ? '#0D9488' : '#E2E8F0'}`
                          }}>
                          {slot}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input type="date"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelected({ ...selected, date: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                        style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}
                      />
                      <button
                        onClick={() => {
                          if (selected.doctor === doc.id && selected.slot && selected.date) setStep(4)
                        }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: '#CCFBF1', color: '#0D9488', border: '1.5px solid #0D9488' }}>
                        View Schedule →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONFIRM */}
        {((step === 3 && mode === 'bed') || (step === 4 && mode === 'opd')) && (
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0F172A' }}>Confirm Booking</h2>
            <p className="text-sm mb-5" style={{ color: '#64748B' }}>Review your appointment details</p>
            <div className="rounded-2xl p-5 mb-4 bg-white space-y-3"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1.5px solid #F1F5F9' }}>
              {[
                { label: '🏥 Hospital', value: HOSPITALS.find(h => h.id === selected.hospital)?.name },
                mode === 'bed'
                  ? { label: '🛏️ Bed', value: selected.bed }
                  : { label: '🏨 Department', value: DEPARTMENTS.find(d => d.id === selected.department)?.name },
                mode === 'opd' ? { label: '👨‍⚕️ Doctor', value: (DOCTORS[selected.department] || DOCTORS.general).find((d: any) => d.id === selected.doctor)?.name } : null,
                mode === 'opd' ? { label: '🕐 Time', value: selected.slot } : null,
                mode === 'opd' ? { label: '📅 Date', value: selected.date } : null,
                symptoms ? { label: '🤒 Symptoms', value: symptoms } : null,
              ].filter(Boolean).map((item: any) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm" style={{ color: '#64748B' }}>{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl mb-6"
              style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
              <div className="flex items-center gap-2 mb-1">
                <span>🏛️</span>
                <span className="font-semibold text-sm" style={{ color: '#92400E' }}>Government Scheme Detected</span>
              </div>
              <div className="text-sm" style={{ color: '#78350F' }}>
                {mode === 'bed'
                  ? 'PM-JAY may cover bed charges — verify at hospital counter'
                  : 'Ayushman Bharat benefit may apply — OPD consultation free'}
              </div>
            </div>
            <button onClick={handleBook} disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:shadow-xl disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
              {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}