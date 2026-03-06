import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SCHEMES = [
  {
    id: 'pmjay',
    name: 'PM-JAY',
    fullName: 'Pradhan Mantri Jan Arogya Yojana',
    icon: '🏛️',
    color: '#F59E0B',
    bg: '#FEF3C7',
    coverage: '₹5 Lakh/year',
    beneficiaries: '50 Crore+',
    desc: 'World\'s largest health insurance scheme for poor and vulnerable families.',
    eligibility: ['BPL Card holders', 'Annual income below ₹2.5 lakh', 'SC/ST families', 'Landless agricultural labourers'],
    documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
    hospitals: 24000,
    applyLink: 'https://pmjay.gov.in',
  },
  {
    id: 'ayushman',
    name: 'Ayushman Bharat',
    fullName: 'Ayushman Bharat - PMJAY',
    icon: '💊',
    color: '#0D9488',
    bg: '#CCFBF1',
    coverage: '₹5 Lakh/year',
    beneficiaries: '40 Crore+',
    desc: 'Comprehensive health coverage including wellness centers across India.',
    eligibility: ['SECC database families', 'Deprived rural households', 'Urban workers in 11 categories'],
    documents: ['Aadhaar Card', 'Ayushman Card', 'Family ID'],
    hospitals: 28000,
    applyLink: 'https://abdm.gov.in',
  },
  {
    id: 'cghs',
    name: 'CGHS',
    fullName: 'Central Government Health Scheme',
    icon: '🏥',
    color: '#0EA5E9',
    bg: '#BAE6FD',
    coverage: 'Unlimited',
    beneficiaries: '40 Lakh+',
    desc: 'Comprehensive healthcare for central government employees and pensioners.',
    eligibility: ['Central Govt employees', 'Pensioners', 'Dependent family members'],
    documents: ['CGHS Card', 'Employee ID', 'Aadhaar Card'],
    hospitals: 1500,
    applyLink: 'https://cghs.gov.in',
  },
  {
    id: 'esic',
    name: 'ESIC',
    fullName: 'Employees State Insurance Corporation',
    icon: '👷',
    color: '#7C3AED',
    bg: '#DDD6FE',
    coverage: 'Full Medical Care',
    beneficiaries: '13 Crore+',
    desc: 'Social security for workers in organized sector with complete medical coverage.',
    eligibility: ['Employees earning ≤ ₹21,000/month', 'Factory & establishment workers', 'Dependent family members'],
    documents: ['ESIC Card', 'Employee ID', 'Salary Slip'],
    hospitals: 1500,
    applyLink: 'https://esic.gov.in',
  },
  {
    id: 'mjpjay',
    name: 'MJPJAY',
    fullName: 'Mahatma Jyotiba Phule Jan Arogya Yojana',
    icon: '🌿',
    color: '#EF4444',
    bg: '#FEE2E2',
    coverage: '₹1.5 Lakh/year',
    beneficiaries: '2.2 Crore families',
    desc: 'Maharashtra state scheme for yellow and orange ration card holders.',
    eligibility: ['Yellow ration card holders', 'Orange ration card holders', 'Maharashtra residents only'],
    documents: ['Ration Card', 'Aadhaar Card', 'Domicile Certificate'],
    hospitals: 500,
    applyLink: 'https://www.jeevandayee.gov.in',
  },
]

