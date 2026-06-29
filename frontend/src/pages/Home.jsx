import React from 'react'
import { FiArrowRight, FiSearch } from "react-icons/fi";
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About';
import ReviewPage from '../components/ReviewPage';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../customHooks/useScrollReveal'

function Home() {
  const navigate = useNavigate()
  const [heroRef, heroVisible] = useScrollReveal()
  const [logosRef, logosVisible] = useScrollReveal()

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Content */}
        <div ref={heroRef} className="relative z-10 max-w-5xl mx-auto px-4 text-center backdrop-blur-[1px]">

          <h1 className={`relative z-20 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight reveal ${heroVisible ? 'visible' : ''}`}>
            Grow Your Skills to
            <span className="block mt-2 text-amber-200 italic">
              Advance Your Career
            </span>
          </h1>
          <p className={`relative z-10 mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto reveal reveal-delay-1 ${heroVisible ? 'visible' : ''}`}>
            Learn from industry experts, get AI-powered course recommendations, 
            and build real-world skills that land you your dream job.
          </p>
          <div className={`relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4 reveal reveal-delay-2 ${heroVisible ? 'visible' : ''}`}>
            <button
              onClick={() => navigate("/allcourses")}
              className="group bg-amber-600 text-white px-8 py-3.5 rounded-2xl font-medium text-base 
                        hover:bg-amber-700 hover:shadow-2xl 
                       transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
            >
              Explore Courses
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/searchwithai")}
              className="group px-8 py-3.5 rounded-2xl font-medium text-base 
                       border-2 border-white/30 text-white bg-white/5 backdrop-blur-sm
                       hover:bg-white/10 hover:border-white/50
                       transition-all duration-300 active:scale-[0.98] flex items-center gap-2"
            >
              <FiSearch className="w-5 h-5" />
              Search with AI
            </button>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div ref={logosRef} className={`reveal ${logosVisible ? 'visible' : ''}`}><Logos /></div>
      <ExploreCourses />
      <Cardspage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  )
}

export default Home
