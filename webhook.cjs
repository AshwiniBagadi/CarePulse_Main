const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: false }))

app.post('/whatsapp', (req, res) => {
  const body = (req.body.Body || '').trim().toUpperCase()
  const from = req.body.From || ''
  let reply = ''

  if (body === 'HELP' || body === 'HI' || body === 'HELLO') {
    reply = `👋 Welcome to CarePulse AI! 🏥

*Commands:*
📅 *BOOK* — Book appointment
🛏️ *BED* — Book a bed
📊 *STATUS* — Check queue
❌ *CANCEL* — Cancel appointment
🏛️ *SCHEME* — Govt health schemes
🚨 *SOS* — Emergency help`

  } else if (body === 'BOOK') {
    reply = `📅 *Book Appointment*

Please open CarePulse AI app to complete booking:
👉 https://carepulse-ai.web.app

Or tell me your symptoms and I'll suggest a department!`

  } else if (body === 'STATUS') {
    reply = `📊 *Queue Status*

Please open the app to see your live queue position:
👉 https://carepulse-ai.web.app/queue`

  } else if (body === 'SCHEME') {
    reply = `🏛️ *Government Health Schemes*

1️⃣ PM-JAY — ₹5 lakh/year
2️⃣ Ayushman Bharat — Free OPD
3️⃣ CGHS — Govt employees
4️⃣ ESIC — Salaried workers

Check eligibility: https://carepulse-ai.web.app/schemes`

  } else if (body === 'SOS') {
    reply = `🚨 *EMERGENCY*

Call ambulance: *108*
Or open app SOS button:
👉 https://carepulse-ai.web.app`

  } else {
    reply = `I didn't understand that.
Reply *HELP* to see all commands 💬`
  }

  res.type('text/xml').send(`<?xml version="1.0"?>
<Response><Message>${reply}</Message></Response>`)
})

app.listen(3000, () => console.log('Webhook running on port 3000'))