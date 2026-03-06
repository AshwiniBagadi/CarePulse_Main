// functions/src/index.ts
// ─── CarePulse AI — Firebase Cloud Functions ──────────────────────────────────

/* eslint-disable */
const functions = require('firebase-functions')
const admin     = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

// ─── Twilio Config ────────────────────────────────────────────────────────────
const ACCOUNT_SID   = 'ACd84ae49dbb6a4446985de33e97136799'
const AUTH_TOKEN    = 'ca9c7a27d71d2dd0afb66aa66a35b89c'
const FROM_WHATSAPP = 'whatsapp:+14155238886'

// ─── Session Store (Firestore-backed) ─────────────────────────────────────────

async function getSession(phone: string) {
  const ref  = db.collection('whatsapp_sessions').doc(phone)
  const snap = await ref.get()
  if (snap.exists) {
    const s = snap.data()
    if (Date.now() - s.lastActivity < 30 * 60 * 1000) {
      await ref.update({ lastActivity: Date.now() })
      return s
    }
  }
  const fresh = { step: 'MAIN_MENU', mode: null, data: {}, lastActivity: Date.now() }
  await ref.set(fresh)
  return fresh
}

async function setSession(phone: string, update: object) {
  const current = await getSession(phone)
  await db.collection('whatsapp_sessions').doc(phone).set(
    { ...current, ...update, lastActivity: Date.now() },
    { merge: true }
  )
}

