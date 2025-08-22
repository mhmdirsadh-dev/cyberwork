import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <p className="text-xl text-gray-600 mb-8">Connect with top companies and discover amazing opportunities</p>
        <Link
          to="/find-jobs"
          className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  )
}

export default Home
