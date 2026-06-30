import React, { useState, useRef, useEffect } from 'react'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import { FiArrowLeft, FiZap, FiStar, FiX } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import emptyImg from "../assets/empty.jpg"
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

const HISTORY_KEY = "ai-search-history"
const MAX_HISTORY = 8

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") } catch { return [] }
  })
  const navigate = useNavigate();
  const startSound = new Audio(start)
  const debounceRef = useRef(null)
  const recognitionRef = useRef(null)
  const loadingRef = useRef(false)

  useEffect(() => { loadingRef.current = loading }, [loading])

  const updateHistory = (query) => {
    const filtered = history.filter(h => h.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, MAX_HISTORY)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  const removeHistory = (query) => {
    const updated = history.filter(h => h !== query)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  const handleRecommendation = async (query) => {
    if (!query.trim() || loadingRef.current) return
    setLoading(true)
    setSearched(true)
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      updateHistory(query.trim())
    } catch (error) {
      toast.error("Failed to search courses");
    } finally {
      setLoading(false)
      setListening(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    if (!value.trim()) {
      setRecommendations([])
      setSearched(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim() && !loadingRef.current) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      handleRecommendation(input)
    }
  }

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported. Please use Chrome.')
      return
    }
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setListening(false)
      return
    }
    setListening(true)
    startSound.play()
    try {
      const r = new SpeechRecognition()
      r.interimResults = true
      r.lang = 'en-US'
      r.onresult = (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript
        setInput(transcript)
        if (e.results[e.results.length - 1].isFinal && transcript.trim()) {
          if (debounceRef.current) clearTimeout(debounceRef.current)
          handleRecommendation(transcript.trim())
        }
      }
      r.onerror = (e) => {
        if (e.error === 'audio-capture' || e.error === 'not-allowed') toast.error('Microphone access denied.')
        else if (e.error === 'no-speech') toast.error('No speech detected.')
        else toast.error('Microphone error.')
        setListening(false)
        recognitionRef.current = null
      }
      r.onend = () => { setListening(false); recognitionRef.current = null }
      r.start()
      recognitionRef.current = r
    } catch (e) {
      setListening(false)
      toast.error('Failed to start speech recognition.')
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-950 to-rose-950">
      <div className="max-w-6xl mx-auto px-4 pt-16 lg:pt-20 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
            <FiZap className="w-4 h-4 text-rose-400" />
            AI-Powered Course Discovery
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Search with <span className="text-rose-400">AI</span>
          </h1>
          <p className="text-white/50">Type or speak what you want to learn</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full px-6 py-4 pr-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white 
                         placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 
                         transition-all text-base"
              placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {input && (
                <button
                  onClick={() => { if (debounceRef.current) clearTimeout(debounceRef.current); handleRecommendation(input) }}
                  disabled={loading}
                  className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {loading ? <ClipLoader size={14} color="white" /> : <img src={ai} className="w-5 h-5" alt="" />}
                </button>
              )}
              <button
                onClick={handleVoiceSearch}
                disabled={loading}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${listening ? 'bg-red-500 animate-pulse' : 'bg-white/20 hover:bg-white/30'}`}
              >
                <RiMicAiFill className={`w-5 h-5 ${listening ? 'text-white' : 'text-rose-300'}`} />
              </button>
            </div>
          </div>

          {/* History Chips */}
          {!input && history.length > 0 && !searched && (
            <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
              <span className="text-xs text-white/30 mr-1">Recent:</span>
              {history.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/60 hover:bg-white/20 hover:text-white transition-colors cursor-pointer group/chip"
                  onClick={() => { setInput(h); handleRecommendation(h) }}>
                  {h}
                  <FiX className="w-3 h-3 text-white/30 hover:text-white/80 group-hover/chip:text-white/80"
                    onClick={(e) => { e.stopPropagation(); removeHistory(h) }} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {recommendations.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
              <img src={ai1} className="w-8 h-8" alt="" />
              AI Search Results
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recommendations.map((course, index) => (
                <div key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer 
                              hover:bg-white/10 hover:border-amber-500/30 hover:scale-[1.02] hover:z-10 relative transition-all duration-300"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}>
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={course.thumbnail || emptyImg} alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium text-rose-300 bg-rose-500/10 rounded-full mb-2">
                      {course.category}
                    </span>
                    <h3 className="text-base font-semibold text-white group-hover:text-rose-300 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    {course.subTitle && (
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">{course.subTitle}</p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-sm font-bold text-amber-400">
                        {course.price ? `₹${course.price}` : "Free"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <FiStar className="w-3 h-3" />
                        {course.level || "All levels"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <ClipLoader size={40} color="#a78bfa" />
                <p className="text-white/50">Searching...</p>
              </div>
            ) : listening ? (
              <p className="text-xl text-white/50">Listening...</p>
            ) : searched ? (
              <div>
                <p className="text-xl text-white/50 mb-4">No courses found</p>
                <button onClick={() => navigate("/allcourses")}
                  className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all">
                  Browse All Courses
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <FiZap className="w-12 h-12 text-rose-400/50" />
                <p className="text-lg text-white/40">Tap the mic or type to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;
