"use client"

import { useState, useEffect } from "react"
import SearchFilters from "../components/SearchFilters"
import JobGrid from "../components/JobGrid"
import { getJobs } from "../services/jobService"

const FindJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false,
  })

  // Fetch jobs function with enhanced filtering and sorting
  const fetchJobs = async (newFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const apiFilters = {
        ...newFilters,
        page: newFilters.page || 1,
        limit: 12,
      }

      // Handle salary range
      if (newFilters.salaryRange) {
        apiFilters.salaryMin = newFilters.salaryRange[0]
        apiFilters.salaryMax = newFilters.salaryRange[1]
        delete apiFilters.salaryRange
      }

      // Handle experience level mapping
      if (newFilters.experience) {
        // Map experience levels to backend format
        const experienceMap = {
          "Entry Level (0-1 years)": "0-1",
          "Mid Level (2-5 years)": "2-5",
          "Senior Level (5+ years)": "5+",
          "Executive Level": "executive",
        }
        apiFilters.experience = experienceMap[newFilters.experience] || newFilters.experience
      }

      const response = await getJobs(apiFilters)

      if (response.success) {
        let sortedJobs = response.data

        if (newFilters.sortBy) {
          switch (newFilters.sortBy) {
            case "newest":
              sortedJobs = sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              break
            case "oldest":
              sortedJobs = sortedJobs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              break
            case "salary-high":
              sortedJobs = sortedJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
              break
            case "salary-low":
              sortedJobs = sortedJobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0))
              break
            case "relevance":
              // Keep original order for relevance (search-based)
              break
            default:
              break
          }
        }

        setJobs(sortedJobs)
        setPagination(response.pagination)
      } else {
        setError("Failed to fetch jobs")
      }
    } catch (err) {
      setError(err.message)
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchJobs()
  }, [])

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    fetchJobs({ ...newFilters, page: 1 })
  }

  // Handle pagination
  const handlePageChange = (page) => {
    fetchJobs({ ...filters, page })
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchFilters onFiltersChange={handleFiltersChange} totalJobs={pagination.totalJobs} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading jobs</p>
          <p className="text-sm">{error}</p>
          <button onClick={() => fetchJobs(filters)} className="mt-2 text-sm underline hover:no-underline">
            Try again
          </button>
        </div>
      )}

      <JobGrid jobs={jobs} loading={loading} />

      {/* Enhanced Pagination */}
      {!loading && jobs.length > 0 && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-8">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * 12 + 1} to{" "}
            {Math.min(pagination.currentPage * 12, pagination.totalJobs)} of {pagination.totalJobs} jobs
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              First
            </button>

            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.currentPage - 2) + i
                if (pageNum > pagination.totalPages) return null

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      pageNum === pagination.currentPage
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>

            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{pagination.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{new Set(jobs.map((job) => job.company)).size}</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{new Set(jobs.map((job) => job.location)).size}</div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter((job) => job.postedTime?.includes("24h")).length}
              </div>
              <div className="text-sm text-gray-600">New Today</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindJobs
