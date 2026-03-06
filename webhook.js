// src/api/whatsappWebhook.ts
// ─── Twilio WhatsApp Webhook Handler ─────────────────────────────────────────
//
// SETUP STEPS:
// 1. Install express:  npm install express cors
// 2. Run this file alongside your Vite dev server (node src/api/whatsappWebhook.ts)
//    Or deploy it to any Node.js server / Firebase Cloud Function
// 3. Expose it with ngrok during dev:  ngrok http 3001
// 4. Paste the ngrok URL into Twilio Console:
//    Messaging → Sandbox → "When a message comes in" → https://xxxx.ngrok.io/api/whatsapp/webhook
//
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express'
import cors from 'cors'
import { handleIncomingWhatsApp } from '../lib/whatsapp'

const app  = express()
const PORT = 3001

app.use(cors())
app.use(express.urlencoded({ extended: false }))  // Twilio sends form-encoded data
app.use(express.json())

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send('CarePulse WhatsApp Webhook is running ✅')
})

// ── Twilio POST webhook ───────────────────────────────────────────────────────
app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    const from = req.body.From  as string  // e.g. "whatsapp:+919876543210"
    const body = req.body.Body  as string  // user's message text

    console.log(`📩 Incoming from ${from}: "${body}"`)

    // Always respond with empty TwiML immediately so Twilio doesn't retry
    res.set('Content-Type', 'text/xml')
    res.send('<Response></Response>')

    // Handle message async (don't await before responding to Twilio)
    handleIncomingWhatsApp(from, body).catch(console.error)

  } catch (err) {
    console.error('Webhook error:', err)
    res.status(200).send('<Response></Response>')  // Always 200 to Twilio
  }
})

app.listen(PORT, () => {
  console.log(`🚀 WhatsApp Webhook server running on http://localhost:${PORT}`)
  console.log(`📌 Set Twilio sandbox URL to: https://<your-ngrok>.ngrok.io/api/whatsapp/webhook`)
})

export default app