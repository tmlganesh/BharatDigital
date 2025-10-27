import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, BarChart3, Users, Briefcase, IndianRupee, TrendingUp } from 'lucide-react'
import { useQuery } from 'react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { statesAPI, performanceAPI } from '../services/api'
import { formatNumber, formatCurrency } from '../utils/helpers'

const ComparePage = () => {
  const [selectedDistricts, setSelectedDistricts] = useState([])
  const [newDistrict, setNewDistrict] = useState({ state: '', district: '' })

  // Fetch states
  const { data: statesData, isLoading: statesLoading } = useQuery(
    'states',
    () => statesAPI.getAll(),
    {
      select: (response) => response.data.data.states,
      staleTime: 10 * 60 * 1000,
    }
  )

  // Fetch districts for selected state
  const { data: districtsData, isLoading: districtsLoading } = useQuery(
    ['districts', newDistrict.state],
    () => statesAPI.getDistricts(newDistrict.state),
    {
      enabled: !!newDistrict.state,
      select: (response) => response.data.data.districts,
      staleTime: 10 * 60 * 1000,
    }
  )

  // Fetch comparison data
  const { data: comparisonData, isLoading: comparisonLoading } = useQuery(
    ['comparison', selectedDistricts],
    () => performanceAPI.compareDistricts(selectedDistricts),
    {
      enabled: selectedDistricts.length >= 2,
      select: (response) => response.data.data,
    }
  )

  const addDistrict = () => {
    if (newDistrict.state && newDistrict.district && selectedDistricts.length < 4) {
      const exists = selectedDistricts.some(
        d => d.state === newDistrict.state && d.district === newDistrict.district
      )
      
      if (!exists) {
        setSelectedDistricts([...selectedDistricts, newDistrict])
        setNewDistrict({ state: '', district: '' })
      }
    }
  }

  const removeDistrict = (index) => {
    setSelectedDistricts(selectedDistricts.filter((_, i) => i !== index))
  }

  // Prepare chart data
  const chartData = comparisonData?.comparison?.map(item => ({
    name: `${item.district}, ${item.state.slice(0, 3)}`,
    households: item.data.total_households_worked,
    persondays: item.data.persondays_generated,
    wage: item.data.avg_wage_per_day,
    expenditure: item.data.total_expenditure / 100000, // Convert to lakhs
    avgDays: item.data.avg_days_per_household || 0
  })) || []

  // Prepare radar chart data
  const radarData = comparisonData?.comparison?.map(item => {
    const maxHouseholds = Math.max(...(comparisonData?.comparison?.map(d => d.data.total_households_worked) || [1]))
    const maxPersondays = Math.max(...(comparisonData?.comparison?.map(d => d.data.persondays_generated) || [1]))
    const maxWage = Math.max(...(comparisonData?.comparison?.map(d => d.data.avg_wage_per_day) || [1]))
    
    return {
      district: `${item.district}, ${item.state.slice(0, 3)}`,
      Households: (item.data.total_households_worked / maxHouseholds) * 100,
      Persondays: (item.data.persondays_generated / maxPersondays) * 100,
      Wage: (item.data.avg_wage_per_day / maxWage) * 100,
    }
  }) || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Compare Districts
        </h1>
        <p className="text-lg text-gray-600">
          Compare MGNREGA performance across different districts to understand regional variations
        </p>
      </motion.div>

      {/* District Selection */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Districts to Compare
            </CardTitle>
            <CardDescription>
              Select up to 4 districts for comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Select 
                value={newDistrict.state} 
                onValueChange={(value) => setNewDistrict({ state: value, district: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {statesData?.map((state) => (
                    <SelectItem key={state.state} value={state.state}>
                      {state.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={newDistrict.district} 
                onValueChange={(value) => setNewDistrict({ ...newDistrict, district: value })}
                disabled={!newDistrict.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districtsData?.map((district) => (
                    <SelectItem key={district.name} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={addDistrict}
                disabled={!newDistrict.state || !newDistrict.district || selectedDistricts.length >= 4}
                className="w-full"
              >
                Add District
              </Button>
            </div>

            {/* Selected Districts */}
            {selectedDistricts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Selected Districts ({selectedDistricts.length}/4):</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDistricts.map((district, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{district.district}, {district.state}</span>
                      <button
                        onClick={() => removeDistrict(index)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison Results */}
      {selectedDistricts.length >= 2 && (
        <>
          {comparisonLoading ? (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading comparison data...</p>
            </motion.div>
          ) : comparisonData ? (
            <>
              {/* Key Metrics Comparison */}
              <motion.div variants={itemVariants} className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics Comparison</CardTitle>
                    <CardDescription>
                      Side-by-side comparison of performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4 font-medium text-gray-900">District</th>
                            <th className="text-right py-2 px-4 font-medium text-gray-900">Households</th>
                            <th className="text-right py-2 px-4 font-medium text-gray-900">Person Days</th>
                            <th className="text-right py-2 px-4 font-medium text-gray-900">Avg Wage</th>
                            <th className="text-right py-2 px-4 font-medium text-gray-900">Expenditure</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonData.comparison.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-900">
                                {item.district}, {item.state}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {formatNumber(item.data.total_households_worked)}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {formatNumber(item.data.persondays_generated)}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                ₹{item.data.avg_wage_per_day}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {formatCurrency(item.data.total_expenditure)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Performers */}
              {comparisonData.metrics && (
                <motion.div variants={itemVariants} className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performers</CardTitle>
                      <CardDescription>
                        Districts leading in key performance areas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-green-900 mb-1">Most Households Employed</h4>
                          <p className="text-green-800">
                            {comparisonData.metrics.highest_households_worked.district}, {comparisonData.metrics.highest_households_worked.state}
                          </p>
                          <p className="text-sm text-green-600">
                            {formatNumber(comparisonData.metrics.highest_households_worked.data.total_households_worked)} households
                          </p>
                        </div>

                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-blue-900 mb-1">Highest Person Days</h4>
                          <p className="text-blue-800">
                            {comparisonData.metrics.highest_persondays.district}, {comparisonData.metrics.highest_persondays.state}
                          </p>
                          <p className="text-sm text-blue-600">
                            {formatNumber(comparisonData.metrics.highest_persondays.data.persondays_generated)} days
                          </p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <IndianRupee className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-purple-900 mb-1">Highest Daily Wage</h4>
                          <p className="text-purple-800">
                            {comparisonData.metrics.highest_wage.district}, {comparisonData.metrics.highest_wage.state}
                          </p>
                          <p className="text-sm text-purple-600">
                            ₹{comparisonData.metrics.highest_wage.data.avg_wage_per_day} per day
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart */}
                <motion.div variants={itemVariants}>
                  <Card className="h-96">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Performance Comparison
                      </CardTitle>
                      <CardDescription>
                        Key metrics across districts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
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
                          <Bar dataKey="households" fill="#3B82F6" name="Households" />
                          <Bar dataKey="wage" fill="#10B981" name="Avg Wage (₹)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Radar Chart */}
                <motion.div variants={itemVariants}>
                  <Card className="h-96">
                    <CardHeader>
                      <CardTitle>Performance Radar</CardTitle>
                      <CardDescription>
                        Normalized comparison (0-100%)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="district" fontSize={10} />
                          <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                          {radarData.map((_, index) => (
                            <Radar
                              key={index}
                              name={radarData[index]?.district}
                              dataKey="Households"
                              stroke={`hsl(${index * 120}, 70%, 50%)`}
                              fill={`hsl(${index * 120}, 70%, 50%)`}
                              fillOpacity={0.3}
                            />
                          ))}
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data Available</h3>
                <p className="text-yellow-600">
                  Unable to load comparison data. Please try selecting different districts.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Instructions */}
      {selectedDistricts.length < 2 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <div className="max-w-md mx-auto">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Comparing Districts
            </h3>
            <p className="text-gray-600">
              Select at least 2 districts to see detailed performance comparisons with charts and metrics.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ComparePage