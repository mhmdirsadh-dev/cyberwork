"use client"

import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import JobCreationModal from "./JobCreationModal"
import { createJob } from "../services/jobService"

const Header = () => {
  const location = useLocation()
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/find-jobs" },
    { name: "Find Talents", path: "/find-talents" },
    { name: "About us", path: "/about" },
    { name: "Testimonials", path: "/testimonials" },
  ]

  const handleJobSubmit = async (jobData) => {
    try {
      setIsSubmitting(true)
      const response = await createJob(jobData)

      if (response.success) {
        alert(response.message || (jobData.isDraft ? "Job saved as draft!" : "Job published successfully!"))
        setIsCreateJobOpen(false)
        // Optionally refresh the jobs list if on the jobs page
        if (location.pathname === "/find-jobs") {
          window.location.reload()
        }
      } else {
        alert("Failed to create job. Please try again.")
      }
    } catch (error) {
      console.error("Error creating job:", error)
      alert(error.message || "Failed to create job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
            <img src="logo.png" />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Create Jobs Button */}
            <button
              onClick={() => setIsCreateJobOpen(true)}
              disabled={isSubmitting}
              className="bg-gradient-to-b from-[#A128FF] to-[#6100AD] text-white px-6 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Jobs"}
            </button>
          </div>
        </div>
      </header>

      {/* JobCreationModal component */}
      <JobCreationModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onSubmit={handleJobSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  )
}

export default Header
