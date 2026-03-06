"use strict";
// src/lib/whatsapp.ts
// ─── CarePulse AI — Full WhatsApp Conversational Booking Bot ───────────────
// ALL booking flows happen inside WhatsApp. No website redirects.
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeCheckIn = exports.sendEmergencyAlert = exports.sendTokenSkipped = exports.sendFeedbackRequest = exports.sendAppointmentReminder = exports.sendYourTurnNow = exports.sendYouAreNextAlert = exports.sendAppointmentConfirmation = exports.handleIncomingWhatsApp = exports.sendWhatsApp = void 0;
const firestore_1 = require("firebase/firestore");
const config_1 = require("./config");
const ACCOUNT_SID = 'ACd84ae49dbb6a4446985de33e97136799';
const AUTH_TOKEN = 'ca9c7a27d71d2dd0afb66aa66a35b89c';
const FROM_WHATSAPP = 'whatsapp:+14155238886';
const sessions = new Map();
function getSession(phone) {
    // Expire sessions older than 30 minutes
    const existing = sessions.get(phone);
    if (existing && Date.now() - existing.lastActivity < 30 * 60 * 1000) {
        existing.lastActivity = Date.now();
        return existing;
    }
    const fresh = { step: 'MAIN_MENU', mode: null, data: {}, lastActivity: Date.now() };
    sessions.set(phone, fresh);
    return fresh;
}
function setSession(phone, update) {
    const current = getSession(phone);
    sessions.set(phone, Object.assign(Object.assign(Object.assign({}, current), update), { lastActivity: Date.now() }));
}
function clearSession(phone) {
    sessions.delete(phone);
}
// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA  (mirrors your BedBooking.tsx + BookAppointment.tsx)
// ─────────────────────────────────────────────────────────────────────────────
const HOSPITALS = [
    { id: 'h1', name: 'CarePulse General Hospital', address: 'Pune', wait: 8 },
    { id: 'h2', name: 'City Medical Center', address: 'Mumbai', wait: 18 },
    { id: 'h3', name: 'Apollo CarePulse', address: 'Nagpur', wait: 35 },
];
const DEPARTMENTS = [
    { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
    { id: 'general', name: 'General Medicine', icon: '🩺' },
    { id: 'neurology', name: 'Neurology', icon: '🧠' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️' },
    { id: 'ent', name: 'ENT', icon: '👂' },
];
const DOCTORS = {
    cardiology: [{ id: 'd1', name: 'Dr. Priya Sharma', slots: ['9:00 AM', '10:00 AM', '2:00 PM'] },
        { id: 'd2', name: 'Dr. Rajesh Mehta', slots: ['11:00 AM', '3:00 PM', '4:00 PM'] }],
    orthopedics: [{ id: 'd3', name: 'Dr. Anita Desai', slots: ['9:30 AM', '11:30 AM', '1:00 PM'] }],
    general: [{ id: 'd4', name: 'Dr. Vikram Joshi', slots: ['8:00 AM', '10:30 AM', '3:30 PM'] },
        { id: 'd5', name: 'Dr. Sunita Patil', slots: ['9:00 AM', '12:00 PM', '4:00 PM'] }],
    neurology: [{ id: 'd6', name: 'Dr. Amit Kumar', slots: ['10:00 AM', '2:00 PM'] }],
    pediatrics: [{ id: 'd7', name: 'Dr. Kavita Singh', slots: ['9:00 AM', '11:00 AM', '1:00 PM'] }],
    dermatology: [{ id: 'd8', name: 'Dr. Neha Gupta', slots: ['10:30 AM', '2:30 PM', '4:30 PM'] }],
    ophthalmology: [{ id: 'd9', name: 'Dr. Suresh Nair', slots: ['9:00 AM', '11:00 AM', '3:00 PM'] }],
    ent: [{ id: 'd10', name: 'Dr. Pooja Verma', slots: ['8:30 AM', '12:30 PM', '4:00 PM'] }],
};
const BED_TYPES = [
    { id: 'general', name: 'General Ward', price: 3500 },
    { id: 'twin', name: 'Twin Sharing', price: 4950 },
    { id: 'single', name: 'Single Classic', price: 12000 },
    { id: 'deluxe', name: 'Deluxe Single', price: 16000 },
    { id: 'prince', name: 'Prince Suite', price: 18000 },
    { id: 'queen', name: 'Queen Suite', price: 23000 },
];
// ─────────────────────────────────────────────────────────────────────────────
// CORE SEND
// ─────────────────────────────────────────────────────────────────────────────
async function sendWhatsApp(toPhone, message) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    const body = new URLSearchParams({
        From: FROM_WHATSAPP,
        To: `whatsapp:+91${toPhone}`,
        Body: message,
    });
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });
        const data = await res.json();
        if (data.sid) {
            console.log('✅ WA sent:', data.sid);
            return { success: true, sid: data.sid };
        }
        console.error('❌ WA failed:', data);
        return { success: false, error: data };
    }
    catch (err) {
        console.error('❌ WA error:', err);
        return { success: false, error: err };
    }
}
exports.sendWhatsApp = sendWhatsApp;
// ─────────────────────────────────────────────────────────────────────────────
// MENU BUILDERS
// ─────────────────────────────────────────────────────────────────────────────
function mainMenu() {
    return `👋 *Welcome to CarePulse AI!*

How can I help you today?

1️⃣  Book OPD Appointment
2️⃣  Book Hospital Bed
3️⃣  Check Queue Status
4️⃣  Cancel Appointment

_Reply with a number (1–4)_`;
}
function hospitalMenu() {
    const list = HOSPITALS.map((h, i) => `${i + 1}️⃣  ${h.name}\n    📍 ${h.address}  ⏱ ~${h.wait} min wait`).join('\n\n');
    return `🏥 *Select Hospital:*\n\n${list}\n\n_Reply with 1, 2 or 3_`;
}
function departmentMenu() {
    const list = DEPARTMENTS.map((d, i) => `${i + 1}️⃣  ${d.icon} ${d.name}`).join('\n');
    return `🏨 *Select Department:*\n\n${list}\n\n_Reply with a number (1–${DEPARTMENTS.length})_`;
}
function doctorMenu(deptId) {
    const docs = DOCTORS[deptId] || DOCTORS.general;
    const list = docs.map((d, i) => `${i + 1}️⃣  👨‍⚕️ ${d.name}`).join('\n');
    return `🩺 *Select Doctor:*\n\n${list}\n\n_Reply with a number_`;
}
function slotMenu(deptId, doctorIdx) {
    const docs = DOCTORS[deptId] || DOCTORS.general;
    const doc = docs[doctorIdx];
    if (!doc)
        return '❌ Invalid doctor. Reply *MENU* to restart.';
    const list = doc.slots.map((s, i) => `${i + 1}️⃣  🕐 ${s}`).join('\n');
    return `⏰ *Available Slots for ${doc.name}:*\n\n${list}\n\n_Reply with a number_`;
}
function bedMenu() {
    const list = BED_TYPES.map((b, i) => `${i + 1}️⃣  🛏️ ${b.name} — ₹${b.price.toLocaleString()}/day`).join('\n');
    return `🛏️ *Select Bed Type:*\n\n${list}\n\n_Reply with a number (1–${BED_TYPES.length})_`;
}
// ─────────────────────────────────────────────────────────────────────────────
// MAIN WEBHOOK HANDLER
// Call this from your backend endpoint: POST /api/whatsapp/webhook
// Twilio sends: { From: 'whatsapp:+919...',  Body: 'user text' }
// ─────────────────────────────────────────────────────────────────────────────
async function handleIncomingWhatsApp(fromRaw, // e.g. "whatsapp:+919876543210"
body) {
    // Strip prefix & country code so phone = "9876543210"
    const phone = fromRaw.replace('whatsapp:+91', '').replace('whatsapp:+', '');
    const text = body.trim();
    const upper = text.toUpperCase();
    // Global reset keywords
    if (['MENU', 'HI', 'HELLO', 'START', 'RESTART', '0'].includes(upper)) {
        clearSession(phone);
        return sendWhatsApp(phone, mainMenu());
    }
    const session = getSession(phone);
    // ── MAIN MENU ──────────────────────────────────────────────────────────────
    if (session.step === 'MAIN_MENU') {
        if (text === '1') {
            setSession(phone, { step: 'OPD_HOSPITAL', mode: 'opd' });
            return sendWhatsApp(phone, hospitalMenu());
        }
        if (text === '2') {
            setSession(phone, { step: 'BED_HOSPITAL', mode: 'bed' });
            return sendWhatsApp(phone, hospitalMenu());
        }
        if (text === '3') {
            return handleQueueStatus(phone);
        }
        if (text === '4') {
            return handleCancelAppointment(phone);
        }
        return sendWhatsApp(phone, `❓ Please reply with *1, 2, 3 or 4*.\n\n${mainMenu()}`);
    }
    // ── OPD FLOW ───────────────────────────────────────────────────────────────
    if (session.step === 'OPD_HOSPITAL') {
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx >= HOSPITALS.length)
            return sendWhatsApp(phone, `❌ Please reply 1–${HOSPITALS.length}.\n\n${hospitalMenu()}`);
        const hospital = HOSPITALS[idx];
        setSession(phone, { step: 'OPD_DEPARTMENT', data: Object.assign(Object.assign({}, session.data), { hospitalId: hospital.id, hospitalName: hospital.name }) });
        return sendWhatsApp(phone, departmentMenu());
    }
    if (session.step === 'OPD_DEPARTMENT') {
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx >= DEPARTMENTS.length)
            return sendWhatsApp(phone, `❌ Please reply 1–${DEPARTMENTS.length}.\n\n${departmentMenu()}`);
        const dept = DEPARTMENTS[idx];
        setSession(phone, { step: 'OPD_DOCTOR', data: Object.assign(Object.assign({}, session.data), { deptId: dept.id, deptName: dept.name }) });
        return sendWhatsApp(phone, doctorMenu(dept.id));
    }
    if (session.step === 'OPD_DOCTOR') {
        const docs = DOCTORS[session.data.deptId] || DOCTORS.general;
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx >= docs.length)
            return sendWhatsApp(phone, `❌ Please reply 1–${docs.length}.\n\n${doctorMenu(session.data.deptId)}`);
        const doc = docs[idx];
        setSession(phone, { step: 'OPD_SLOT', data: Object.assign(Object.assign({}, session.data), { doctorId: doc.id, doctorName: doc.name, doctorIdx: String(idx) }) });
        return sendWhatsApp(phone, slotMenu(session.data.deptId, idx));
    }
    if (session.step === 'OPD_SLOT') {
        const docs = DOCTORS[session.data.deptId] || DOCTORS.general;
        const dIdx = parseInt(session.data.doctorIdx);
        const doc = docs[dIdx];
        const sIdx = parseInt(text) - 1;
        if (!doc || isNaN(sIdx) || sIdx < 0 || sIdx >= doc.slots.length)
            return sendWhatsApp(phone, `❌ Please reply 1–${(doc === null || doc === void 0 ? void 0 : doc.slots.length) || 3}.\n\n${slotMenu(session.data.deptId, dIdx)}`);
        const slot = doc.slots[sIdx];
        setSession(phone, { step: 'OPD_DATE', data: Object.assign(Object.assign({}, session.data), { slot }) });
        return sendWhatsApp(phone, `📅 *Enter Appointment Date:*\n\nPlease reply in format:\n*DD-MM-YYYY*\n\nExample: 15-03-2026`);
    }
    if (session.step === 'OPD_DATE') {
        if (!/^\d{2}-\d{2}-\d{4}$/.test(text))
            return sendWhatsApp(phone, `❌ Invalid format. Please reply as *DD-MM-YYYY*\nExample: 15-03-2026`);
        setSession(phone, { step: 'OPD_PATIENT_NAME', data: Object.assign(Object.assign({}, session.data), { date: text }) });
        return sendWhatsApp(phone, `👤 *Enter Patient's Full Name:*`);
    }
    if (session.step === 'OPD_PATIENT_NAME') {
        if (text.length < 3)
            return sendWhatsApp(phone, `❌ Please enter a valid name.`);
        setSession(phone, { step: 'OPD_SYMPTOMS', data: Object.assign(Object.assign({}, session.data), { patientName: text }) });
        return sendWhatsApp(phone, `🤒 *Describe Symptoms:*\n\n(e.g. fever, chest pain, headache)\nOr reply *SKIP* to skip.`);
    }
    if (session.step === 'OPD_SYMPTOMS') {
        const symptoms = upper === 'SKIP' ? 'Not specified' : text;
        setSession(phone, { step: 'OPD_CONFIRM', data: Object.assign(Object.assign({}, session.data), { symptoms }) });
        const d = Object.assign(Object.assign({}, session.data), { symptoms });
        return sendWhatsApp(phone, opdConfirmMessage(d));
    }
    if (session.step === 'OPD_CONFIRM') {
        if (upper === 'YES' || text === '1') {
            return confirmOpdBooking(phone, session.data);
        }
        if (upper === 'NO' || text === '2') {
            clearSession(phone);
            return sendWhatsApp(phone, `❌ Booking cancelled.\n\n${mainMenu()}`);
        }
        return sendWhatsApp(phone, `Please reply *YES* to confirm or *NO* to cancel.`);
    }
    // ── BED FLOW ───────────────────────────────────────────────────────────────
    if (session.step === 'BED_HOSPITAL') {
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx >= HOSPITALS.length)
            return sendWhatsApp(phone, `❌ Please reply 1–${HOSPITALS.length}.\n\n${hospitalMenu()}`);
        const hospital = HOSPITALS[idx];
        setSession(phone, { step: 'BED_TYPE', data: Object.assign(Object.assign({}, session.data), { hospitalId: hospital.id, hospitalName: hospital.name }) });
        return sendWhatsApp(phone, bedMenu());
    }
    if (session.step === 'BED_TYPE') {
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx >= BED_TYPES.length)
            return sendWhatsApp(phone, `❌ Please reply 1–${BED_TYPES.length}.\n\n${bedMenu()}`);
        const bed = BED_TYPES[idx];
        setSession(phone, { step: 'BED_PATIENT_NAME', data: Object.assign(Object.assign({}, session.data), { bedId: bed.id, bedName: bed.name, bedPrice: String(bed.price) }) });
        return sendWhatsApp(phone, `👤 *Enter Patient's Full Name:*`);
    }
    if (session.step === 'BED_PATIENT_NAME') {
        if (text.length < 3)
            return sendWhatsApp(phone, `❌ Please enter a valid name.`);
        setSession(phone, { step: 'BED_MOBILE', data: Object.assign(Object.assign({}, session.data), { patientName: text }) });
        return sendWhatsApp(phone, `📱 *Enter Patient's Mobile Number:*\n(10 digits, without country code)`);
    }
    if (session.step === 'BED_MOBILE') {
        if (!/^\d{10}$/.test(text))
            return sendWhatsApp(phone, `❌ Invalid mobile number. Please enter 10 digits.\nExample: 9876543210`);
        setSession(phone, { step: 'BED_GENDER', data: Object.assign(Object.assign({}, session.data), { mobile: text }) });
        return sendWhatsApp(phone, `👤 *Select Gender:*\n\n1️⃣  Male\n2️⃣  Female\n3️⃣  Other\n\n_Reply with 1, 2 or 3_`);
    }
    if (session.step === 'BED_GENDER') {
        const genders = ['Male', 'Female', 'Other'];
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx > 2)
            return sendWhatsApp(phone, `❌ Please reply 1, 2 or 3.`);
        setSession(phone, { step: 'BED_AADHAAR', data: Object.assign(Object.assign({}, session.data), { gender: genders[idx] }) });
        return sendWhatsApp(phone, `🪪 *Enter Aadhaar Number:*\n(12 digits)\nOr reply *SKIP* to skip.`);
    }
    if (session.step === 'BED_AADHAAR') {
        if (upper !== 'SKIP' && !/^\d{12}$/.test(text))
            return sendWhatsApp(phone, `❌ Aadhaar must be 12 digits. Try again or reply *SKIP*.`);
        const aadhaar = upper === 'SKIP' ? 'Not provided' : text;
        setSession(phone, { step: 'BED_DOCTOR', data: Object.assign(Object.assign({}, session.data), { aadhaar }) });
        return sendWhatsApp(phone, `👨‍⚕️ *Enter Name of Doctor who advised admission:*\n(Or reply *SKIP*)`);
    }
    if (session.step === 'BED_DOCTOR') {
        const doctorName = upper === 'SKIP' ? 'Not specified' : text;
        setSession(phone, { step: 'BED_REASON', data: Object.assign(Object.assign({}, session.data), { doctorName }) });
        return sendWhatsApp(phone, `📋 *Reason for Admission:*\n\n1️⃣  Surgery\n2️⃣  Medical Treatment\n3️⃣  Observation\n4️⃣  Delivery / Maternity\n5️⃣  Emergency\n6️⃣  Other\n\n_Reply with 1–6_`);
    }
    if (session.step === 'BED_REASON') {
        const reasons = ['Surgery', 'Medical Treatment', 'Observation', 'Delivery / Maternity', 'Emergency', 'Other'];
        const idx = parseInt(text) - 1;
        if (isNaN(idx) || idx < 0 || idx >= reasons.length)
            return sendWhatsApp(phone, `❌ Please reply 1–6.`);
        setSession(phone, { step: 'BED_DATE', data: Object.assign(Object.assign({}, session.data), { reason: reasons[idx] }) });
        return sendWhatsApp(phone, `📅 *Preferred Admission Date:*\n\nReply in format: *DD-MM-YYYY*\nExample: 15-03-2026`);
    }
    if (session.step === 'BED_DATE') {
        if (!/^\d{2}-\d{2}-\d{4}$/.test(text))
            return sendWhatsApp(phone, `❌ Invalid format. Please reply as *DD-MM-YYYY*`);
        setSession(phone, { step: 'BED_CONFIRM', data: Object.assign(Object.assign({}, session.data), { date: text }) });
        const d = Object.assign(Object.assign({}, session.data), { date: text });
        return sendWhatsApp(phone, bedConfirmMessage(d));
    }
    if (session.step === 'BED_CONFIRM') {
        if (upper === 'YES' || text === '1') {
            return confirmBedBooking(phone, session.data);
        }
        if (upper === 'NO' || text === '2') {
            clearSession(phone);
            return sendWhatsApp(phone, `❌ Booking cancelled.\n\n${mainMenu()}`);
        }
        return sendWhatsApp(phone, `Please reply *YES* to confirm or *NO* to cancel.`);
    }
    // ── FALLBACK ────────────────────────────────────────────────────────────────
    clearSession(phone);
    return sendWhatsApp(phone, `🤔 I didn't understand that.\n\n${mainMenu()}`);
}
exports.handleIncomingWhatsApp = handleIncomingWhatsApp;
// ─────────────────────────────────────────────────────────────────────────────
// CONFIRMATION MESSAGE BUILDERS
// ─────────────────────────────────────────────────────────────────────────────
function opdConfirmMessage(d) {
    return `📋 *Confirm Your OPD Appointment:*

🏥 Hospital:    ${d.hospitalName}
🏨 Department:  ${d.deptName}
👨‍⚕️ Doctor:     ${d.doctorName}
🕐 Time Slot:   ${d.slot}
📅 Date:        ${d.date}
👤 Patient:     ${d.patientName}
🤒 Symptoms:    ${d.symptoms}

💰 Doctor Fee: ₹1,400 + Booking Fee: ₹100

⚠️ _Ayushman Bharat benefit may apply_

Reply *YES* to confirm or *NO* to cancel.`;
}
function bedConfirmMessage(d) {
    return `📋 *Confirm Bed Booking:*

🏥 Hospital:    ${d.hospitalName}
🛏️ Bed Type:    ${d.bedName}
💰 Price:       ₹${Number(d.bedPrice).toLocaleString()}/day
👤 Patient:     ${d.patientName}
📱 Mobile:      ${d.mobile}
👤 Gender:      ${d.gender}
🪪 Aadhaar:     ${d.aadhaar}
👨‍⚕️ Doctor:     ${d.doctorName}
📋 Reason:      ${d.reason}
📅 Date:        ${d.date}

⚠️ _PM-JAY may cover bed charges_
_Bed class subject to availability._

Reply *YES* to confirm or *NO* to cancel.`;
}
// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE SAVE + CONFIRMATION SEND
// ─────────────────────────────────────────────────────────────────────────────
async function confirmOpdBooking(phone, data) {
    try {
        const tokenNumber = Math.floor(Math.random() * 50) + 1;
        const ref = await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'appointments'), {
            patientId: `wa_${phone}`,
            patientName: data.patientName,
            hospitalId: data.hospitalId,
            departmentId: data.deptId,
            doctorId: data.doctorId,
            slot: data.slot,
            date: data.date,
            symptoms: data.symptoms,
            tokenNumber,
            mode: 'opd',
            status: 'booked',
            source: 'whatsapp',
            bookedAt: new Date(),
        });
        await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'queue'), {
            appointmentId: ref.id,
            doctorId: data.doctorId,
            hospitalId: data.hospitalId,
            patientId: `wa_${phone}`,
            tokenNumber,
            status: 'waiting',
            createdAt: new Date(),
        });
        clearSession(phone);
        return sendWhatsApp(phone, `✅ *Appointment Confirmed!*

🎫 Token Number: *#${tokenNumber}*
🏥 ${data.hospitalName}
👨‍⚕️ ${data.doctorName}
🕐 ${data.slot} on ${data.date}

📲 Reply *STATUS* anytime to check your queue position.
Reply *MENU* to go back to main menu.

_CarePulse AI — Smart Healthcare_ 🩺`);
    }
    catch (err) {
        console.error('OPD booking error:', err);
        return sendWhatsApp(phone, `❌ Booking failed. Please try again.\n\nReply *MENU* to restart.`);
    }
}
async function confirmBedBooking(phone, data) {
    try {
        await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'bedBookings'), {
            patientId: `wa_${phone}`,
            patientName: data.patientName,
            mobile: data.mobile,
            gender: data.gender,
            aadhaar: data.aadhaar,
            doctorName: data.doctorName,
            reason: data.reason,
            date: data.date,
            hospitalId: data.hospitalId,
            bedType: data.bedId,
            bedName: data.bedName,
            pricePerDay: Number(data.bedPrice),
            status: 'pending',
            source: 'whatsapp',
            bookedAt: new Date(),
        });
        clearSession(phone);
        return sendWhatsApp(phone, `✅ *Bed Booking Request Submitted!*

🛏️ ${data.bedName}
🏥 ${data.hospitalName}
👤 ${data.patientName}
📅 ${data.date}
💰 ₹${Number(data.bedPrice).toLocaleString()}/day

⏳ Our team will confirm availability within *2 hours*.

Reply *MENU* to go back to main menu.

_CarePulse AI — Smart Healthcare_ 🩺`);
    }
    catch (err) {
        console.error('Bed booking error:', err);
        return sendWhatsApp(phone, `❌ Booking failed. Please try again.\n\nReply *MENU* to restart.`);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// QUEUE STATUS
// ─────────────────────────────────────────────────────────────────────────────
async function handleQueueStatus(phone) {
    try {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(config_1.db, 'appointments'), (0, firestore_1.where)('patientId', '==', `wa_${phone}`), (0, firestore_1.where)('status', 'in', ['booked', 'waiting', 'checkedIn', 'serving']));
        const snap = await (0, firestore_1.getDocs)(q);
        if (snap.empty) {
            return sendWhatsApp(phone, `📋 *No Active Appointments Found*\n\nYou have no active bookings.\n\nReply *1* to book an OPD appointment.\nReply *MENU* for main menu.`);
        }
        const appt = snap.docs[0].data();
        const wait = appt.estimatedWait || 0;
        const statusEmoji = appt.status === 'serving' ? '🟢' : appt.status === 'checkedIn' ? '✅' : '⏳';
        return sendWhatsApp(phone, `${statusEmoji} *Your Queue Status:*

🎫 Token: *#${appt.tokenNumber}*
🏥 ${appt.hospitalId}
👨‍⚕️ Doctor: ${appt.doctorId}
🕐 Slot: ${appt.slot}
📊 Status: ${appt.status}
⏱ Est. Wait: ${wait} min

Reply *MENU* to go to main menu.`);
    }
    catch (err) {
        return sendWhatsApp(phone, `❌ Could not fetch queue status. Try again later.\n\nReply *MENU* for main menu.`);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// CANCEL APPOINTMENT
// ─────────────────────────────────────────────────────────────────────────────
async function handleCancelAppointment(phone) {
    return sendWhatsApp(phone, `❌ *Cancel Appointment*

To cancel your appointment, please call us:
📞 *1800-CAREPULSE* (toll free)
🕐 Available 9 AM – 6 PM

Or visit the CarePulse app for instant cancellation.

Reply *MENU* to go to main menu.`);
}
// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION FUNCTIONS  (unchanged — used by your existing components)
// ─────────────────────────────────────────────────────────────────────────────
async function sendAppointmentConfirmation(phone, name, tokenNumber, hospitalName, estimatedWait) {
    return sendWhatsApp(phone, `🏥 *CarePulse AI — Appointment Confirmed!*

Hello ${name}! Your appointment is booked.

🎫 Token Number: *#${tokenNumber}*
🏥 Hospital: ${hospitalName}
⏰ Estimated Wait: ${estimatedWait} minutes
📍 Status: Booked ✅

Reply *STATUS* to check your position anytime.
Reply *MENU* for main menu.

_CarePulse AI — Smart Healthcare_ 🩺`);
}
exports.sendAppointmentConfirmation = sendAppointmentConfirmation;
async function sendYouAreNextAlert(phone, name, tokenNumber) {
    return sendWhatsApp(phone, `🟡 *You're Next!*

Hello ${name}!
⏭️ Token *#${tokenNumber}* — You are next in queue!
Please be ready near the doctor's room.

Estimated: *2–3 minutes*

_CarePulse AI_ 🩺`);
}
exports.sendYouAreNextAlert = sendYouAreNextAlert;
async function sendYourTurnNow(phone, name, tokenNumber, roomNumber = 'OPD') {
    return sendWhatsApp(phone, `🟢 *It's Your Turn!*

Hello ${name}!
✅ Token *#${tokenNumber}* is being called NOW!
Please proceed to *Room ${roomNumber}* immediately.

_(Token skipped if absent for 5 min)_

_CarePulse AI_ 🩺`);
}
exports.sendYourTurnNow = sendYourTurnNow;
async function sendAppointmentReminder(phone, name, tokenNumber, hospitalName) {
    return sendWhatsApp(phone, `⏰ *Reminder — CarePulse AI*

Hello ${name}! Don't forget your appointment.

🎫 Token: *#${tokenNumber}*
🏥 ${hospitalName}

Reply *STATUS* to track your live queue.

_CarePulse AI_ 🩺`);
}
exports.sendAppointmentReminder = sendAppointmentReminder;
async function sendFeedbackRequest(phone, name) {
    return sendWhatsApp(phone, `✅ *Visit Complete — CarePulse AI*

Hello ${name}! Your consultation is complete.

Please rate your experience:
⭐ Reply *RATE 5* (or 1–5)

Your feedback helps us improve! 🙏

_CarePulse AI_ 🩺`);
}
exports.sendFeedbackRequest = sendFeedbackRequest;
async function sendTokenSkipped(phone, name, tokenNumber) {
    return sendWhatsApp(phone, `⚠️ *Token Skipped — CarePulse AI*

Hello ${name}, Token *#${tokenNumber}* was skipped.

Please visit the reception counter for a new token.

_CarePulse AI_ 🩺`);
}
exports.sendTokenSkipped = sendTokenSkipped;
async function sendEmergencyAlert(phone, name) {
    return sendWhatsApp(phone, `🚨 *EMERGENCY — CarePulse AI*

Hello ${name}, your SOS has been received!

🏥 Emergency services notified.
🚑 *Call 108 immediately* for ambulance.

Your emergency token is *Priority #1*.

_CarePulse AI Emergency Response_ 🩺`);
}
exports.sendEmergencyAlert = sendEmergencyAlert;
async function sendWelcomeCheckIn(phone, name, hospitalName, tokenNumber) {
    return sendWhatsApp(phone, `👋 *Welcome to ${hospitalName}!*

Hello ${name}! Auto Check-In Successful! ✅
🎫 Token: *#${tokenNumber}*

Please proceed to the *OPD waiting area*.

_CarePulse AI_ 🩺`);
}
exports.sendWelcomeCheckIn = sendWelcomeCheckIn;
//# sourceMappingURL=whatsapp.js.map