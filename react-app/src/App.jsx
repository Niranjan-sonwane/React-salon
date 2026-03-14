import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import AppointmentPage from './pages/AppointmentPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PortfolioPage from './pages/PortfolioPage'
import ServicePage from './pages/ServicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="about.html" element={<Navigate to="/about" replace />} />
          <Route path="appointment.html" element={<Navigate to="/appointment" replace />} />
          <Route path="contact.html" element={<Navigate to="/contact" replace />} />
          <Route path="portfolio.html" element={<Navigate to="/portfolio" replace />} />
          <Route path="nails.html" element={<Navigate to="/nails" replace />} />
          <Route path="lashes.html" element={<Navigate to="/lashes" replace />} />
          <Route path="skin.html" element={<Navigate to="/skin" replace />} />
          <Route path="pedicure.html" element={<Navigate to="/pedicure" replace />} />
          <Route path="manicure.html" element={<Navigate to="/manicure" replace />} />
          <Route
            path="darklip-correction.html"
            element={<Navigate to="/darklip-correction" replace />}
          />
          <Route path="microblading.html" element={<Navigate to="/microblading" replace />} />
          <Route path="waxing.html" element={<Navigate to="/waxing" replace />} />
          <Route path=":slug.html" element={<ServicePage />} />
          <Route path=":slug" element={<ServicePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
