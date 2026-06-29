import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { IoSearch } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

const categories = [
  'App Development', 'AI/ML', 'AI Tools', 'Data Science',
  'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others'
]

function AllCourses() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filterCourses, setFilterCourses] = useState([])
  const { courseData } = useSelector(state => state.course)

  useEffect(() => {
    const catParam = searchParams.get('category')
    if (catParam) {
      setCategory([catParam])
    }
  }, [searchParams])

  const toggleChip = (value) => {
    setCategory(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  useEffect(() => {
    let courseCopy = courseData.slice()
    if (category.length > 0) {
      courseCopy = courseCopy.filter(item => category.includes(item.category))
    }
    if (searchText.trim()) {
      const text = searchText.toLowerCase()
      courseCopy = courseCopy.filter(item =>
        item.title.toLowerCase().includes(text) ||
        item.category?.toLowerCase().includes(text)
      )
    }
    setFilterCourses(courseCopy)
  }, [category, searchText, courseData])

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-20 px-4 lg:px-8 pb-12">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-lg">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm 
                       focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 
                       transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 chips-scrollbar snap-x snap-mandatory lg:flex-wrap lg:overflow-visible">
            {categories.map((cat) => {
              const isActive = category.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleChip(cat)}
                  className={`shrink-0 snap-start px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
            {category.length > 0 && (
              <button
                onClick={() => setCategory([])}
                className="shrink-0 snap-start px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {filterCourses.length} course{filterCourses.length !== 1 ? 's' : ''} found
            {category.length > 0 && (
              <button onClick={() => setCategory([])} className="ml-2 text-amber-600 hover:text-amber-700 font-medium">
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Course Grid */}
        {filterCourses.length > 0 ? (
          <div className="flex items-start justify-center lg:justify-start flex-wrap gap-6">
            {filterCourses.map((item, index) => (
              <Card
                key={item._id || index}
                id={item._id}
                thumbnail={item.thumbnail}
                title={item.title}
                price={item.price}
                category={item.category}
                reviews={item.reviews}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <IoSearch className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No courses found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllCourses
