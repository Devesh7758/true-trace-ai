import React from 'react';
import { Zap, Target, Cpu, ArrowRight, Activity } from 'lucide-react';

const Home = ({ onUploadClick }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[40px] p-16 text-white mb-12 relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-8">
            <Activity size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Engine v4.2 Active</span>
          </div>
          <h1 className="text-6xl font-black mb-6 leading-[1.1] tracking-tighter">
            Verify Digital <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Authenticity.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium mb-10 leading-relaxed">
            Team Pixel presents TrueTrace: An advanced AI forensic suite designed to detect deepfakes and generative manipulation with surgical precision.
          </p>
          <button 
            onClick={onUploadClick}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            Start Forensic Scan <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-3 gap-8">
        {[
          { 
            title: "Facial Texture Analysis", 
            desc: "Detects micro-patterns in skin texture typical of GAN-generated faces.",
            icon: <Target className="text-blue-500" size={24} />,
            color: "blue"
          },
          { 
            title: "Temporal Consistency", 
            desc: "Analyzes frame-to-frame stability to find flickering in AI manipulations.",
            icon: <Zap className="text-amber-500" size={24} />,
            color: "amber"
          },
          { 
            title: "Neural Explainability", 
            desc: "Visualizes exactly where the AI found suspicious patterns using Grad-CAM.",
            icon: <Cpu className="text-indigo-500" size={24} />,
            color: "indigo"
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-slate-100 group">
            <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-3">{feature.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Secured by Team Pixel Forensic Protocol • 2026
        </p>
      </div>
    </div>
  );
};

export default Home;