import React from "react";
import { PORTFOLIO_URL } from "../config";

// DD.DEV wordmark: heavy italic text with a blue → violet gradient (no background)
export const DDDevLogo = ({ size = "md" }) => {
  const text = { sm: "text-base", md: "text-lg", lg: "text-3xl" }[size];

  return (
    <span
      className={`font-black italic tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 ${text}`}
    >
      DD.DEV
    </span>
  );
};

// "Developed by DD.DEV" — the logo links to the portfolio once PORTFOLIO_URL is set
const DevBadge = ({ size = "md", className = "", compact = false }) => (
  <div className={`inline-flex items-center gap-2 ${className}`}>
    <span
      className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ${compact ? "hidden sm:inline" : ""}`}
    >
      Developed by
    </span>
    {PORTFOLIO_URL ? (
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Visit the DD.DEV portfolio"
        className="inline-flex transition-transform duration-200 hover:scale-105 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400 rounded"
      >
        <DDDevLogo size={size} />
      </a>
    ) : (
      <DDDevLogo size={size} />
    )}
  </div>
);

export default DevBadge;
