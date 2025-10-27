import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  ArrowLeft, 
  Users, 
  Briefcase, 
  IndianRupee, 
  TrendingUp, 
  Calendar,
  MapPin,
  BarChart3,
  Loader2
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { performanceAPI } from '../services/api'
import { formatNumber, formatCurrency, getPerformanceColor, getPerformanceIcon, getPerformanceText } from '../utils/helpers'
import { useLanguage } from '../contexts/LanguageContext'

const DashboardPage = () => {
  const { state, district } = useParams()
  const { t, isHindi, formatNumber: formatNum, formatCurrency: formatCurr } = useLanguage()
  const [selectedPeriod, setSelectedPeriod] = useState('12') // months

  const { 
    data: performanceData, 
    isLoading, 
    error 
  } = useQuery(
    ['performance', state, district, selectedPeriod],
    () => performanceAPI.getDistrictPerformance(state, district, { limit: selectedPeriod }),
    {
      select: (response) => response.data.data,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">{t('action.loading')}</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">{t('error.dataNotAvailable')}</h2>
            <p className="text-red-600 mb-4">
              {error.message || t('error.unableToLoad')}
            </p>
            <Link to="/">
              <Button variant="outline" className="text-red-600 border-red-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('action.back')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const latest = performanceData?.latest
  const historical = performanceData?.historical || []
  const comparison = performanceData?.comparison
  const performanceStatus = comparison?.performance_status

  // Prepare chart data
  const chartData = historical.map(item => ({
    month: `${item.month.slice(0, 3)} ${item.fin_year}`,
    households: item.total_households_worked,
    persondays: item.persondays_of_central_liability,
    wage: item.average_wage_rate_per_day,
    expenditure: item.total_exp / 100000 // Convert to lakhs
  })).reverse()

  const pieData = [
    { name: t('metrics.completedWorks'), value: latest?.number_of_completed_works || 0, color: '#10B981' },
    { name: t('metrics.ongoingWorks'), value: latest?.number_of_ongoing_works || 0, color: '#F59E0B' }
  ]

  const statCards = [
    {
      title: t('metrics.householdsWorked'),
      value: formatNumber(latest?.total_households_worked || 0, isHindi),
      icon: Users,
      change: performanceStatus?.households_worked,
      color: 'blue'
    },
    {
      title: t('metrics.personDaysGenerated'),
      value: formatNumber(latest?.persondays_of_central_liability || 0, isHindi),
      icon: Briefcase,
      change: performanceStatus?.persondays_generated,
      color: 'green'
    },
    {
      title: t('metrics.averageDailyWage'),
      value: formatCurr(latest?.average_wage_rate_per_day || 0),
      icon: IndianRupee,
      change: performanceStatus?.avg_wage,
      color: 'purple'
    },
    {
      title: t('metrics.totalExpenditure'),
      value: formatCurr(latest?.total_exp || 0),
      icon: TrendingUp,
      change: performanceStatus?.expenditure,
      color: 'orange'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('action.back')}
            </Link>
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{district}, {state}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('dashboard.title')}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {t('dashboard.latestData')} {latest?.month && t(`month.${latest.month}`)} {latest?.fin_year}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="6">{t('dashboard.period.6months')}</option>
              <option value="12">{t('dashboard.period.12months')}</option>
              <option value="24">{t('dashboard.period.24months')}</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.change && (
                    <div className={`flex items-center text-sm px-2 py-1 rounded-full ${getPerformanceColor(stat.change)}`}>
                      <span className="mr-1">{getPerformanceIcon(stat.change)}</span>
                      {getPerformanceText(stat.change, isHindi)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Line Chart - Trends */}
        <motion.div variants={itemVariants}>
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                {t('chart.performanceTrends')}
              </CardTitle>
              <CardDescription>
                {t('chart.trackMetrics')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#888888"
                    fontSize={12}
                  />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="households" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name={t('metrics.householdsWorked')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="persondays" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name={t('metrics.personDaysGenerated')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart - Work Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="h-96">
            <CardHeader>
              <CardTitle>{t('chart.workDistribution')}</CardTitle>
              <CardDescription>
                {t('chart.ongoingVsCompleted')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center space-x-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expenditure Bar Chart */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('chart.expenditureTrends')}</CardTitle>
            <CardDescription>
              {t('chart.expenditureInLakhs')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`₹${value}${isHindi ? 'लाख' : 'L'}`, t('metrics.totalExpenditure')]}
                />
                <Bar 
                  dataKey="expenditure" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison Section */}
      {comparison && (
        <motion.div variants={itemVariants}>
          <Card className="mb-8">
            <CardHeader>
            <CardTitle>{t('chart.performanceComparison')}</CardTitle>
            <CardDescription>
              {isHindi ? 
                `${district} राज्य और राष्ट्रीय औसत के साथ कैसे तुलना करता है?` :
                `How does ${district} compare with state and national averages?`
              }
            </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('performance.district')}</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {t('data.households')}: <span className="font-medium">{formatNumber(latest?.total_households_worked || 0, isHindi)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('data.avgWage')}: <span className="font-medium">{formatCurr(latest?.average_wage_rate_per_day || 0)}</span>
                    </p>
                  </div>
                </div>

                {comparison.state_average && (
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('performance.stateAverage')}</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {t('data.households')}: <span className="font-medium">{formatNumber(Math.round(comparison.state_average.avg_households_worked), isHindi)}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('data.avgWage')}: <span className="font-medium">{formatCurr(Math.round(comparison.state_average.avg_wage_per_day))}</span>
                      </p>
                    </div>
                  </div>
                )}

                {comparison.national_average && (
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('performance.nationalAverage')}</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {t('data.households')}: <span className="font-medium">{formatNumber(Math.round(comparison.national_average.avg_households_worked), isHindi)}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('data.avgWage')}: <span className="font-medium">{formatCurr(Math.round(comparison.national_average.avg_wage_per_day))}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DashboardPage