import mongoose from "mongoose"

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    companyLogo: String,
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["Full Time", "Part Time", "Contract", "Freelance", "Internship"],
    },
    experience: {
      type: String,
      default: "1-3 yr Exp",
    },
    salaryMin: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    salaryMax: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    salary: {
      type: String,
      default: "Negotiable",
    },
    applicationDeadline: {
      type: Date,
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [2000, "Job description cannot exceed 2000 characters"],
    },
    description: [
      {
        type: String,
      },
    ],
    isDraft: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "reviewed", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for formatted salary
jobSchema.virtual("formattedSalary").get(function () {
  if (this.salaryMax) {
    return `${Math.floor(this.salaryMax / 100000)}LPA`
  }
  return "Negotiable"
})

// Virtual for posted time
jobSchema.virtual("postedTime").get(function () {
  const now = new Date()
  const diffTime = Math.abs(now - this.createdAt)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "24h Ago"
  if (diffDays < 7) return `${diffDays}d Ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w Ago`
  return `${Math.floor(diffDays / 30)}m Ago`
})

// Index for search functionality
jobSchema.index({ jobTitle: "text", companyName: "text", jobDescription: "text" })
jobSchema.index({ location: 1 })
jobSchema.index({ jobType: 1 })
jobSchema.index({ salaryMin: 1, salaryMax: 1 })
jobSchema.index({ createdAt: -1 })

// Pre-save middleware to process description
jobSchema.pre("save", function (next) {
  if (this.jobDescription && !this.description.length) {
    this.description = this.jobDescription
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, 5) // Limit to 5 bullet points
  }

  // Set formatted salary
  if (this.salaryMax && !this.salary) {
    this.salary = this.formattedSalary
  }

  next()
})

export default mongoose.model("Job", jobSchema)
