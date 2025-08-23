import { Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Home from "./pages/Home"
import FindJobs from "./pages/FindJobs"
import FindTalents from "./pages/FindTalents"
import About from "./pages/About"
import Testimonials from "./pages/Testimonials"

function App() {
  return (

      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/find-talents" element={<FindTalents />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Routes>
        </main>
      </div>
  )
}

export default App
