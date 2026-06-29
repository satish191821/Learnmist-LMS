import React from 'react'
import { FiArrowRight } from "react-icons/fi";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { TbBrandOpenai } from "react-icons/tb";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardDataFill } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../customHooks/useScrollReveal'

function ExploreCourses() {
  const navigate = useNavigate()
  const [headingRef, headingVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useScrollReveal()

  const categories = [
    { icon: TbDeviceDesktopAnalytics, label: 'Web Development', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { icon: LiaUikit, label: 'UI UX Designing', bg: 'bg-rose-50', color: 'text-rose-600' },
    { icon: MdAppShortcut, label: 'App Development', bg: 'bg-pink-50', color: 'text-pink-600' },
    { icon: FaHackerrank, label: 'Ethical Hacking', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { icon: TbBrandOpenai, label: 'AI/ML', bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { icon: SiGoogledataproc, label: 'Data Science', bg: 'bg-cyan-50', color: 'text-cyan-600' },
    { icon: BsClipboardDataFill, label: 'Data Analytics', bg: 'bg-rose-50', color: 'text-rose-600' },
    { icon: SiOpenaigym, label: 'AI Tools', bg: 'bg-violet-50', color: 'text-violet-600' },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
        {/* Left content */}
        <div ref={headingRef} className={`lg:w-[350px] shrink-0 reveal ${headingVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Explore <span className="text-emerald-600">Our Courses</span>
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Choose from a wide range of categories and start learning 
            from industry experts with hands-on projects.
          </p>
          <button
            onClick={() => navigate("/allcourses")}
            className="group inline-flex items-center gap-2 bg-amber-600 
                       text-white px-6 py-3 rounded-2xl font-medium text-sm
                       hover:bg-amber-700 hover:shadow-lg
                       transition-all duration-300"
          >
            Explore All
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Grid */}
        <div ref={gridRef} className={`flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 reveal reveal-delay-1 ${gridVisible ? 'visible' : ''}`}>
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => navigate(`/allcourses`)}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 
                         hover:shadow-xl hover:shadow-amber-200/20 hover:border-amber-300 hover:scale-[1.05] hover:z-10 relative transition-all duration-300"
            >
              <div className={`w-14 h-14 ${cat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <cat.icon className={`w-7 h-7 ${cat.color}`} />
              </div>
              <span className="text-xs font-medium text-slate-600 text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExploreCourses
