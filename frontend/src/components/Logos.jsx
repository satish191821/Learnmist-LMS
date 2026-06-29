import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
  const stats = [
    { icon: MdCastForEducation, label: '20k+ Online Courses' },
    { icon: SiOpenaccess, label: 'Lifetime Access' },
    { icon: FaSackDollar, label: 'Value For Money' },
    { icon: BiSupport, label: 'Lifetime Support' },
    { icon: FaUsers, label: 'Community Support' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-center justify-center flex-wrap gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white shadow-md border border-slate-200 
                       hover:shadow-lg hover:border-amber-300 transition-all duration-300 cursor-pointer group"
          >
            <item.icon className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Logos
