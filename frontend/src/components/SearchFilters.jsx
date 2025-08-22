/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Briefcase, X, ChevronDown } from "lucide-react"
import { useDebounce } from "../hooks/useDebounce"

const SearchFilters = ({ onFiltersChange, totalJobs = 0 }) => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    experience: "",
    salaryRange: [500000, 2000000], // Updated salary range from 50k-800k to 5L-20L
    sortBy: "newest",
  })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  const locations = [
    "Preferred Location",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
    "Remote",
  ]

  const jobTypes = ["Job type", "Full Time", "Part Time", "Contract", "Freelance", "Internship"]

  const experienceLevels = [
    "Experience Level",
    "Entry Level (0-1 years)",
    "Mid Level (2-5 years)",
    "Senior Level (5+ years)",
    "Executive Level",
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "salary-high", label: "Salary: High to Low" },
    { value: "salary-low", label: "Salary: Low to High" },
    { value: "relevance", label: "Most Relevant" },
  ]

  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      const newFilters = { ...filters, search: debouncedSearch }
      setFilters(newFilters)
      onFiltersChange?.(newFilters)
    }
  }, [debouncedSearch])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.search) count++
    if (filters.location && filters.location !== "Preferred Location") count++
    if (filters.jobType && filters.jobType !== "Job type") count++
    if (filters.experience && filters.experience !== "Experience Level") count++
    if (filters.salaryRange[0] > 500000 || filters.salaryRange[1] < 2000000) count++ // Updated salary range check
    setActiveFiltersCount(count)
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Don't trigger API call for search input (handled by debounce)
    if (key !== "search") {
      onFiltersChange?.(newFilters)
    }
  }

  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }))
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      location: "",
      jobType: "",
      experience: "",
      salaryRange: [500000, 2000000], // Updated default salary range
      sortBy: "newest",
    }
    setFilters(clearedFilters)
    onFiltersChange?.(clearedFilters)
  }

  const clearFilter = (filterKey) => {
    let clearedValue
    switch (filterKey) {
      case "salaryRange":
        clearedValue = [500000, 2000000] // Updated default salary range
        break
      case "location":
      case "jobType":
      case "experience":
        clearedValue = ""
        break
      default:
        clearedValue = ""
    }

    const newFilters = { ...filters, [filterKey]: clearedValue }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const formatSalary = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L` // Updated formatting for lakh values
    }
    return `₹${(value / 1000).toFixed(0)}k`
  }

  const getFilterChips = () => {
    const chips = []

    if (filters.search) {
      chips.push({ key: "search", label: `"${filters.search}"`, value: filters.search })
    }

    if (filters.location && filters.location !== "Preferred Location") {
      chips.push({ key: "location", label: filters.location, value: filters.location })
    }

    if (filters.jobType && filters.jobType !== "Job type") {
      chips.push({ key: "jobType", label: filters.jobType, value: filters.jobType })
    }

    if (filters.experience && filters.experience !== "Experience Level") {
      chips.push({ key: "experience", label: filters.experience, value: filters.experience })
    }

    if (filters.salaryRange[0] > 500000 || filters.salaryRange[1] < 2000000) {
      // Updated salary range check
      chips.push({
        key: "salaryRange",
        label: `${formatSalary(filters.salaryRange[0])} - ${formatSalary(filters.salaryRange[1])}`,
        value: filters.salaryRange,
      })
    }

    return chips
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-8">
      {/* Main Search Bar */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search By Job Title, Role"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative min-w-[180px]">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">Preferred Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Remote">Remote</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Job Type Dropdown */}
          <div className="relative min-w-[140px]">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filters.jobType}
              onChange={(e) => handleFilterChange("jobType", e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-700"
            >
              <option value="">Job type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Salary Range */}
          <div className="min-w-[160px] max-w-[180px]">
            <div className="text-xs text-gray-600 mb-1 font-medium">Salary Per Month</div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500 font-medium min-w-[25px] text-center">
                {formatSalary(filters.salaryRange[0])}
              </span>
              <div className="flex-1 relative h-5 flex items-center px-1">
                <div className="w-full h-1.5 bg-gray-200 rounded-full relative">
                  <div
                    className="absolute h-1.5 bg-black rounded-full"
                    style={{
                      left: `${((filters.salaryRange[0] - 500000) / (2000000 - 500000)) * 100}%`,
                      width: `${((filters.salaryRange[1] - filters.salaryRange[0]) / (2000000 - 500000)) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="500000"
                    max="2000000"
                    step="100000"
                    value={filters.salaryRange[0]}
                    onChange={(e) =>
                      handleFilterChange("salaryRange", [Number.parseInt(e.target.value), filters.salaryRange[1]])
                    }
                    className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb"
                  />
                  <input
                    type="range"
                    min="500000"
                    max="2000000"
                    step="100000"
                    value={filters.salaryRange[1]}
                    onChange={(e) =>
                      handleFilterChange("salaryRange", [filters.salaryRange[0], Number.parseInt(e.target.value)])
                    }
                    className="absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer slider-thumb"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium min-w-[30px] text-center">
                {formatSalary(filters.salaryRange[1])}
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange("experience", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level === "Experience Level" ? "" : level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters & Results Count */}
        <div className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Active Filter Chips */}
            <div className="flex items-center flex-wrap gap-2">
              {getFilterChips().length > 0 && (
                <>
                  <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                  {getFilterChips().map((chip) => (
                    <div
                      key={chip.key}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{chip.label}</span>
                      <button
                        onClick={() => clearFilter(chip.key)}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600 hover:text-gray-800 underline ml-2"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {totalJobs > 0 ? (
                <span>
                  Showing <span className="font-medium">{totalJobs}</span> job{totalJobs !== 1 ? "s" : ""}
                </span>
              ) : (
                <span>No jobs found</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
