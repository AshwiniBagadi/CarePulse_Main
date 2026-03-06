"use strict";
// src/components/ui/WhatsAppScanner.tsx
// Add this component to your Dashboard page
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// Twilio sandbox WhatsApp number
const TWILIO_WHATSAPP_NUMBER = '+14155238886';
const SANDBOX_JOIN_CODE = 'join YOUR-SANDBOX-CODE'; // Replace with your actual Twilio sandbox join code
// QR code image URL for the Twilio sandbox number
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wa.me/${TWILIO_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(SANDBOX_JOIN_CODE)}&bgcolor=ffffff&color=075e54`;
const COMMANDS = [
    { cmd: 'STATUS', desc: 'Check your queue position', icon: '📊' },
    { cmd: 'CANCEL', desc: 'Cancel your appointment', icon: '❌' },
    { cmd: 'SCHEME', desc: 'Government health schemes', icon: '🏛️' },
    { cmd: 'RATE 5', desc: 'Rate your experience', icon: '⭐' },
    { cmd: 'SOS', desc: 'Emergency help', icon: '🚨' },
    { cmd: 'HELP', desc: 'See all commands', icon: '💬' },
];
function WhatsAppScanner() {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const [activeTab, setActiveTab] = (0, react_1.useState)('scan');
    const copyNumber = () => {
        navigator.clipboard.writeText(TWILIO_WHATSAPP_NUMBER);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const openWhatsApp = () => {
        window.open(`https://wa.me/${TWILIO_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(SANDBOX_JOIN_CODE)}`, '_blank');
    };
    return (<div className="rounded-3xl bg-white overflow-hidden" style={{ border: '1.5px solid #E0F2FE', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

      {/* Header */}
      <div className="px-6 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-white/20">
              📲
            </div>
            <div>
              <div className="font-bold text-white text-base">CarePulse on WhatsApp</div>
              <div className="text-white/70 text-xs mt-0.5">Track queue • Get updates • Chat with us</div>
            </div>
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            LIVE
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'scan', label: '📷 Scan QR' },
            { key: 'commands', label: '💬 Commands' },
        ].map((tab) => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all" style={{
                background: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.15)',
                color: activeTab === tab.key ? '#128C7E' : 'white',
            }}>
              {tab.label}
            </button>))}
        </div>
      </div>

      {/* QR Tab */}
      {activeTab === 'scan' && (<div className="p-5">
          <div className="flex gap-5 items-start">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="p-2 rounded-2xl" style={{ border: '2px solid #E0F2FE', background: 'white' }}>
                <img src={QR_URL} alt="WhatsApp QR Code" className="w-28 h-28 rounded-xl"/>
              </div>
            </div>

            {/* Instructions */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#94A3B8' }}>
                  HOW TO CONNECT
                </div>
                {[
                'Scan the QR code with your phone camera',
                'OR tap the button below to open WhatsApp',
                'Send the join message that appears',
                'You\'re connected! Start chatting 🎉',
            ].map((step, i) => (<div key={i} className="flex items-start gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ background: '#CCFBF1', color: '#0D9488' }}>
                      {i + 1}
                    </div>
                    <span className="text-xs" style={{ color: '#475569' }}>{step}</span>
                  </div>))}
              </div>
            </div>
          </div>

          {/* Number + Buttons */}
          <div className="mt-4 p-3 rounded-2xl flex items-center justify-between" style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
            <div>
              <div className="text-xs font-medium" style={{ color: '#64748B' }}>Twilio WhatsApp Number</div>
              <div className="font-bold text-sm mt-0.5" style={{ color: '#0F172A', fontFamily: 'monospace' }}>
                {TWILIO_WHATSAPP_NUMBER}
              </div>
            </div>
            <button onClick={copyNumber} className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all" style={{ background: copied ? '#CCFBF1' : 'white', color: copied ? '#0D9488' : '#475569', border: '1.5px solid #E2E8F0' }}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>

          <button onClick={openWhatsApp} className="w-full mt-3 py-3 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
            <span className="text-lg">💬</span>
            Open in WhatsApp
          </button>
        </div>)}

      {/* Commands Tab */}
      {activeTab === 'commands' && (<div className="p-5">
          <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#94A3B8' }}>
            AVAILABLE COMMANDS — Send these to {TWILIO_WHATSAPP_NUMBER}
          </div>
          <div className="space-y-2">
            {COMMANDS.map((item) => (<div key={item.cmd} className="flex items-center justify-between p-3 rounded-2xl transition-all hover:shadow-sm" style={{ background: '#F8FAFC', border: '1.5px solid #F1F5F9' }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#0F172A', fontFamily: 'monospace' }}>
                      {item.cmd}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{item.desc}</div>
                  </div>
                </div>
                <button onClick={() => {
                    window.open(`https://wa.me/${TWILIO_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(item.cmd)}`, '_blank');
                }} className="px-3 py-1 rounded-xl text-xs font-semibold transition-all hover:scale-105" style={{ background: '#CCFBF1', color: '#0D9488' }}>
                  Send →
                </button>
              </div>))}
          </div>

          <button onClick={openWhatsApp} className="w-full mt-4 py-3 rounded-2xl text-white font-bold text-sm transition-all hover:shadow-lg flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
            <span className="text-lg">💬</span>
            Open WhatsApp Chat
          </button>
        </div>)}
    </div>);
}
exports.default = WhatsAppScanner;
//# sourceMappingURL=WhatsAppScanner.js.map