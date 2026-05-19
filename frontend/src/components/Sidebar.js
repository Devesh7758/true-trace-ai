import React from 'react';
import { Home, LayoutDashboard, History, Info, Upload } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Forensic Upload', icon: <Upload size={20} /> },
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'History', icon: <History size={20} /> },
    { name: 'About', icon: <Info size={20} /> },
  ];

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* LOGO SECTION */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* UPDATED: Path matches your sidebar-logo.png exactly */}
          <div className="group-hover:scale-110 transition-all duration-300">
            <img 
              src="/sidebar-logo.png" 
              alt="TrueTrace Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
          
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-800 uppercase leading-none">
              TrueTrace
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              AI Video Forensics
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentView(item.name)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 font-bold transition-all ${
              currentView === item.name
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
      
      {/* SYSTEM STATUS FOOTER */}
      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            System Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-700">Neural Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;