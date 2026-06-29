import React, { useEffect, useState } from 'react'
import Card from "./Card.jsx"
import { useSelector } from 'react-redux';
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../customHooks/useScrollReveal'

function Cardspage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector(state => state.course)
  const navigate = useNavigate()
  const [headingRef, headingVisible] = useScrollReveal()
  const [cardsRef, cardsVisible] = useScrollReveal()

  useEffect(() => {
    setPopularCourses(courseData.slice(0, 6))
  }, [courseData])

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div ref={headingRef} className={`text-center mb-12 reveal ${headingVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Popular Courses</h2>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mt-3">
          Explore top-rated courses designed to boost your skills, enhance careers, 
          and unlock opportunities in tech, AI, business, and beyond.
        </p>
      </div>

      <div ref={cardsRef} className={`flex items-center justify-center flex-wrap gap-6 lg:gap-8 reveal reveal-delay-1 ${cardsVisible ? 'visible' : ''}`}>
        {popularCourses.map((item, index) => (
          <Card
            key={index}
            id={item._id}
            thumbnail={item.thumbnail}
            title={item.title}
            price={item.price}
            category={item.category}
            reviews={item.reviews}
          />
        ))}
      </div>

      {popularCourses.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/allcourses")}
            className="group inline-flex items-center gap-2 bg-amber-600 
                       text-white px-6 py-3 rounded-2xl font-medium text-sm
                       hover:bg-amber-700 hover:shadow-lg
                       transition-all duration-300"
          >
            View All Courses
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </section>
  )
}

export default Cardspage
