import api from "../utils/api"

// Get all jobs with filters and pagination
export const getJobs = async (filters = {}) => {
  try {
    const params = new URLSearchParams()

    if (filters.search) params.append("search", filters.search)
    if (filters.location) params.append("location", filters.location)
    if (filters.jobType) params.append("jobType", filters.jobType)
    if (filters.experience) params.append("experience", filters.experience)
    if (filters.salaryMin) params.append("salaryMin", filters.salaryMin)
    if (filters.salaryMax) params.append("salaryMax", filters.salaryMax)
    if (filters.page) params.append("page", filters.page)
    if (filters.limit) params.append("limit", filters.limit)
    if (filters.sortBy) params.append("sortBy", filters.sortBy)

    const response = await api.get(`/jobs?${params.toString()}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch jobs")
  }
}

// Get job by ID
export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch job")
  }
}

// Create new job
export const createJob = async (jobData) => {
  try {
    const response = await api.post("/jobs", jobData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create job")
  }
}

// Update job
export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/jobs/${id}`, jobData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update job")
  }
}

// Delete job
export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/jobs/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete job")
  }
}

// Search jobs
export const searchJobs = async (searchParams) => {
  try {
    const params = new URLSearchParams(searchParams)
    const response = await api.get(`/jobs/search?${params.toString()}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to search jobs")
  }
}

export const getJobSuggestions = async (query) => {
  try {
    const response = await api.get(`/jobs/suggestions?q=${encodeURIComponent(query)}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch suggestions")
  }
}
