import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Home, LayoutDashboard, History, Info, Upload, X } from "lucide-react";
import { aiService } from "../api/aiService";

const STATUS = {
  checking: {
    dot: "bg-amber-400 animate-pulse",
    label: "Waking Neural Engine...",
  },
  online: { dot: "bg-green-500 animate-pulse", label: "Neural Engine Online" },
  offline: { dot: "bg-red-500", label: "Neural Engine Offline" },
};

const menuItems = [
  { name: "Home", icon: Home },
  { name: "Forensic Upload", icon: Upload },
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "History", icon: History },
  { name: "About", icon: Info },
];

const Sidebar = ({
  currentView,
  setCurrentView,
  mobileOpen = false,
  onClose = () => {},
}) => {
  const [engine, setEngine] = useState("checking");
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  // Ping /health on load (also wakes the Render service) and every 5 minutes
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const ok = await aiService.health();
      if (!cancelled) setEngine(ok ? "online" : "offline");
    };
    check();
    const timer = setInterval(check, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Slide the highlight to the item for the section currently on screen
  useLayoutEffect(() => {
    const el = itemRefs.current[currentView];
    if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight });
  }, [currentView]);

  const activeIndex = Math.max(
    0,
    menuItems.findIndex((i) => i.name === currentView),
  );
  const progress = ((activeIndex + 1) / menuItems.length) * 100;

  return (
    <>
      {/* backdrop for the mobile drawer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 ease-out lg:static lg:translate-x-0 lg:z-auto ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-50 lg:hidden"
        >
          <X size={20} />
        </button>
        {/* LOGO SECTION */}
        <div className="p-8 mb-4">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => {
              setCurrentView("Home");
              onClose();
            }}
          >
            <div className="group-hover:scale-110 transition-all duration-300">
              <img
                src="/sidebar-logo.png"
                alt="TrueTrace Logo"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
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

        {/* NAVIGATION — follows the page as you scroll */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <div className="relative">
            {/* sliding highlight */}
            <div
              className="absolute left-0 right-0 rounded-xl bg-blue-50 shadow-sm transition-all duration-500 ease-out"
              style={{ top: indicator.top, height: indicator.height }}
            />
            {/* scroll progress rail */}
            <div className="absolute -left-2 top-1 bottom-1 w-0.5 rounded-full bg-slate-100">
              <div
                className="w-full rounded-full bg-gradient-to-b from-blue-500 to-violet-500 transition-all duration-500 ease-out"
                style={{ height: `${progress}%` }}
              />
            </div>

            {menuItems.map(({ name, icon: Icon }) => {
              const active = currentView === name;
              return (
                <button
                  key={name}
                  ref={(el) => {
                    itemRefs.current[name] = el;
                  }}
                  onClick={() => {
                    setCurrentView(name);
                    onClose();
                  }}
                  aria-current={active ? "true" : undefined}
                  className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 font-bold transition-colors duration-300 ${
                    active
                      ? "text-blue-600"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* SYSTEM STATUS FOOTER */}
        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              System Status
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${STATUS[engine].dot}`}
              ></div>
              <span className="text-xs font-bold text-slate-700">
                {STATUS[engine].label}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
