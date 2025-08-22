import mongoose from "mongoose"
import Job from "../models/Job.js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Sample job data extracted from the provided images
const sampleJobs = [
  {
    jobTitle: "Full Stack Developer",
    companyName: "Amazon",
    companyLogo: "/assets/amazon.png", // Added company logo
    location: "Chennai",
    jobType: "Full Time",
    experience: "1-3 yr Exp",
    salaryMin: 1000000,
    salaryMax: 1200000,
    salary: "12LPA",
    jobDescription: `We are looking for a talented Full Stack Developer to join our dynamic team.

• A user-friendly interface lets you browse stunning photos and videos
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized`,
    description: [
      "A user-friendly interface lets you browse stunning photos and videos",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isDraft: false,
    isActive: true,
    views: Math.floor(Math.random() * 100) + 50,
  },
  {
    jobTitle: "Node Js Developer",
    companyName: "Tesla",
    companyLogo: "/assets/tesla.png", // Added company logo
    location: "Bangalore",
    jobType: "Full Time",
    experience: "1-3 yr Exp",
    salaryMin: 1000000,
    salaryMax: 1200000,
    salary: "12LPA",
    jobDescription: `Join Tesla's innovative team as a Node.js Developer and help build the future of sustainable transport.

• A user-friendly interface lets you browse stunning photos and videos
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized`,
    description: [
      "A user-friendly interface lets you browse stunning photos and videos",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
    ],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    isDraft: false,
    isActive: true,
    views: Math.floor(Math.random() * 100) + 30,
  },
  {
    jobTitle: "UX/UI Designer",
    companyName: "Swiggy",
    companyLogo: "/assets/swiggy.png", // Added company logo
    location: "Mumbai",
    jobType: "Full Time",
    experience: "1-3 yr Exp",
    salaryMin: 1000000,
    salaryMax: 1200000,
    salary: "12LPA",
    jobDescription: `Create amazing user experiences as a UX/UI Designer at Swiggy, India's leading food delivery platform.

• A user-friendly interface lets you browse stunning photos and videos
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized`,
    description: [
      "A user-friendly interface lets you browse stunning photos and videos",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
    ],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isDraft: false,
    isActive: true,
    views: Math.floor(Math.random() * 100) + 40,
  },
   {
    jobTitle: "Full Stack Developer",
    companyName: "Amazon",
    companyLogo: "/assets/amazon.png", // Added company logo
    location: "Chennai",
    jobType: "Full Time",
    experience: "1-3 yr Exp",
    salaryMin: 1000000,
    salaryMax: 1200000,
    salary: "12LPA",
    jobDescription: `We are looking for a talented Full Stack Developer to join our dynamic team.

• A user-friendly interface lets you browse stunning photos and videos
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized`,
    description: [
      "A user-friendly interface lets you browse stunning photos and videos",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
    ],
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isDraft: false,
    isActive: true,
    views: Math.floor(Math.random() * 100) + 50,
  },
  {
    jobTitle: "Node Js Developer",
    companyName: "Tesla",
    companyLogo: "/assets/tesla.png", // Added company logo
    location: "Bangalore",
    jobType: "Full Time",
    experience: "1-3 yr Exp",
    salaryMin: 1000000,
    salaryMax: 1200000,
    salary: "12LPA",
    jobDescription: `Join Tesla's innovative team as a Node.js Developer and help build the future of sustainable transport.

• A user-friendly interface lets you browse stunning photos and videos
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized`,
    description: [
      "A user-friendly interface lets you browse stunning photos and videos",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
    ],
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    isDraft: false,
    isActive: true,
    views: Math.floor(Math.random() * 100) + 30,
  },
  {
    jobTitle: "UX/UI Designer",
    companyName: "Swiggy",
    companyLogo: "/assets/swiggy.png", // Added company logo
    location: "Mumbai",
    jobType: "Full Time",
    experience: "1-3 yr Exp",
    salaryMin: 1000000,
    salaryMax: 1200000,
    salary: "12LPA",
    jobDescription: `Create amazing user experiences as a UX/UI Designer at Swiggy, India's leading food delivery platform.

• A user-friendly interface lets you browse stunning photos and videos
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized
• Filter destinations based on interests and travel style, and create personalized`,
    description: [
      "A user-friendly interface lets you browse stunning photos and videos",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
      "Filter destinations based on interests and travel style, and create personalized",
    ],
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isDraft: false,
    isActive: true,
    views: Math.floor(Math.random() * 100) + 40,
  }
  
]

const seedJobs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing jobs (optional - remove this line if you want to keep existing data)
    await Job.deleteMany({})
    console.log("Cleared existing jobs")

    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs)
    console.log(`Successfully inserted ${insertedJobs.length} jobs`)

    // Display inserted jobs
    insertedJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.jobTitle} at ${job.companyName} - ${job.salary}`)
    })

    console.log("Seed data insertion completed successfully!")
  } catch (error) {
    console.error("Error seeding jobs:", error)
  } finally {
    // Close the connection
    await mongoose.connection.close()
    console.log("Database connection closed")
    process.exit(0)
  }
}

// Run the seed function
seedJobs()
