import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase/config'

const BED_TYPES = [
  {
    id: 'general', name: 'General', price: 3500,
    photo: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80',
    available: 12, total: 20,
  },
  {
    id: 'twin', name: 'Twin Sharing', price: 4950,
    photo: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=80',
    available: 5, total: 10,
  },
  {
    id: 'single', name: 'Single Classic', price: 12000,
    photo: 'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=400&q=80',
    available: 4, total: 8,
  },
  {
    id: 'deluxe', name: 'Deluxe Single', price: 16000,
    photo: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
    available: 2, total: 5,
  },
  {
    id: 'prince', name: 'Prince Suite', price: 18000,
    photo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    available: 1, total: 3,
  },
  {
    id: 'queen', name: 'Queen Suite', price: 23000,
    photo: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=80',
    available: 1, total: 2,
  },
]

export default function BedBooking() {
  const navigate = useNavigate()
  const [selectedBed, setSelectedBed] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    aadhaar: '', patientName: '', mobile: '', gender: '',
    email: '', city: '', doctorName: '', reason: '', date: '', prescription: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const user = auth.currentUser
      await addDoc(collection(db, 'bedBookings'), {
        ...form,
        bedType: selectedBed?.id,
        bedName: selectedBed?.name,
        pricePerDay: selectedBed?.price,
        patientId: user?.uid || 'guest',
        status: 'pending',
        bookedAt: new Date(),
      })
      setSuccess(true)
      setTimeout(() => { setShowForm(false); setSuccess(false); navigate('/dashboard') }, 2500)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>

      {/* Header */}
      <div className="bg-white sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{ borderBottom: '1.5px solid #E0F2FE', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <button onClick={() => navigate('/dashboard')}
          className="text-sm font-medium" style={{ color: '#64748B' }}>← Back</button>
        <h1 className="font-bold text-lg" style={{ color: '#0F172A' }}>Bed Booking</h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#0F172A', fontFamily: 'Plus Jakarta Sans' }}>
          Select Bed Category for Booking
        </h2>
        <p className="text-sm mb-8" style={{ color: '#64748B' }}>
          Choose the bed type that suits your needs and budget
        </p>

        {/* Bed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BED_TYPES.map((bed) => (
            <div key={bed.id} className="rounded-2xl overflow-hidden bg-white transition-all hover:shadow-lg"
              style={{ border: '1.5px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

              {/* Bed Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="font-bold" style={{ color: '#0F172A' }}>{bed.name}</h3>
                <span className="text-sm font-semibold" style={{ color: '#0D9488' }}>
                  ₹ {bed.price.toLocaleString()}/day
                </span>
              </div>

              {/* Availability Badge */}
              <div className="px-4 pb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: bed.available > 3 ? '#0D9488' : bed.available > 0 ? '#F59E0B' : '#EF4444' }} />
                <span className="text-xs font-medium"
                  style={{ color: bed.available > 3 ? '#0D9488' : bed.available > 0 ? '#F59E0B' : '#EF4444' }}>
                  {bed.available} / {bed.total} Available
                </span>
              </div>

              {/* Photo */}
              <div className="mx-3 rounded-xl overflow-hidden h-40">
                <img src={bed.photo} alt={bed.name} className="w-full h-full object-cover" />
              </div>

              {/* Availability Bar */}
              <div className="px-4 pt-3">
                <div className="w-full h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${(bed.available / bed.total) * 100}%`,
                      background: bed.available > 3 ? '#0D9488' : bed.available > 0 ? '#F59E0B' : '#EF4444'
                    }} />
                </div>
              </div>

              {/* Buttons */}
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => { setSelectedBed(bed); setShowForm(true) }}
                  disabled={bed.available === 0}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-md disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                  Request For Booking
                </button>
                <button
                  onClick={() => setSelectedBed(selectedBed?.id === bed.id ? null : bed)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all"
                  style={{ background: '#EFF6FF', color: '#0EA5E9', border: '1.5px solid #BAE6FD' }}>
                  Details {selectedBed?.id === bed.id ? '▲' : '▼'}
                </button>
              </div>

              {/* Details Dropdown */}
              {selectedBed?.id === bed.id && !showForm && (
                <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: '#F1F5F9' }}>
                  <div className="text-sm space-y-2" style={{ color: '#475569' }}>
                    <div className="flex justify-between">
                      <span>Price per day</span>
                      <span className="font-semibold" style={{ color: '#0D9488' }}>₹{bed.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available beds</span>
                      <span className="font-semibold">{bed.available}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AC & Attached Bathroom</span>
                      <span className="font-semibold text-green-600">✓ Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendant Allowed</span>
                      <span className="font-semibold text-green-600">✓ Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TV & WiFi</span>
                      <span className="font-semibold" style={{ color: bed.price > 10000 ? '#0D9488' : '#94A3B8' }}>
                        {bed.price > 10000 ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-2xl rounded-3xl bg-white overflow-hidden"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Modal Header */}
            <div className="px-6 py-5 flex items-center justify-between"
              style={{ borderBottom: '1.5px solid #F1F5F9' }}>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#0F172A' }}>Details</h3>
                <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>
                  Booking: <span className="font-semibold" style={{ color: '#0D9488' }}>{selectedBed?.name}</span>
                  &nbsp;— ₹{selectedBed?.price.toLocaleString()}/day
                </p>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:bg-gray-100"
                style={{ color: '#64748B' }}>✕</button>
            </div>

            {success ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>Request Submitted!</h3>
                <p style={{ color: '#64748B' }}>We'll confirm your bed booking shortly.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  {/* Aadhaar */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>
                      Aadhar Number
                    </label>
                    <input name="aadhaar" value={form.aadhaar} onChange={handleChange}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>

                  {/* Patient Name */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>
                      Patient Name
                    </label>
                    <input name="patientName" value={form.patientName} onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>
                      Mobile Number
                    </label>
                    <input name="mobile" value={form.mobile} onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Email-ID</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="Ash123@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>City</label>
                    <input name="city" value={form.city} onChange={handleChange}
                      placeholder="Mumbai"
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>

                  {/* Doctor Name */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>
                      Name of Doctor
                    </label>
                    <input name="doctorName" value={form.doctorName} onChange={handleChange}
                      placeholder="xyz"
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>
                </div>

                {/* Prescription */}
                <div className="mb-4">
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>
                    Prescription / Admission Note given by the Doctor: Upload the document here
                  </label>
                  <div className="flex gap-3">
                    <input name="prescription" value={form.prescription} onChange={handleChange}
                      placeholder="File name or reference"
                      className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                    <label className="px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:shadow-md"
                      style={{ background: '#EFF6FF', color: '#0EA5E9', border: '1.5px solid #BAE6FD' }}>
                      Choose file
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Reason */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>
                      Reason for Admission
                    </label>
                    <select name="reason" value={form.reason} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                      <option value="">Select reason</option>
                      <option value="surgery">Surgery</option>
                      <option value="treatment">Medical Treatment</option>
                      <option value="observation">Observation</option>
                      <option value="delivery">Delivery / Maternity</option>
                      <option value="emergency">Emergency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Date</label>
                    <input name="date" type="date" value={form.date} onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                      style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }} />
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-2xl mb-4 text-xs"
                  style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', color: '#92400E' }}>
                  <strong>Disclaimer:</strong> Please note, we will try our best to accommodate your bed request,
                  in the class option provided by you. However, the bed class is subject to availability,
                  the above form does not confirm the booking of the bed.
                </div>

                <p className="text-xs text-center mb-4" style={{ color: '#94A3B8' }}>
                  By agreeing to submit the above form, you agree to have read and understood the
                  Important Notifications & Disclaimers listed above.
                </p>

                <button onClick={handleSubmit} disabled={loading}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all hover:shadow-xl disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
                  {loading ? '⏳ Submitting...' : 'SUBMIT'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}