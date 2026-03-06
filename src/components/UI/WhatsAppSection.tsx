// src/components/ui/WhatsAppSection.tsx
// Drop this anywhere in your landing page JSX: <WhatsAppSection />

import { useState } from 'react'

const TWILIO_NUMBER = '14155238886'
const TWILIO_DISPLAY = '+1 415 523 8886'
const SANDBOX_JOIN = 'join small-port'

// ── Pre-built WhatsApp message flows ────────────────────────────────────────
const FLOWS = [
  {
    role: 'Patient',
    icon: '🧑‍⚕️',
    color: '#0D9488',
    bg: '#CCFBF1',
    border: '#99F6E4',
    actions: [
      {
        label: 'Book Appointment',
        icon: '📅',
        message: 'Hi CarePulse! I want to book an OPD appointment. Please help me.',
      },
      {
        label: 'Book a Bed',
        icon: '🛏️',
        message: 'Hi CarePulse! I need to book a hospital bed. Can you help?',
      },
      {
        label: 'Check Queue Status',
        icon: '📊',
        message: 'STATUS',
      },
      {
        label: 'Talk to Doctor',
        icon: '👨‍⚕️',
        message: 'Hi! I need to speak with a doctor about my symptoms.',
      },
    ],
  },
  {
    role: 'Doctor',
    icon: '🩺',
    color: '#0EA5E9',
    bg: '#BAE6FD',
    border: '#7DD3FC',
    actions: [
      {
        label: 'View My Queue',
        icon: '📋',
        message: 'DOCTOR STATUS — Show me my current patient queue.',
      },
      {
        label: 'Call Next Patient',
        icon: '📢',
        message: 'CALL NEXT — Call the next patient in my queue.',
      },
      {
        label: 'Mark Complete',
        icon: '✅',
        message: 'COMPLETE — Mark current consultation as complete.',
      },
      {
        label: 'Go Offline',
        icon: '🔴',
        message: 'OFFLINE — Set my status to offline.',
      },
    ],
  },
  {
    role: 'Admin',
    icon: '🏛️',
    color: '#7C3AED',
    bg: '#EDE9FE',
    border: '#C4B5FD',
    actions: [
      {
        label: 'Hospital Stats',
        icon: '📊',
        message: 'ADMIN STATS — Show today\'s hospital statistics.',
      },
      {
        label: 'Queue Overview',
        icon: '🔍',
        message: 'ADMIN QUEUE — Show all department queues.',
      },
      {
        label: 'Emergency Alert',
        icon: '🚨',
        message: 'ADMIN EMERGENCY — Show active emergencies.',
      },
      {
        label: 'Broadcast Message',
        icon: '📣',
        message: 'ADMIN BROADCAST — Send message to all patients.',
      },
    ],
  },
]

