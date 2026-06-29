import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import emptyImg from "../assets/empty.jpg";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate()

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-amber-200/20
                 transition-all duration-300 border border-slate-200 hover:border-amber-300 
                 cursor-pointer w-full max-w-sm hover:scale-[1.03] hover:z-10 relative active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={thumbnail || emptyImg}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded-full mb-3 capitalize">
          {category}
        </span>

        {/* Title */}
        <h2 className="text-base font-semibold text-slate-900 leading-snug mb-4 line-clamp-2">
          {title}
        </h2>

        {/* Meta info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-lg font-bold text-amber-600">₹{price || "Free"}</span>
          <span className="flex items-center gap-1.5 text-sm text-slate-600">
            <FaStar className="text-amber-400" /> 
            <span className="font-medium">{avgRating}</span>
            <span className="text-slate-400">({reviews?.length || 0})</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
