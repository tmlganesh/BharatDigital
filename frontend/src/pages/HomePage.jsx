import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Users, Briefcase, IndianRupee, TrendingUp } from 'lucide-react'
import { useQuery } from 'react-query'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { statesAPI } from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'

const HomePage = () => {
  const navigate = useNavigate()
  const { t, isHindi } = useLanguage()
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  // Fetch states
  const { data: statesData, isLoading: statesLoading } = useQuery(
    'states',
    () => statesAPI.getAll(),
    {
      select: (response) => response.data.data.states,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )

  // Fetch districts when state is selected
  const { data: districtsData, isLoading: districtsLoading } = useQuery(
    ['districts', selectedState],
    () => statesAPI.getDistricts(selectedState),
    {
      enabled: !!selectedState,
      select: (response) => response.data.data.districts,
      staleTime: 10 * 60 * 1000,
    }
  )

  const handleViewDashboard = () => {
    if (selectedState && selectedDistrict) {
      navigate(`/dashboard/${encodeURIComponent(selectedState)}/${encodeURIComponent(selectedDistrict)}`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const features = [
    {
      icon: Users,
      title: t('metrics.householdsWorked'),
      description: isHindi ? "अपने जिले में कितने परिवारों को रोजगार मिला, इसकी जानकारी प्राप्त करें" : "Track how many households received employment in your district"
    },
    {
      icon: Briefcase,
      title: t('metrics.personDaysGenerated'),
      description: isHindi ? "उत्पन्न व्यक्ति दिवसों और चालू कार्य परियोजनाओं की निगरानी करें" : "Monitor persondays generated and ongoing work projects"
    },
    {
      icon: IndianRupee,
      title: isHindi ? "मजदूरी विश्लेषण" : "Wage Analysis",
      description: isHindi ? "औसत मजदूरी और कुल व्यय पैटर्न का विश्लेषण करें" : "Analyze average wages and total expenditure patterns"
    },
    {
      icon: TrendingUp,
      title: isHindi ? "प्रदर्शन तुलना" : "Performance Comparison",
      description: isHindi ? "अपने जिले की तुलना राज्य और राष्ट्रीय औसत से करें" : "Compare your district with state and national averages"
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('app.title')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
            variants={itemVariants}
          >
            {t('home.subtitle')}
            <br />
            <span className="text-blue-600 font-semibold">
              {isHindi ? "डेटा के माध्यम से पारदर्शिता।" : "Transparency through data."}
            </span>
          </motion.p>

          {/* District Selection */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">
                {isHindi ? "अपना स्थान चुनें" : "Select Your Location"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* State Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('home.selectState')}
                </label>
                <Select value={selectedState} onValueChange={(value) => {
                  setSelectedState(value)
                  setSelectedDistrict('') // Reset district when state changes
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={statesLoading ? t('action.loading') : t('home.selectStatePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statesData?.map((state) => (
                      <SelectItem key={state.state} value={state.state}>
                        {state.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('home.selectDistrict')}
                </label>
                <Select 
                  value={selectedDistrict} 
                  onValueChange={setSelectedDistrict}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      !selectedState ? (isHindi ? "पहले राज्य चुनें" : "Select State First") :
                      districtsLoading ? t('action.loading') : t('home.selectDistrictPlaceholder')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {districtsData?.map((district) => (
                      <SelectItem key={district.name} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleViewDashboard}
              disabled={!selectedState || !selectedDistrict}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {t('action.viewDashboard')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section variants={itemVariants} className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isHindi ? "आप क्या खोजेंगे" : "What You'll Discover"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isHindi ? 
                "स्पष्ट विज़ुअलाइज़ेशन और समझने योग्य मेट्रिक्स के साथ मनरेगा प्रदर्शन में व्यापक अंतर्दृष्टि प्राप्त करें" :
                "Get comprehensive insights into MGNREGA performance with clear visualizations and easy-to-understand metrics"
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section variants={itemVariants} className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Empowering Rural India Through Data
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of citizens monitoring MGNREGA performance in their districts. 
              Because transparency leads to better governance.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => document.querySelector('select').focus()}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              Start Exploring Now
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default HomePage