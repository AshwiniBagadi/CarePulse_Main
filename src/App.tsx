import { Routes, Route } from 'react-router-dom'
import Landing from './pages/landing'
import Auth from './pages/Auth'
import Dashboard from './pages/dashboard'
import BookAppointment from './pages/BookAppointment'
import QueueTracker from './pages/QueueTraker'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import GovernmentSchemes from './pages/GovernmentScheme'
import BedBooking from './pages/BedBooking'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book" element={<BookAppointment />} />
      <Route path="/queue" element={<QueueTracker />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/schemes" element={<GovernmentSchemes />} />
      <Route path="/beds" element={<BedBooking />} />
    </Routes>
  )
}

export default App