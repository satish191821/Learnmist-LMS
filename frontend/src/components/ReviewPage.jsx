import React, { useEffect, useRef } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux'
import useScrollReveal from '../customHooks/useScrollReveal'

function ReviewPage() {
  const { allReview } = useSelector(state => state.review)
  const [headingRef, headingVisible] = useScrollReveal()
  const scrollRef = useRef(null)
  const autoScrollRef = useRef(null)

  useEffect(() => {
    if (!allReview?.length || allReview.length < 2) return

    autoScrollRef.current = setInterval(() => {
      const el = scrollRef.current
      if (!el) return

      const cardWidth = 364
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - cardWidth) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: 'smooth' })
      }
    }, 3500)

    return () => clearInterval(autoScrollRef.current)
  }, [allReview?.length])

  const reviews = allReview?.slice(0, 10) || []

  return (
    <section className="max-w-7xl mx-auto px-4 pt-12 md:pt-16 pb-6">
      <div ref={headingRef} className={`text-center mb-10 reveal ${headingVisible ? 'visible' : ''}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Real Reviews from Real Learners</h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mt-3">
          Discover how our platform is transforming learning experiences through 
          real feedback from students and professionals worldwide.
        </p>
      </div>

      {reviews.length > 0 && (
        <div ref={scrollRef}
          className={`flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth px-1 ${reviews.length === 1 ? 'justify-center' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {reviews.map((item, index) => (
            <div key={index} className="snap-start shrink-0">
              <ReviewCard
                rating={item.rating}
                image={item.user?.photoUrl}
                text={item.comment}
                name={item.user?.name}
                role={item.user?.role}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ReviewPage
