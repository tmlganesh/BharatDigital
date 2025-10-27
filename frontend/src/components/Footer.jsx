import { motion } from 'framer-motion'
import { Heart, Github, Mail } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
  const { t, isHindi } = useLanguage()
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-gray-900 text-white mt-20"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('app.title')}</h3>
            <p className="text-gray-300 mb-4">
              {isHindi ? 
                "भारत भर में मनरेगा प्रदर्शन डेटा तक पारदर्शी पहुंच के साथ नागरिकों को सशक्त बनाना। ग्रामीण रोजगार कार्यक्रमों को अधिक जवाबदेह और सुलभ बनाना।" :
                "Empowering citizens with transparent access to MGNREGA performance data across India. Making rural employment programs more accountable and accessible."
              }
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <span>{isHindi ? "से बनाया गया" : "Made with"}</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>{isHindi ? "डिजिटल भारत के लिए" : "for Digital India"}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://nrega.nic.in/" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-white transition-colors">
                  Official MGNREGA Portal
                </a>
              </li>
              <li>
                <a href="https://data.gov.in/" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors">
                  Open Government Data Platform
                </a>
              </li>
              <li>
                <a href="https://rural.nic.in/" target="_blank" rel="noopener noreferrer"
                   className="hover:text-white transition-colors">
                  Ministry of Rural Development
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About This Project</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>Open Source Project</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Built for Social Impact</span>
              </div>
              <p className="text-sm text-gray-400">
                This dashboard promotes transparency in India's largest rural employment program 
                by making performance data accessible to all citizens.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm">
            {t('footer.text')}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">🌟 {isHindi ? "पारदर्शिता" : "Transparency"}</span>
            <span className="text-sm text-gray-400">🤝 {isHindi ? "जवाबदेही" : "Accountability"}</span>
            <span className="text-sm text-gray-400">📊 {isHindi ? "डेटा-संचालित" : "Data-Driven"}</span>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer