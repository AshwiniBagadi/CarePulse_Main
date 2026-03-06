import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase/config'
import { useTheme } from '../ThemeContext'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, t } = useTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'patient' as 'patient' | 'doctor' | 'admin'
  })

  const bg = '#ffffff'
  // Force high-contrast dark text for visibility against animated backgrounds.
  const cardBg =  'rgba(255,255,255,0.96)'
  const border =  'rgba(15,23,42,0.12)'
  const text =    '#0B1220'
  const subtext = '#334155'
  const inputBg = 'rgba(248,250,252,0.98)'
  const inputRing = 'rgba(14,165,233,0.28)'
  const gradientBg = theme === 'light'
    ? 'linear-gradient(135deg, #0D9488, #0EA5E9)'
    : 'linear-gradient(135deg, #06B6D4, #3B82F6)'

  useEffect(() => {
    const path = location.pathname.toLowerCase()
    const shouldLogin = !path.includes('register')
    setIsLogin(shouldLogin)
    setError('')
  }, [location.pathname])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const redirectByRole = (role: string) => {
    navigate(role === 'doctor' ? '/doctor' : role === 'admin' ? '/admin' : '/dashboard')
  }

  const handleEmailAuth = async () => {
    const email = form.email.trim()
    const password = form.password

    if (!email) return setError('Please enter your email.')
    if (!password || password.length < 6) return setError('Password must be at least 6 characters.')
    if (!isLogin) {
      if (!form.name.trim()) return setError('Please enter your full name.')
      if (!form.phone.trim()) return setError('Please enter your phone number.')
    }

    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password)
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        redirectByRole(userDoc.exists() ? userDoc.data().role : 'patient')
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: form.name.trim(),
          email,
          phone: form.phone.trim(),
          role: form.role,
          createdAt: new Date()
        })
        redirectByRole(form.role)
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)/, ''))
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userRef = doc(db, 'users', result.user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          phone: '',
          role: 'patient',
          createdAt: new Date()
        })
      }
      redirectByRole(userDoc.exists() ? userDoc.data().role : 'patient')
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12" style={{ background: bg }}>
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <div className="mx-auto h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: gradientBg }}>
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-2xl font-extrabold mt-3" style={{ color: text, fontFamily: 'Plus Jakarta Sans' }}>
            CarePulse AI
          </h1>
          <p className="text-sm mt-1" style={{ color: subtext }}>
            {isLogin ? 'Sign in to continue' : 'Create your account in seconds'}
          </p>
        </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-8 shadow-xl relative"
            style={{
              background: cardBg,
              border: `1.5px solid ${border}`,
            }}>
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.10))',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                zIndex: 0,
              }}
            />
            {/* Tabs */}
            <div className="relative z-10 flex rounded-2xl p-1 mb-6"
              style={{
                background: '#EEF2F7',
                border: '1px solid rgba(15,23,42,0.12)',
              }}>
              {['Login', 'Register'].map((tab) => (
                <button key={tab}
                  onClick={() => {
                    const nextIsLogin = tab === 'Login'
                    navigate(nextIsLogin ? '/login' : '/register')
                    setIsLogin(nextIsLogin)
                    setError('')
                  }}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: (isLogin ? tab === 'Login' : tab === 'Register')
                      ? gradientBg : 'transparent',
                    color: (isLogin ? tab === 'Login' : tab === 'Register')
                      ? 'white' : '#0B1220',
                    textShadow: (isLogin ? tab === 'Login' : tab === 'Register')
                      ? '0 8px 24px rgba(2,6,23,0.25)'
                      : '0 1px 0 rgba(255,255,255,0.7)',
                    boxShadow: (isLogin ? tab === 'Login' : tab === 'Register')
                      ? '0 10px 30px rgba(2,6,23,0.18)'
                      : 'none',
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            <motion.div layout className="space-y-4 relative z-10">
              <AnimatePresence mode="popLayout" initial={false}>
                {!isLogin && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <label className="block text-xs font-semibold mb-1" style={{ color: subtext }}>
                      Full name
                    </label>
                    <input
                      name="name"
                      placeholder="e.g. Chaitanya Sharma"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-shadow"
                      style={{
                        background: inputBg,
                        border: `1.5px solid ${border}`,
                        color: text,
                        boxShadow: 'none',
                      }}
                      onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 4px ${inputRing}` }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: subtext }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-shadow"
                  style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 4px ${inputRing}` }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold" style={{ color: subtext }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: t('#0EA5E9', '#22D3EE') }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-shadow"
                  style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 4px ${inputRing}` }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                {!isLogin && (
                  <motion.div
                    key="registerFields"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: subtext }}>
                        Phone
                      </label>
                      <input
                        name="phone"
                        placeholder="e.g. +91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-shadow"
                        style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}
                        onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 4px ${inputRing}` }}
                        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                        autoComplete="tel"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1" style={{ color: subtext }}>
                        Role
                      </label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-shadow"
                        style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}
                        onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 4px ${inputRing}` }}
                        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                      >
                        <option value="patient">🧑‍⚕️ Patient</option>
                        <option value="doctor">👨‍⚕️ Doctor</option>
                        <option value="admin">🏥 Hospital Admin</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444' }}
                  >
                    ⚠️ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={handleEmailAuth} disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50"
                style={{ background: gradientBg }}>
                {loading ? '⏳ Please wait...' : isLogin ? 'Login →' : 'Create Account →'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: border }} />
                <span className="text-xs" style={{ color: subtext }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: border }} />
              </div>

              <button onClick={handleGoogle} disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
                style={{ background: inputBg, border: `1.5px solid ${border}`, color: text }}>
                <span className="text-lg font-bold" style={{ color: t('#0EA5E9', '#22D3EE') }}>G</span>
                Continue with Google
              </button>
            </motion.div>
          </motion.div>

          <p className="text-center text-xs mt-6" style={{ color: subtext }}>
            By continuing you agree to CarePulse AI Terms of Service
          </p>
      </div>
    </div>
  )
}