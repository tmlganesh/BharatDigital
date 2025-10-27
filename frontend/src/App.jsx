import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ComparePage from './pages/ComparePage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/:state/:district" element={<DashboardPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </motion.main>
      <Footer />
    </div>
  )
}

export default App