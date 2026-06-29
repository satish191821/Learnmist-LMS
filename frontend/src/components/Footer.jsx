import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/allcourses' },
    { label: 'AI Search', path: '/searchwithai' },
  ];

  const categories = [
    'Web Development', 'AI/ML', 'Data Science', 'UI/UX Design', 'App Development'
  ];

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FaXTwitter, href: 'https://x.com', label: 'X' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:support@learnmist.com', label: 'Email' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 -4.83 31.876 31.876" className="h-10 w-10 text-amber-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-673.292 -327.728)">
                  <path d="M689.741,329.778l9.241,2.448-9.242,2.7-9.82-2.7,9.821-2.449m.012-2.05a.478.478,0,0,0-.113.013L673.752,331.7a.465.465,0,0,0-.01.9l15.887,4.366a.467.467,0,0,0,.123.017.476.476,0,0,0,.13-.019l14.951-4.366a.465.465,0,0,0-.011-.9l-14.95-3.962a.479.479,0,0,0-.119-.015Z"/>
                  <path d="M696.013,349.95H682.63a3.932,3.932,0,0,1-4.124-3.7v-8.831a1,1,0,0,1,2,0v8.831a1.95,1.95,0,0,0,2.124,1.7h13.383a1.949,1.949,0,0,0,2.125-1.7v-8.831a1,1,0,0,1,2,0v8.831A3.932,3.932,0,0,1,696.013,349.95Z"/>
                  <path d="M674.292,341.16a1,1,0,0,1-1-1v-4.208a1,1,0,0,1,2,0v4.208A1,1,0,0,1,674.292,341.16Z"/>
                </g>
              </svg>
              <span className="text-2xl font-bold text-amber-600">LearnMist</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-md">
              Empowering learners worldwide with AI-powered courses. 
              Learn anything, anytime, anywhere with expert instructors and cutting-edge content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                    <FiArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/allcourses?category=${encodeURIComponent(cat)}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <Link to="/allcourses" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/allcourses" className="text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <span className="text-xs text-slate-600">&copy; {currentYear} LearnMist. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300"
                aria-label={social.label}>
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
