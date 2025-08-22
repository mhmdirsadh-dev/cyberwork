import { MapPin, Clock, DollarSign, Eye } from "lucide-react"

const JobCard = ({ job }) => {


 console.log(job)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200 h-full flex flex-col">
      {/* Header with logo and time badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm overflow-hidden bg-gray-50">
            <img
              src={job.companyLogo}
              alt={`${job.companyName} logo`}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{job.jobTitle}</h3>
            <p className="text-gray-600 text-sm">{job.companyName}</p>
          </div>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
          {job.postedTime || "24h Ago"}
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{job.experience}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">{job.salary}</span>
        </div>
        {job.views > 0 && (
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span className="font-medium">{job.views}</span>
          </div>
        )}
      </div>

      <div className="flex-1 mb-6">
        <ul className="text-sm text-gray-600 space-y-2">
          {job.description.slice(0, 3).map((item, index) => (
            <li key={index} className="flex items-start leading-relaxed">
              <span className="text-gray-400 mr-3 mt-1 text-xs">•</span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-sm">
        Apply Now
      </button>
    </div>
  )
}

export default JobCard
