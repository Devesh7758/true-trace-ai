import React from "react";

// DD.DEV logo: italic heavy wordmark with a blue → violet gradient on a dark pill
export const DDDevLogo = ({ size = "md" }) => {
  const sizes = {
    sm: { text: "text-sm", pad: "px-3 py-1.5", radius: "rounded-lg" },
    md: { text: "text-base", pad: "px-4 py-2", radius: "rounded-xl" },
    lg: { text: "text-2xl", pad: "px-6 py-3", radius: "rounded-2xl" },
  }[size];

  return (
    <span
      className={`relative inline-flex items-center overflow-hidden bg-[#0d0d0f] border border-white/5 shadow-lg shadow-indigo-500/10 ${sizes.pad} ${sizes.radius}`}
    >
      {/* soft blue glow in the corner, like the original logo */}
      <span className="pointer-events-none absolute -left-3 -top-3 w-8 h-8 rounded-full bg-blue-500/30 blur-md"></span>
      <span
        className={`relative font-black italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 ${sizes.text}`}
      >
        DD.DEV
      </span>
    </span>
  );
};

// "Developed by [DD.DEV]"
const DevBadge = ({ size = "md", className = "", compact = false }) => (
  <div className={`inline-flex items-center gap-3 ${className}`}>
    <span
      className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ${compact ? "hidden sm:inline" : ""}`}
    >
      Developed by
    </span>
    <DDDevLogo size={size} />
  </div>
);

export default DevBadge;