export default function GovernmentSchemes() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    state: '', age: '', income: '', gender: '', familySize: '', maritalStatus: '', healthProblem: '', cost: ''
  })
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [eligible, setEligible] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const checkEligibility = () => {
    const results: string[] = []
    if (filters.income === 'below_2.5') results.push('pmjay', 'ayushman', 'mjpjay')
    if (filters.income === 'below_5') results.push('ayushman')
    if (filters.income === 'govt_employee') results.push('cghs')
    if (filters.income === 'salaried') results.push('esic')
    if (results.length === 0) results.push('ayushman')
    setEligible(results)
    setChecked(true)
  }

  const filteredSchemes = SCHEMES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.fullName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: '#EFF6FF', minHeight: '100vh' }}>

      {/* Header */}
      <div className="bg-white sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{ borderBottom: '1.5px solid #E0F2FE', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <button onClick={() => navigate('/dashboard')}
          className="text-sm font-medium" style={{ color: '#64748B' }}>
          ← Dashboard
        </button>
        <h1 className="font-bold text-lg" style={{ color: '#0F172A' }}>Government Schemes</h1>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden mx-4 mt-6 rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #BAE6FD, #CCFBF1)', minHeight: '200px' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0D9488 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0EA5E9 0%, transparent 50%)' }} />
        <div className="relative flex items-center justify-between px-8 py-8">
          <div className="flex-1">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#0D9488' }}>
              🏛️ GOVERNMENT PORTAL
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#0F172A', fontFamily: 'Plus Jakarta Sans' }}>
              Government Portal
            </h2>
            <p className="text-sm max-w-xs" style={{ color: '#475569' }}>
              Managing healthcare schemes and release of new government benefits for citizens.
            </p>
            <div className="flex gap-3 mt-4">
              <div className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'white', color: '#0D9488' }}>
                5 Active Schemes
              </div>
              <div className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.6)', color: '#475569' }}>
                Auto-Detection ✨
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&q=80"
              alt="Doctors"
              className="w-48 h-48 object-cover rounded-2xl"
              style={{ border: '3px solid white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            />
          </div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-2 gap-4 mx-4 mt-4">
        <div className="p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
          style={{ background: '#BAE6FD', border: '1.5px solid #7DD3FC' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white">📍</div>
          <div>
            <div className="font-bold text-sm" style={{ color: '#0F172A' }}>DCMS</div>
            <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Disaster casualty management systems.</div>
          </div>
          <span className="ml-auto text-lg" style={{ color: '#0EA5E9' }}>→</span>
        </div>
        <div className="p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
          style={{ background: '#CCFBF1', border: '1.5px solid #6EE7B7' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white">📋</div>
          <div>
            <div className="font-bold text-sm" style={{ color: '#0F172A' }}>Government Schemes</div>
            <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Release new upcoming schemes.</div>
          </div>
          <span className="ml-auto text-lg" style={{ color: '#0D9488' }}>→</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Eligibility Filter Form */}
        <div className="rounded-3xl p-6 bg-white" style={{ border: '1.5px solid #E0F2FE', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <h3 className="font-bold text-lg mb-1" style={{ color: '#0F172A' }}>🔍 Check Your Eligibility</h3>
          <p className="text-sm mb-5" style={{ color: '#64748B' }}>Fill in your details to find schemes you qualify for</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Select State</label>
              <select name="state" value={filters.state} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">State name</option>
                <option value="MH">Maharashtra</option>
                <option value="DL">Delhi</option>
                <option value="KA">Karnataka</option>
                <option value="TN">Tamil Nadu</option>
                <option value="UP">Uttar Pradesh</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Age</label>
              <select name="age" value={filters.age} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">Select age</option>
                <option value="child">0–18 years</option>
                <option value="adult">18–60 years</option>
                <option value="senior">60+ years</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Select Income Group</label>
              <select name="income" value={filters.income} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">Annual income</option>
                <option value="below_2.5">Below ₹2.5 Lakh</option>
                <option value="below_5">₹2.5L – ₹5L</option>
                <option value="salaried">Salaried (≤₹21K/month)</option>
                <option value="govt_employee">Govt Employee</option>
                <option value="above_5">Above ₹5 Lakh</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Select Gender</label>
              <select name="gender" value={filters.gender} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Select Family Size</label>
              <select name="familySize" value={filters.familySize} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">Number of members</option>
                <option value="1">1 member</option>
                <option value="2-4">2–4 members</option>
                <option value="5+">5+ members</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Marital Status</label>
              <select name="maritalStatus" value={filters.maritalStatus} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">Married / Unmarried</option>
                <option value="married">Married</option>
                <option value="unmarried">Unmarried</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#64748B' }}>Health Problems</label>
              <select name="healthProblem" value={filters.healthProblem} onChange={handleFilter}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#0F172A' }}>
                <option value="">Select condition</option>
                <option value="chronic">Chronic Disease</option>
                <option value="cancer">Cancer</option>
                <option value="cardiac">Cardiac</option>
                <option value="disability">Disability</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={checkEligibility}
              className="flex-1 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0D9488, #0EA5E9)' }}>
              ✨ To all users
            </button>
            <button onClick={checkEligibility}
              className="flex-1 py-3 rounded-xl font-semibold transition-all hover:shadow-md"
              style={{ background: '#CCFBF1', color: '#0D9488', border: '1.5px solid #0D9488' }}>
              🏥 To all hospitals
            </button>
          </div>

          {checked && eligible.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl"
              style={{ background: '#CCFBF1', border: '1.5px solid #0D9488' }}>
              <div className="font-bold mb-1" style={{ color: '#065F46' }}>
                🎉 You are eligible for {eligible.length} scheme(s)!
              </div>
              <div className="flex flex-wrap gap-2">
                {eligible.map(id => {
                  const s = SCHEMES.find(s => s.id === id)
                  return s ? (
                    <span key={id} className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: s.bg, color: s.color }}>
                      {s.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Scheme Name..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none text-sm bg-white shadow-sm"
            style={{ border: '1.5px solid #E2E8F0', color: '#0F172A' }}
          />
        </div>

        {/* Scheme Cards */}
        <div className="space-y-4">
          {filteredSchemes.map((scheme, idx) => (
            <div key={scheme.id}
              className="rounded-3xl bg-white overflow-hidden transition-all hover:shadow-lg"
              style={{
                border: `2px solid ${eligible.includes(scheme.id) && checked ? scheme.color : '#E0F2FE'}`,
                boxShadow: eligible.includes(scheme.id) && checked ? `0 4px 24px ${scheme.color}20` : '0 2px 12px rgba(0,0,0,0.04)'
              }}>

              {/* Scheme Header */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: scheme.bg }}>
                  {scheme.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg" style={{ color: '#0F172A' }}>
                      Scheme {idx + 1}
                    </h3>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: scheme.bg, color: scheme.color }}>
                      {scheme.name}
                    </span>
                    {eligible.includes(scheme.id) && checked && (
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: '#CCFBF1', color: '#0D9488' }}>
                        ✅ You're Eligible!
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{scheme.fullName}</p>
                  <p className="text-sm mt-1" style={{ color: '#475569' }}>{scheme.desc}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-0 border-t border-b" style={{ borderColor: '#F1F5F9' }}>
                {[
                  { label: 'Coverage', value: scheme.coverage },
                  { label: 'Beneficiaries', value: scheme.beneficiaries },
                  { label: 'Hospitals', value: scheme.hospitals.toLocaleString() + '+' },
                ].map((stat, i) => (
                  <div key={stat.label} className="py-3 text-center"
                    style={{ borderRight: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                    <div className="font-bold text-sm" style={{ color: scheme.color }}>{stat.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Expand / Collapse */}
              <button
                onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
                className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold transition-all"
                style={{ color: scheme.color }}>
                <span>{expanded === scheme.id ? 'Hide Details ▲' : 'View Details ▼'}</span>
              </button>

              {/* Expanded Details */}
              {expanded === scheme.id && (
                <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-2xl" style={{ background: scheme.bg }}>
                      <div className="font-semibold text-sm mb-2" style={{ color: scheme.color }}>
                        ✅ Eligibility Criteria
                      </div>
                      <ul className="space-y-1">
                        {scheme.eligibility.map((item) => (
                          <li key={item} className="text-sm flex items-start gap-2" style={{ color: '#475569' }}>
                            <span style={{ color: scheme.color }}>•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                      <div className="font-semibold text-sm mb-2" style={{ color: '#0F172A' }}>
                        📄 Required Documents
                      </div>
                      <ul className="space-y-1">
                        {scheme.documents.map((doc) => (
                          <li key={doc} className="text-sm flex items-start gap-2" style={{ color: '#475569' }}>
                            <span style={{ color: '#0D9488' }}>•</span> {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ✅ FIXED: <a> tag instead of <button> — opens official govt site in new tab */}
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-2xl text-white font-semibold text-center transition-all hover:shadow-lg hover:scale-[1.02]"
                    style={{ background: `linear-gradient(135deg, ${scheme.color}, #0EA5E9)` }}
                  >
                    Apply for {scheme.name} on Official Website →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}