import Job from "../models/Job.js"

// Get all jobs with pagination and filtering
export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, location, jobType, salaryMin, salaryMax } = req.query

    // Build query
    const query = { isActive: true, isDraft: false }

    // Text search
    if (search) {
      query.$text = { $search: search }
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      query.$and = []
      if (salaryMin) {
        query.$and.push({
          $or: [{ salaryMin: { $gte: Number.parseInt(salaryMin) } }, { salaryMin: { $exists: false } }],
        })
      }
      if (salaryMax) {
        query.$and.push({
          $or: [{ salaryMax: { $lte: Number.parseInt(salaryMax) } }, { salaryMax: { $exists: false } }],
        })
      }
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate("postedBy", "name company.name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    // Get total count for pagination
    const total = await Job.countDocuments(query)

    // Format jobs for frontend
    const formattedJobs = jobs.map((job) => ({
      id: job._id,
      jobTitle: job.jobTitle,
      title: job.jobTitle, // For compatibility
      companyName: job.companyName,
      company: job.companyName, // For compatibility
      companyLogo: job.companyLogo,
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      postedTime: job.postedTime || "Recently",
      applicationDeadline: job.applicationDeadline,
      jobDescription: job.jobDescription,
      description: job.description,
      isDraft: job.isDraft,
      views: job.views,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }))

    res.status(200).json({
      success: true,
      data: formattedJobs,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get all jobs error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name company.name")

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Increment views
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

    // Format job for frontend
    const formattedJob = {
      id: job._id,
      jobTitle: job.jobTitle,
      title: job.jobTitle,
      companyName: job.companyName,
      company: job.companyName,
      companyLogo: job.companyLogo,
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      postedTime: job.postedTime || "Recently",
      applicationDeadline: job.applicationDeadline,
      jobDescription: job.jobDescription,
      description: job.description,
      isDraft: job.isDraft,
      views: job.views + 1,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      postedBy: job.postedBy,
    }

    res.status(200).json({
      success: true,
      data: formattedJob,
    })
  } catch (error) {
    console.error("Get job by ID error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Create new job
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      // postedBy: req.user?.id, // Will be enabled when auth is implemented
    }

    const job = await Job.create(jobData)

    // Format job for frontend
    const formattedJob = {
      id: job._id,
      jobTitle: job.jobTitle,
      title: job.jobTitle,
      companyName: job.companyName,
      company: job.companyName,
      companyLogo: job.companyLogo,
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      postedTime: "Just now",
      applicationDeadline: job.applicationDeadline,
      jobDescription: job.jobDescription,
      description: job.description,
      isDraft: job.isDraft,
      views: job.views,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }

    res.status(201).json({
      success: true,
      message: job.isDraft ? "Job saved as draft" : "Job created successfully",
      data: formattedJob,
    })
  } catch (error) {
    console.error("Create job error:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Format job for frontend
    const formattedJob = {
      id: job._id,
      jobTitle: job.jobTitle,
      title: job.jobTitle,
      companyName: job.companyName,
      company: job.companyName,
      companyLogo: job.companyLogo,
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      postedTime: job.postedTime || "Recently",
      applicationDeadline: job.applicationDeadline,
      jobDescription: job.jobDescription,
      description: job.description,
      isDraft: job.isDraft,
      views: job.views,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: formattedJob,
    })
  } catch (error) {
    console.error("Update job error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    console.error("Delete job error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Search jobs (same as getAllJobs with enhanced search)
export const searchJobs = async (req, res) => {
  return getAllJobs(req, res)
}