// ── Chat preview simulation ──────────────────────────────────────────────────
const DEMO_CHATS: Record<string, { from: 'user' | 'bot'; text: string }[]> = {
  'Book Appointment': [
    { from: 'user', text: 'Hi CarePulse! I want to book an OPD appointment.' },
    { from: 'bot', text: '👋 Hello! I\'d love to help you book an appointment.\n\nPlease select a department:\n1️⃣ Cardiology\n2️⃣ General Medicine\n3️⃣ Orthopedics\n4️⃣ Neurology\n\nReply with the number.' },
    { from: 'user', text: '2' },
    { from: 'bot', text: '🩺 *General Medicine* selected!\n\nAvailable doctors today:\n👨‍⚕️ Dr. Vikram Joshi — 10:30 AM\n👩‍⚕️ Dr. Sunita Patil — 12:00 PM\n\nReply 1 or 2 to choose.' },
    { from: 'user', text: '1' },
    { from: 'bot', text: '✅ *Appointment Confirmed!*\n\n🎫 Token: *#23*\n👨‍⚕️ Dr. Vikram Joshi\n⏰ 10:30 AM\n⏳ Est. wait: 18 mins\n\nSee you soon! 🏥' },
  ],
  'Book a Bed': [
    { from: 'user', text: 'Hi CarePulse! I need to book a hospital bed.' },
    { from: 'bot', text: '🛏️ *Bed Booking*\n\nAvailable wards:\n1️⃣ General Ward — ₹3,500/day (6 beds free)\n2️⃣ Private Room — ₹12,000/day (2 beds free)\n3️⃣ Deluxe Suite — ₹23,000/day (1 bed free)\n\nReply with number.' },
    { from: 'user', text: '1' },
    { from: 'bot', text: '✅ *Bed Booked!*\n\n🛏️ Bed: G-B004\n🏥 General Ward\n💰 ₹3,500/day\n\n📋 Please bring Aadhaar + admission letter.\n\nPM-JAY may cover charges! 🏛️' },
  ],
  'Check Queue Status': [
    { from: 'user', text: 'STATUS' },
    { from: 'bot', text: '📊 *Your Queue Status*\n\n🎫 Token: *#23*\n📍 Position: 3rd in queue\n⏳ Est. wait: *~14 minutes*\n👨‍⚕️ Dr. Vikram Joshi\n🟡 Status: Waiting\n\nWe\'ll WhatsApp you when you\'re next! 🔔' },
  ],
}