async function clearSession(phone: string) {
  await db.collection('whatsapp_sessions').doc(phone).delete()
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const HOSPITALS = [
  { id: 'h1', name: 'CarePulse General Hospital', address: 'Pune',   wait: 8  },
  { id: 'h2', name: 'City Medical Center',         address: 'Mumbai', wait: 18 },
  { id: 'h3', name: 'Apollo CarePulse',             address: 'Nagpur', wait: 35 },
]

const DEPARTMENTS = [
  { id: 'cardiology',    name: 'Cardiology',       icon: '❤️'  },
  { id: 'orthopedics',   name: 'Orthopedics',      icon: '🦴'  },
  { id: 'general',       name: 'General Medicine', icon: '🩺'  },
  { id: 'neurology',     name: 'Neurology',        icon: '🧠'  },
  { id: 'pediatrics',    name: 'Pediatrics',       icon: '👶'  },
  { id: 'dermatology',   name: 'Dermatology',      icon: '🧴'  },
  { id: 'ophthalmology', name: 'Ophthalmology',    icon: '👁️' },
  { id: 'ent',           name: 'ENT',              icon: '👂'  },
]

const DOCTORS: Record<string, { id: string; name: string; slots: string[] }[]> = {
  cardiology:    [{ id: 'd1',  name: 'Dr. Priya Sharma',  slots: ['9:00 AM',  '10:00 AM', '2:00 PM']  },
                  { id: 'd2',  name: 'Dr. Rajesh Mehta',  slots: ['11:00 AM', '3:00 PM',  '4:00 PM']  }],
  orthopedics:   [{ id: 'd3',  name: 'Dr. Anita Desai',   slots: ['9:30 AM',  '11:30 AM', '1:00 PM']  }],
  general:       [{ id: 'd4',  name: 'Dr. Vikram Joshi',  slots: ['8:00 AM',  '10:30 AM', '3:30 PM']  },
                  { id: 'd5',  name: 'Dr. Sunita Patil',  slots: ['9:00 AM',  '12:00 PM', '4:00 PM']  }],
  neurology:     [{ id: 'd6',  name: 'Dr. Amit Kumar',    slots: ['10:00 AM', '2:00 PM']              }],
  pediatrics:    [{ id: 'd7',  name: 'Dr. Kavita Singh',  slots: ['9:00 AM',  '11:00 AM', '1:00 PM']  }],
  dermatology:   [{ id: 'd8',  name: 'Dr. Neha Gupta',    slots: ['10:30 AM', '2:30 PM',  '4:30 PM']  }],
  ophthalmology: [{ id: 'd9',  name: 'Dr. Suresh Nair',   slots: ['9:00 AM',  '11:00 AM', '3:00 PM']  }],
  ent:           [{ id: 'd10', name: 'Dr. Pooja Verma',   slots: ['8:30 AM',  '12:30 PM', '4:00 PM']  }],
}

const BED_TYPES = [
  { id: 'general', name: 'General Ward',   price: 3500  },
  { id: 'twin',    name: 'Twin Sharing',   price: 4950  },
  { id: 'single',  name: 'Single Classic', price: 12000 },
  { id: 'deluxe',  name: 'Deluxe Single',  price: 16000 },
  { id: 'prince',  name: 'Prince Suite',   price: 18000 },
  { id: 'queen',   name: 'Queen Suite',    price: 23000 },
]

// ─── Core Send ────────────────────────────────────────────────────────────────

async function sendWhatsApp(toPhone: string, message: string) {
  const url  = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`
  const body = new URLSearchParams({
    From: FROM_WHATSAPP,
    To:   `whatsapp:+91${toPhone}`,
    Body: message,
  })
  try {
    const res  = await fetch(url, {
      method:  'POST',
      headers: {
        Authorization:  'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
    const data = await res.json()
    if (data.sid) { console.log('✅ WA sent:', data.sid); return { success: true } }
    console.error('❌ WA failed:', data); return { success: false }
  } catch (err) {
    console.error('❌ WA error:', err); return { success: false }
  }
}

// ─── Menu Builders ────────────────────────────────────────────────────────────

const mainMenu = () =>
`👋 *Welcome to CarePulse AI!*

How can I help you today?

1️⃣  Book OPD Appointment
2️⃣  Book Hospital Bed
3️⃣  Check Queue Status
4️⃣  Cancel Appointment

_Reply with a number (1–4)_`

const hospitalMenu = () => {
  const list = HOSPITALS.map((h, i) =>
    `${i + 1}️⃣  *${h.name}*\n    📍 ${h.address}  ⏱ ~${h.wait} min wait`
  ).join('\n\n')
  return `🏥 *Select Hospital:*\n\n${list}\n\n_Reply with 1, 2 or 3_`
}

const departmentMenu = () => {
  const list = DEPARTMENTS.map((d, i) => `${i + 1}️⃣  ${d.icon} ${d.name}`).join('\n')
  return `🏨 *Select Department:*\n\n${list}\n\n_Reply with a number (1–${DEPARTMENTS.length})_`
}

const doctorMenu = (deptId: string) => {
  const docs = DOCTORS[deptId] || DOCTORS['general']
  const list = docs.map((d, i) => `${i + 1}️⃣  👨‍⚕️ ${d.name}`).join('\n')
  return `🩺 *Select Doctor:*\n\n${list}\n\n_Reply with a number_`
}

const slotMenu = (deptId: string, doctorIdx: number) => {
  const docs = DOCTORS[deptId] || DOCTORS['general']
  const doc  = docs[doctorIdx]
  if (!doc) return '❌ Invalid doctor. Reply *MENU* to restart.'
  const list = doc.slots.map((s, i) => `${i + 1}️⃣  🕐 ${s}`).join('\n')
  return `⏰ *Available Slots — ${doc.name}:*\n\n${list}\n\n_Reply with a number_`
}

const bedMenu = () => {
  const list = BED_TYPES.map((b, i) =>
    `${i + 1}️⃣  🛏️ *${b.name}* — ₹${b.price.toLocaleString()}/day`
  ).join('\n')
  return `🛏️ *Select Bed Type:*\n\n${list}\n\n_Reply with a number (1–${BED_TYPES.length})_`
}

const opdConfirmMsg = (d: Record<string, string>) =>
`📋 *Confirm OPD Appointment:*

🏥 Hospital:   ${d.hospitalName}
🏨 Department: ${d.deptName}
👨‍⚕️ Doctor:    ${d.doctorName}
🕐 Slot:       ${d.slot}
📅 Date:       ${d.date}
👤 Patient:    ${d.patientName}
🤒 Symptoms:   ${d.symptoms}

💰 Doctor Fee: ₹1,400 + Booking: ₹100
⚠️ _Ayushman Bharat benefit may apply_

Reply *YES* to confirm or *NO* to cancel.`

const bedConfirmMsg = (d: Record<string, string>) =>
`📋 *Confirm Bed Booking:*

🏥 Hospital:  ${d.hospitalName}
🛏️ Bed Type:  ${d.bedName}
💰 Price:     ₹${Number(d.bedPrice).toLocaleString()}/day
👤 Patient:   ${d.patientName}
📱 Mobile:    ${d.mobile}
👤 Gender:    ${d.gender}
🪪 Aadhaar:   ${d.aadhaar}
👨‍⚕️ Doctor:   ${d.doctorName}
📋 Reason:    ${d.reason}
📅 Date:      ${d.date}

⚠️ _PM-JAY may cover bed charges_
_Bed class subject to availability._

Reply *YES* to confirm or *NO* to cancel.`

// ─── Firebase Save ────────────────────────────────────────────────────────────

async function confirmOpdBooking(phone: string, data: Record<string, string>) {
  try {
    const tokenNumber = Math.floor(Math.random() * 50) + 1
    const ref = await db.collection('appointments').add({
      patientId:    `wa_${phone}`,
      patientName:  data.patientName,
      hospitalId:   data.hospitalId,
      departmentId: data.deptId,
      doctorId:     data.doctorId,
      slot:         data.slot,
      date:         data.date,
      symptoms:     data.symptoms,
      tokenNumber,
      mode:     'opd',
      status:   'booked',
      source:   'whatsapp',
      bookedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    await db.collection('queue').add({
      appointmentId: ref.id,
      doctorId:      data.doctorId,
      hospitalId:    data.hospitalId,
      patientId:     `wa_${phone}`,
      tokenNumber,
      status:    'waiting',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    await clearSession(phone)
    return sendWhatsApp(phone,
`✅ *Appointment Confirmed!*

🎫 Token Number: *#${tokenNumber}*
🏥 ${data.hospitalName}
👨‍⚕️ ${data.doctorName}
🕐 ${data.slot} on ${data.date}
👤 ${data.patientName}

📲 Reply *STATUS* to check queue.
Reply *MENU* for main menu.

_CarePulse AI — Smart Healthcare_ 🩺`)
  } catch (err) {
    console.error('OPD booking error:', err)
    return sendWhatsApp(phone, `❌ Booking failed. Please try again.\n\nReply *MENU* to restart.`)
  }
}

async function confirmBedBooking(phone: string, data: Record<string, string>) {
  try {
    await db.collection('bedBookings').add({
      patientId:   `wa_${phone}`,
      patientName: data.patientName,
      mobile:      data.mobile,
      gender:      data.gender,
      aadhaar:     data.aadhaar,
      doctorName:  data.doctorName,
      reason:      data.reason,
      date:        data.date,
      hospitalId:  data.hospitalId,
      bedType:     data.bedId,
      bedName:     data.bedName,
      pricePerDay: Number(data.bedPrice),
      status:   'pending',
      source:   'whatsapp',
      bookedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    await clearSession(phone)
    return sendWhatsApp(phone,
`✅ *Bed Booking Request Submitted!*

🛏️ ${data.bedName}
🏥 ${data.hospitalName}
👤 ${data.patientName}
📅 ${data.date}
💰 ₹${Number(data.bedPrice).toLocaleString()}/day

⏳ Our team will confirm within *2 hours*.

Reply *MENU* for main menu.

_CarePulse AI — Smart Healthcare_ 🩺`)
  } catch (err) {
    console.error('Bed booking error:', err)
    return sendWhatsApp(phone, `❌ Booking failed. Please try again.\n\nReply *MENU* to restart.`)
  }
}

async function handleQueueStatus(phone: string) {
  try {
    const snap = await db.collection('appointments')
      .where('patientId', '==', `wa_${phone}`)
      .where('status', 'in', ['booked', 'waiting', 'checkedIn', 'serving'])
      .limit(1)
      .get()
    if (snap.empty) {
      return sendWhatsApp(phone,
        `📋 *No Active Appointments*\n\nNo bookings found.\n\nReply *1* to book an appointment.\nReply *MENU* for main menu.`)
    }
    const appt = snap.docs[0].data()
    const emoji = appt.status === 'serving' ? '🟢' : appt.status === 'checkedIn' ? '✅' : '⏳'
    return sendWhatsApp(phone,
`${emoji} *Your Queue Status:*

🎫 Token: *#${appt.tokenNumber}*
👨‍⚕️ Doctor: ${appt.doctorId}
🕐 Slot: ${appt.slot}
📊 Status: ${appt.status}
⏱ Est. Wait: ${appt.estimatedWait || 0} min

Reply *MENU* for main menu.`)
  } catch (err) {
    return sendWhatsApp(phone, `❌ Could not fetch queue. Try again.\n\nReply *MENU* for main menu.`)
  }
}

// ─── Main Conversation Handler ────────────────────────────────────────────────

async function handleIncomingWhatsApp(fromRaw: string, bodyText: string) {
  const phone = fromRaw.replace('whatsapp:+91', '').replace('whatsapp:+', '')
  const text  = bodyText.trim()
  const upper = text.toUpperCase()

  if (['MENU', 'HI', 'HELLO', 'START', 'RESTART', '0'].includes(upper)) {
    await clearSession(phone)
    return sendWhatsApp(phone, mainMenu())
  }

  const session = await getSession(phone)

  // ── MAIN MENU ──────────────────────────────────────────────────────────────
  if (session.step === 'MAIN_MENU') {
    if (text === '1') { await setSession(phone, { step: 'OPD_HOSPITAL', mode: 'opd' }); return sendWhatsApp(phone, hospitalMenu()) }
    if (text === '2') { await setSession(phone, { step: 'BED_HOSPITAL', mode: 'bed' }); return sendWhatsApp(phone, hospitalMenu()) }
    if (text === '3') return handleQueueStatus(phone)
    if (text === '4') return sendWhatsApp(phone, `❌ *Cancel Appointment*\n\nCall: 📞 *1800-CAREPULSE*\n🕐 9 AM – 6 PM\n\nReply *MENU* for main menu.`)
    return sendWhatsApp(phone, `❓ Please reply with *1, 2, 3 or 4*.\n\n${mainMenu()}`)
  }

  // ── OPD: Hospital ──────────────────────────────────────────────────────────
  if (session.step === 'OPD_HOSPITAL') {
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= HOSPITALS.length) return sendWhatsApp(phone, `❌ Reply 1–${HOSPITALS.length}.\n\n${hospitalMenu()}`)
    const h = HOSPITALS[idx]
    await setSession(phone, { step: 'OPD_DEPARTMENT', data: { ...session.data, hospitalId: h.id, hospitalName: h.name } })
    return sendWhatsApp(phone, departmentMenu())
  }

  // ── OPD: Department ────────────────────────────────────────────────────────
  if (session.step === 'OPD_DEPARTMENT') {
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= DEPARTMENTS.length) return sendWhatsApp(phone, `❌ Reply 1–${DEPARTMENTS.length}.\n\n${departmentMenu()}`)
    const d = DEPARTMENTS[idx]
    await setSession(phone, { step: 'OPD_DOCTOR', data: { ...session.data, deptId: d.id, deptName: d.name } })
    return sendWhatsApp(phone, doctorMenu(d.id))
  }

  // ── OPD: Doctor ────────────────────────────────────────────────────────────
  if (session.step === 'OPD_DOCTOR') {
    const docs = DOCTORS[session.data.deptId] || DOCTORS['general']
    const idx  = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= docs.length) return sendWhatsApp(phone, `❌ Reply 1–${docs.length}.\n\n${doctorMenu(session.data.deptId)}`)
    const doc = docs[idx]
    await setSession(phone, { step: 'OPD_SLOT', data: { ...session.data, doctorId: doc.id, doctorName: doc.name, doctorIdx: String(idx) } })
    return sendWhatsApp(phone, slotMenu(session.data.deptId, idx))
  }

  // ── OPD: Slot ──────────────────────────────────────────────────────────────
  if (session.step === 'OPD_SLOT') {
    const docs = DOCTORS[session.data.deptId] || DOCTORS['general']
    const dIdx = parseInt(session.data.doctorIdx)
    const doc  = docs[dIdx]
    const sIdx = parseInt(text) - 1
    if (!doc || isNaN(sIdx) || sIdx < 0 || sIdx >= doc.slots.length)
      return sendWhatsApp(phone, `❌ Reply 1–${doc ? doc.slots.length : 3}.\n\n${slotMenu(session.data.deptId, dIdx)}`)
    await setSession(phone, { step: 'OPD_DATE', data: { ...session.data, slot: doc.slots[sIdx] } })
    return sendWhatsApp(phone, `📅 *Enter Appointment Date:*\n\nFormat: *DD-MM-YYYY*\nExample: 15-03-2026`)
  }

  // ── OPD: Date ──────────────────────────────────────────────────────────────
  if (session.step === 'OPD_DATE') {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(text)) return sendWhatsApp(phone, `❌ Use format *DD-MM-YYYY*\nExample: 15-03-2026`)
    await setSession(phone, { step: 'OPD_PATIENT_NAME', data: { ...session.data, date: text } })
    return sendWhatsApp(phone, `👤 *Enter Patient's Full Name:*`)
  }

  // ── OPD: Patient Name ──────────────────────────────────────────────────────
  if (session.step === 'OPD_PATIENT_NAME') {
    if (text.length < 3) return sendWhatsApp(phone, `❌ Please enter a valid name.`)
    await setSession(phone, { step: 'OPD_SYMPTOMS', data: { ...session.data, patientName: text } })
    return sendWhatsApp(phone, `🤒 *Describe Symptoms:*\n\n(e.g. fever, chest pain)\nOr reply *SKIP*`)
  }

  // ── OPD: Symptoms ──────────────────────────────────────────────────────────
  if (session.step === 'OPD_SYMPTOMS') {
    const newData = { ...session.data, symptoms: upper === 'SKIP' ? 'Not specified' : text }
    await setSession(phone, { step: 'OPD_CONFIRM', data: newData })
    return sendWhatsApp(phone, opdConfirmMsg(newData))
  }

  // ── OPD: Confirm ───────────────────────────────────────────────────────────
  if (session.step === 'OPD_CONFIRM') {
    if (upper === 'YES' || text === '1') return confirmOpdBooking(phone, session.data)
    if (upper === 'NO'  || text === '2') { await clearSession(phone); return sendWhatsApp(phone, `❌ Booking cancelled.\n\n${mainMenu()}`) }
    return sendWhatsApp(phone, `Reply *YES* to confirm or *NO* to cancel.`)
  }

  // ── BED: Hospital ──────────────────────────────────────────────────────────
  if (session.step === 'BED_HOSPITAL') {
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= HOSPITALS.length) return sendWhatsApp(phone, `❌ Reply 1–${HOSPITALS.length}.\n\n${hospitalMenu()}`)
    const h = HOSPITALS[idx]
    await setSession(phone, { step: 'BED_TYPE', data: { ...session.data, hospitalId: h.id, hospitalName: h.name } })
    return sendWhatsApp(phone, bedMenu())
  }

  // ── BED: Type ──────────────────────────────────────────────────────────────
  if (session.step === 'BED_TYPE') {
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= BED_TYPES.length) return sendWhatsApp(phone, `❌ Reply 1–${BED_TYPES.length}.\n\n${bedMenu()}`)
    const bed = BED_TYPES[idx]
    await setSession(phone, { step: 'BED_PATIENT_NAME', data: { ...session.data, bedId: bed.id, bedName: bed.name, bedPrice: String(bed.price) } })
    return sendWhatsApp(phone, `👤 *Enter Patient's Full Name:*`)
  }

  // ── BED: Patient Name ──────────────────────────────────────────────────────
  if (session.step === 'BED_PATIENT_NAME') {
    if (text.length < 3) return sendWhatsApp(phone, `❌ Please enter a valid name.`)
    await setSession(phone, { step: 'BED_MOBILE', data: { ...session.data, patientName: text } })
    return sendWhatsApp(phone, `📱 *Enter Patient's Mobile Number:*\n(10 digits, no country code)`)
  }

  // ── BED: Mobile ────────────────────────────────────────────────────────────
  if (session.step === 'BED_MOBILE') {
    if (!/^\d{10}$/.test(text)) return sendWhatsApp(phone, `❌ Enter 10 digits.\nExample: 9876543210`)
    await setSession(phone, { step: 'BED_GENDER', data: { ...session.data, mobile: text } })
    return sendWhatsApp(phone, `👤 *Select Gender:*\n\n1️⃣  Male\n2️⃣  Female\n3️⃣  Other\n\n_Reply 1, 2 or 3_`)
  }

  // ── BED: Gender ────────────────────────────────────────────────────────────
  if (session.step === 'BED_GENDER') {
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx > 2) return sendWhatsApp(phone, `❌ Reply 1, 2 or 3.`)
    await setSession(phone, { step: 'BED_AADHAAR', data: { ...session.data, gender: ['Male', 'Female', 'Other'][idx] } })
    return sendWhatsApp(phone, `🪪 *Enter Aadhaar Number:*\n(12 digits)\nOr reply *SKIP*`)
  }

  // ── BED: Aadhaar ───────────────────────────────────────────────────────────
  if (session.step === 'BED_AADHAAR') {
    if (upper !== 'SKIP' && !/^\d{12}$/.test(text)) return sendWhatsApp(phone, `❌ Aadhaar must be 12 digits or reply *SKIP*.`)
    await setSession(phone, { step: 'BED_DOCTOR', data: { ...session.data, aadhaar: upper === 'SKIP' ? 'Not provided' : text } })
    return sendWhatsApp(phone, `👨‍⚕️ *Doctor who advised admission:*\n(Or reply *SKIP*)`)
  }

  // ── BED: Doctor ────────────────────────────────────────────────────────────
  if (session.step === 'BED_DOCTOR') {
    await setSession(phone, { step: 'BED_REASON', data: { ...session.data, doctorName: upper === 'SKIP' ? 'Not specified' : text } })
    return sendWhatsApp(phone, `📋 *Reason for Admission:*\n\n1️⃣  Surgery\n2️⃣  Medical Treatment\n3️⃣  Observation\n4️⃣  Delivery / Maternity\n5️⃣  Emergency\n6️⃣  Other\n\n_Reply 1–6_`)
  }

  // ── BED: Reason ────────────────────────────────────────────────────────────
  if (session.step === 'BED_REASON') {
    const reasons = ['Surgery', 'Medical Treatment', 'Observation', 'Delivery / Maternity', 'Emergency', 'Other']
    const idx = parseInt(text) - 1
    if (isNaN(idx) || idx < 0 || idx >= reasons.length) return sendWhatsApp(phone, `❌ Reply 1–6.`)
    await setSession(phone, { step: 'BED_DATE', data: { ...session.data, reason: reasons[idx] } })
    return sendWhatsApp(phone, `📅 *Preferred Admission Date:*\n\nFormat: *DD-MM-YYYY*\nExample: 15-03-2026`)
  }

  // ── BED: Date ──────────────────────────────────────────────────────────────
  if (session.step === 'BED_DATE') {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(text)) return sendWhatsApp(phone, `❌ Use format *DD-MM-YYYY*`)
    const newData = { ...session.data, date: text }
    await setSession(phone, { step: 'BED_CONFIRM', data: newData })
    return sendWhatsApp(phone, bedConfirmMsg(newData))
  }

  // ── BED: Confirm ───────────────────────────────────────────────────────────
  if (session.step === 'BED_CONFIRM') {
    if (upper === 'YES' || text === '1') return confirmBedBooking(phone, session.data)
    if (upper === 'NO'  || text === '2') { await clearSession(phone); return sendWhatsApp(phone, `❌ Booking cancelled.\n\n${mainMenu()}`) }
    return sendWhatsApp(phone, `Reply *YES* to confirm or *NO* to cancel.`)
  }

  // ── Fallback ───────────────────────────────────────────────────────────────
  await clearSession(phone)
  return sendWhatsApp(phone, `🤔 I didn't understand that.\n\n${mainMenu()}`)
}

// ─── Exported Firebase Function ───────────────────────────────────────────────

exports.whatsappWebhook = functions
  .region('us-central1')
  .https.onRequest(async (req: any, res: any) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed')
      return
    }
    const from: string = req.body.From || ''
    const body: string = req.body.Body || ''
    console.log(`📩 WA incoming from ${from}: "${body}"`)
    res.set('Content-Type', 'text/xml')
    res.send('<Response></Response>')
    try {
      await handleIncomingWhatsApp(from, body)
    } catch (err) {
      console.error('Handler error:', err)
    }
  })

exports.notifyAppointmentConfirmed = functions.firestore
  .document('appointments/{id}')
  .onCreate(async (snap: any) => {
    const appt = snap.data()
    if (appt.source !== 'whatsapp' && appt.patientPhone) {
      await sendWhatsApp(appt.patientPhone,
`🏥 *Appointment Confirmed — CarePulse AI*

Hello ${appt.patientName}!
🎫 Token: *#${appt.tokenNumber}*
🕐 ${appt.slot} on ${appt.date}

Reply *STATUS* to track your queue.

_CarePulse AI_ 🩺`)
    }
  })