import express from "express"
import { body, query, param } from "express-validator"
import { getAllJobs, getJobById, createJob, updateJob, deleteJob, searchJobs } from "../controllers/jobController.js"
import { validateRequest } from "../middleware/validateRequest.js"

const router = express.Router()

// Validation rules
const jobValidation = [
  body("jobTitle").trim().notEmpty().withMessage("Job title is required"),
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("jobType").trim().notEmpty().withMessage("Job type is required"),
  body("jobDescription").trim().notEmpty().withMessage("Job description is required"),
  body("salaryMin").optional().isNumeric().withMessage("Minimum salary must be a number"),
  body("salaryMax").optional().isNumeric().withMessage("Maximum salary must be a number"),
  body("applicationDeadline").optional().isISO8601().withMessage("Invalid date format"),
]

const searchValidation = [
  query("search").optional().trim(),
  query("location").optional().trim(),
  query("jobType").optional().trim(),
  query("salaryMin").optional().isNumeric(),
  query("salaryMax").optional().isNumeric(),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
]

// Routes
router.get("/", searchValidation, validateRequest, getAllJobs)
router.get("/search", searchValidation, validateRequest, searchJobs)
router.get("/:id", param("id").isMongoId().withMessage("Invalid job ID"), validateRequest, getJobById)
router.post("/", jobValidation, validateRequest, createJob)
router.put("/:id", param("id").isMongoId().withMessage("Invalid job ID"), jobValidation, validateRequest, updateJob)
router.delete("/:id", param("id").isMongoId().withMessage("Invalid job ID"), validateRequest, deleteJob)

export default router
