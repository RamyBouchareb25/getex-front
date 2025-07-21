"use client";
import React, { useState, useEffect } from 'react';
import { Clock, Mail, Rocket, Zap, Star, Code } from 'lucide-react';

export default function UnderConstruction() {
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [stars, setStars] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Animate progress bar
    const timer = setInterval(() => {
      setProgress(prev => (prev < 75 ? prev + 1 : prev));
    }, 50);

    // Generate floating stars
    const starArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));
    setStars(starArray);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Stars */}
      {stars.map(star => (
        <Star
          key={star.id}
          className="absolute text-white opacity-20 animate-pulse"
          size={8}
          style={{
            left: `${star.left}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:scale-110 transition-transform duration-300">
              <Code className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-30 animate-ping"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-fade-in">
            Coming Soon
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're crafting something extraordinary. Our Next.js powered experience is being built with cutting-edge technology and attention to every detail.
          </p>

          {/* Progress Section */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Development Progress</span>
              <span className="text-sm font-medium text-white">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm border border-white/20">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/30"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Email Signup */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for updates"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {isSubmitted ? 'Thank you!' : 'Notify Me'}
              </button>
            </div>
            {isSubmitted && (
              <p className="mt-3 text-green-400 text-sm animate-fade-in">
                🎉 You'll be the first to know when we launch!
              </p>
            )}
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-lg mx-auto">
            {[
              { icon: Rocket, label: 'Fast Performance' },
              { icon: Zap, label: 'Modern Tech' },
              { icon: Star, label: 'Great UX' },
              { icon: Clock, label: 'Coming Soon' }
            ].map(({ icon: Icon, label }, index) => (
              <div 
                key={label}
                className="flex flex-col items-center group hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>Built with Next.js • React • Tailwind CSS</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}