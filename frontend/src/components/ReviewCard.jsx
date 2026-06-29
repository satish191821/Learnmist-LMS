import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import emptyImg from "../assets/empty.jpg";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-amber-200/20 border border-slate-200 
                    hover:border-amber-300 hover:scale-[1.02] hover:z-10 relative transition-all duration-300 w-[340px]">
      {/* Stars */}
      <div className="flex items-center mb-3 text-amber-400 text-sm gap-0.5">
        {Array(5).fill(0).map((_, i) => (
          <span key={i}>{i < rating ? <FaStar /> : <FaRegStar />}</span>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">{text}</p>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 shrink-0">
          <img src={image || emptyImg} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{name}</h4>
          <p className="text-xs text-slate-400 capitalize">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
