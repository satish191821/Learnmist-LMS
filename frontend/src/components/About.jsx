import React from 'react'
import { BiSolidBadgeCheck } from "react-icons/bi";
import useScrollReveal from '../customHooks/useScrollReveal'

function About() {
  const features = [
    'Simplified Learning', 'Expert Trainers', 'Big Experience', 'Lifetime Access'
  ]
  const [contentRef, contentVisible] = useScrollReveal()
  const [visualRef, visualVisible] = useScrollReveal()

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left - Content */}
        <div ref={contentRef} className={`lg:w-[55%] space-y-6 reveal ${contentVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            We Maximize Your <span className="text-sky-600">Learning Growth</span>
          </h2>
          <p className="text-slate-500 leading-relaxed text-lg">
            We provide a modern Learning Management System to simplify online education, 
            track progress, and enhance student-instructor collaboration efficiently.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                  <BiSolidBadgeCheck className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Animated illustration */}
        <div ref={visualRef} className={`lg:w-[45%] relative group reveal reveal-delay-1 ${visualVisible ? 'visible' : ''}`}>
          <div className="relative z-10 rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />

            {/* Floating geometric shapes */}
            <div className="absolute top-8 left-8 w-16 h-16 border-2 border-amber-500/30 rounded-lg animate-pulse"
              style={{ animationDuration: '4s' }} />
            <div className="absolute top-12 right-12 w-20 h-20 border-2 border-sky-400/20 rounded-full"
              style={{ animation: 'float 6s ease-in-out infinite' }} />
            <div className="absolute bottom-16 left-12 w-12 h-12 border-2 border-amber-400/20 rotate-45"
              style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
            <div className="absolute bottom-20 right-16 w-24 h-1 bg-gradient-to-r from-sky-400/40 to-amber-400/40 rounded-full"
              style={{ animation: 'pulse 3s ease-in-out infinite' }} />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-sky-400/60 rounded-full"
              style={{ animation: 'ping 2s ease-in-out infinite' }} />
            <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-amber-400/60 rounded-full"
              style={{ animation: 'ping 2.5s ease-in-out infinite 0.5s' }} />

            {/* Central glowing accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"
              style={{ animation: 'pulse 4s ease-in-out infinite' }} />

            {/* Decorative bracket pairs */}
            <span className="absolute top-1/3 left-6 text-4xl font-light text-sky-400/20">&lt;/&gt;</span>
            <span className="absolute bottom-8 right-6 text-3xl font-light text-amber-400/20">{'{ }'}</span>

            {/* Horizontal rule decorations */}
            <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          </div>
          <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-sky-200 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}

export default About