export default function WhatsAppSection() {
  const [activeRole, setActiveRole] = useState(0)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)

  const flow = FLOWS[activeRole]

  const openWhatsApp = (message: string) => {
    window.open(
      `https://wa.me/${TWILIO_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  const showChat = (label: string) => {
    setAnimating(true)
    setActiveChat(label)
    setTimeout(() => setAnimating(false), 300)
  }

  const chatMessages = activeChat ? (DEMO_CHATS[activeChat] || []) : []

  return (
    <section className="py-20 px-4" style={{ background: '#F0FDFA' }}>
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
            style={{ background: '#CCFBF1', color: '#0D9488', border: '1.5px solid #99F6E4' }}>
            <span className="text-lg">📲</span>
            WhatsApp Integration — Works on ANY phone, no app needed
          </div>
          <h2 className="text-4xl font-black mb-4" style={{ color: '#0F172A', fontFamily: 'Plus Jakarta Sans' }}>
            Manage Everything via WhatsApp
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#475569' }}>
            Patients, Doctors & Admins can book appointments, check queues,
            and manage the entire hospital — just by sending a WhatsApp message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT — Role Tabs + Actions */}
          <div>
            {/* Role Switcher */}
            <div className="flex gap-2 mb-6 p-1.5 rounded-2xl"
              style={{ background: 'white', border: '1.5px solid #E0F2FE' }}>
              {FLOWS.map((f, i) => (
                <button key={f.role}
                  onClick={() => { setActiveRole(i); setActiveChat(null) }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: activeRole === i ? f.bg : 'transparent',
                    color: activeRole === i ? f.color : '#94A3B8',
                    border: activeRole === i ? `1.5px solid ${f.border}` : '1.5px solid transparent',
                  }}>
                  <span>{f.icon}</span>
                  {f.role}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {flow.actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => showChat(action.label)}
                  className="p-4 rounded-2xl text-left transition-all hover:shadow-md hover:-translate-y-0.5 bg-white"
                  style={{
                    border: `1.5px solid ${activeChat === action.label ? flow.color : '#E0F2FE'}`,
                    boxShadow: activeChat === action.label ? `0 4px 20px ${flow.color}25` : '0 2px 8px rgba(0,0,0,0.04)',
                  }}>
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="font-semibold text-sm" style={{ color: '#0F172A' }}>{action.label}</div>
                  <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>Tap to preview</div>
                </button>
              ))}
            </div>

            {/* Connect Box */}
            <div className="p-5 rounded-3xl"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 32px rgba(37,211,102,0.3)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <div className="font-bold text-white text-base">Connect to CarePulse WhatsApp</div>
                  <div className="text-white/70 text-xs mt-0.5">Send any message to get started</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex gap-4 items-center mb-4">
                <div className="p-2 rounded-xl bg-white flex-shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://wa.me/${TWILIO_NUMBER}?text=HELP&bgcolor=ffffff&color=128C7E`}
                    alt="WhatsApp QR"
                    className="w-20 h-20 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-white/80 text-xs mb-1">Scan QR or tap button below</div>
                  <div className="font-bold text-white text-lg" style={{ fontFamily: 'monospace' }}>
                    {TWILIO_DISPLAY}
                  </div>
                  <div className="text-white/60 text-xs mt-1">Twilio WhatsApp Sandbox</div>
                </div>
              </div>

              <button
                onClick={() => openWhatsApp('HELP')}
                className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: 'white', color: '#128C7E' }}>
                <span className="text-lg">💬</span>
                Open WhatsApp Now →
              </button>
            </div>
          </div>

          {/* RIGHT — Chat Preview */}
          <div className="rounded-3xl overflow-hidden"
            style={{ border: '1.5px solid #E0F2FE', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', background: 'white' }}>

            {/* Phone Header */}
            <div className="px-4 py-3 flex items-center gap-3"
              style={{ background: '#128C7E' }}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🏥</div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">CarePulse AI</div>
                <div className="text-white/70 text-xs">🟢 Online — replies instantly</div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 space-y-3 min-h-80 max-h-96 overflow-y-auto"
              style={{ background: '#ECE5DD' }}>

              {!activeChat ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-5xl mb-3">👆</div>
                  <div className="font-semibold text-sm" style={{ color: '#475569' }}>
                    Tap any action on the left
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                    See a live WhatsApp conversation preview
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="text-4xl mb-3">🤖</div>
                      <div className="text-sm font-semibold" style={{ color: '#475569' }}>
                        This command opens WhatsApp directly
                      </div>
                      <button
                        onClick={() => openWhatsApp(flow.actions.find(a => a.label === activeChat)?.message || 'HELP')}
                        className="mt-3 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                        style={{ background: '#25D366' }}>
                        Try it on WhatsApp →
                      </button>
                    </div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div key={i}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                        style={{ animationDelay: `${i * 0.1}s` }}>
                        <div
                          className="px-3 py-2 rounded-2xl max-w-xs text-sm"
                          style={{
                            background: msg.from === 'user' ? '#DCF8C6' : 'white',
                            color: '#0F172A',
                            borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            whiteSpace: 'pre-line',
                          }}>
                          {msg.from === 'bot' && (
                            <div className="text-xs font-bold mb-1" style={{ color: '#128C7E' }}>
                              CarePulse AI 🏥
                            </div>
                          )}
                          {msg.text}
                          <div className="text-xs mt-1 text-right" style={{ color: '#94A3B8' }}>
                            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {msg.from === 'user' && ' ✓✓'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Try Button */}
            {activeChat && chatMessages.length > 0 && (
              <div className="p-4 border-t" style={{ borderColor: '#F1F5F9' }}>
                <button
                  onClick={() => openWhatsApp(flow.actions.find(a => a.label === activeChat)?.message || 'HELP')}
                  className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                  <span className="text-lg">📲</span>
                  Try "{activeChat}" on WhatsApp →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: '📲', value: 'Any Phone', label: 'No app needed — just WhatsApp' },
            { icon: '⚡', value: 'Instant', label: 'Real-time queue updates' },
            { icon: '🌐', value: 'Hindi + English', label: 'Multilingual support' },
          ].map((stat) => (
            <div key={stat.label}
              className="p-5 rounded-2xl text-center bg-white"
              style={{ border: '1.5px solid #E0F2FE', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-black text-lg" style={{ color: '#0D9488' }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: '#64748B' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}