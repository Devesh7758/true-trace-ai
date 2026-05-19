import React from 'react';
// Changed 'Github' to 'Code2' and 'Globe' to 'Globe2' to be safe
import { Shield, Cpu, Zap, Globe2, Code2, Mail } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-block p-4 bg-blue-50 rounded-3xl text-blue-600 mb-6 shadow-sm">
          <Shield size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">About TrueTrace</h1>
        <p className="text-lg text-slate-500 font-medium">Advanced AI Video Forensics for the Digital Age</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-blue-600">
            <Cpu size={24} />
            <h3 className="font-bold text-xl">Our Mission</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            TrueTrace was developed for HackCraft 3.0 to combat the rising threat of AI-generated misinformation. 
            Our system uses state-of-the-art Deep Learning to identify subtle facial manipulation that the human eye misses.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-blue-600">
            <Zap size={24} />
            <h3 className="font-bold text-xl">The Tech Stack</h3>
          </div>
          <ul className="text-slate-600 text-sm space-y-2 font-medium">
            <li>• Frontend: React.js & Tailwind CSS</li>
            <li>• Backend: FastAPI (Python)</li>
            <li>• AI Model: EfficientNet-B4 + LSTM</li>
            <li>• Computer Vision: OpenCV & MediaPipe</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
            <Globe2 size={120} />
        </div>
        <h3 className="text-2xl font-bold mb-4 relative z-10">Get in Touch</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto relative z-10">Have questions about our forensic model or want to collaborate? Reach out to our dev team.</p>
        <div className="flex justify-center gap-4 relative z-10">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/10">
            <Code2 size={18} /> View Source
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
            <Mail size={18} /> Contact Us
          </button>
        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-12 font-medium">Developed by Team TrueTrace • 2026</p>
    </div>
  );
};

export default About;