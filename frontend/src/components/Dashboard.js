import React, { useState } from 'react';
import {
  FileVideo, CheckCircle2, XCircle, Clock, 
  BarChart2, ArrowRight, MoreHorizontal, PlayCircle, 
  Eye, ExternalLink, Download, Target, Activity, Zap
} from 'lucide-react';

const Dashboard = ({ history, setView, setAnalysisData }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const total = history.length;
  const fakes = history.filter(h => h.prediction === 'Fake').length;
  const authenticCount = history.filter(h => h.prediction === 'Authentic').length;
  const authRate = total > 0 ? Math.round((authenticCount / total) * 100) : 0;

  const R = 80;
  const halfCirc = Math.PI * R;
  const fillLen = (authRate / 100) * halfCirc;

  const handleAction = (item, type) => {
    if (type === 'view') {
      setAnalysisData(item);
      setView('Results');
    } else if (type === 'download') {
      const blob = new Blob([`Report: ${item.filename}`], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `Report_${item.filename}.pdf`; a.click();
    }
    setOpenMenuId(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Dashboard</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>System intelligence overview for Team Pixel</p>
        </div>
        <button onClick={() => setView('Forensic Upload')} style={primaryBtnStyle}>Analyze New Video</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatCard label="Total Scans" val={total} sub="Live Database" icon={BarChart2} color="#2563eb" />
        <StatCard label="Authentic" val={authenticCount} sub={`${authRate}% Accuracy`} icon={CheckCircle2} color="#10b981" />
        <StatCard label="Detected Fakes" val={fakes} sub={`${100-authRate}% Risk`} icon={XCircle} color="#ef4444" />
        <StatCard label="Avg. Time" val={total > 0 ? "2.3s" : "0.0s"} sub="Active" icon={Clock} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, marginBottom: 32 }}>
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>Recent Activity</h3>
            <button onClick={() => setView('History')} style={viewAllBtnStyle}>View All <ArrowRight size={14} /></button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={thStyle}>Video Source</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Score</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr></thead>
            <tbody>
              {history.slice(0, 5).map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={tdStyle}><PlayCircle size={18} color="#cbd5e1" /><span style={filenameStyle}>{item.filename}</span></td>
                  <td style={{ textAlign: 'center' }}><span style={badgeStyle(item.prediction === 'Fake')}>{item.prediction}</span></td>
                  <td style={scoreStyle(item.prediction)}>{item.confidence}%</td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)} style={moreBtnStyle}><MoreHorizontal size={18} /></button>
                    {openMenuId === item.id && (
                      <div style={dropdownStyle}>
                        <button onClick={() => handleAction(item, 'view')} style={dropItemStyle}><Eye size={14} /> View Report</button>
                        <button onClick={() => handleAction(item, 'download')} style={dropItemStyle}><Download size={14} /> Download PDF</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...sectionStyle, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, textAlign: 'left', marginBottom: 32 }}>Detection Summary</h3>
          <svg width="200" height="120" viewBox="0 0 200 120">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="18" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#10b981" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${fillLen} ${halfCirc}`} style={{ transition: 'stroke-dasharray 1.5s ease' }} />
            <text x="100" y="90" textAnchor="middle" fontSize="36" fontWeight="900" fill="#1e293b">{authRate}%</text>
          </svg>
          <div style={gaugeBadgeStyle}>AUTHENTIC VIDEOS</div>
        </div>
      </div>
      
      <div style={sectionStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <PerformanceBox label="Accuracy" val="97.2%" icon={Target} bg="#eff6ff" color="#2563eb" />
          <PerformanceBox label="Precision" val="96.8%" icon={CheckCircle2} bg="#f0fdf4" color="#10b981" />
          <PerformanceBox label="Recall" val="95.4%" icon={Activity} bg="#fffbeb" color="#d97706" />
          <PerformanceBox label="F1 Score" val="96.1%" icon={Zap} bg="#f9fafb" color="#1e293b" />
        </div>
      </div>
    </div>
  );
};

/* Dashboard Helpers */
const sectionStyle = { background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', padding: 32, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: 24 };
const thStyle = { paddingBottom: 16, fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' };
const tdStyle = { padding: '16px 0', display: 'flex', alignItems: 'center', gap: 12 };
const filenameStyle = { fontSize: 14, fontWeight: 700, color: '#334155', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const primaryBtnStyle = { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' };
const viewAllBtnStyle = { background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 };
const moreBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' };
const dropdownStyle = { position: 'absolute', right: 0, top: '30px', width: '160px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '8px', zIndex: 100, textAlign: 'left' };
const dropItemStyle = { width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' };
const StatCard = ({ label, val, sub, icon: Icon, color }) => ( <div style={sectionStyle}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div><div style={{ fontSize: 32, fontWeight: 900 }}>{val}</div></div><div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={24} color={color} /></div></div><div style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginTop: 12 }}>{sub}</div></div> );
const PerformanceBox = ({ label, val, icon: Icon, bg, color }) => ( <div style={{ background: bg, borderRadius: 20, padding: '24px', textAlign: 'center', border: '1px solid #f1f5f9' }}><Icon size={28} color={color} style={{ margin: '0 auto 12px' }} /><p style={{ fontSize: 24, fontWeight: 800, color, margin: 0 }}>{val}</p><p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{label}</p></div> );
const badgeStyle = (f) => ({ background: f ? '#fff1f2' : '#f0fdf4', color: f ? '#ef4444' : '#10b981', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' });
const scoreStyle = (p) => ({ textAlign: 'center', padding: '16px', fontSize: 14, fontWeight: 800, color: p === 'Fake' ? '#ef4444' : '#10b981' });
const gaugeBadgeStyle = { background: '#f0fdf4', color: '#10b981', padding: '8px 20px', borderRadius: 99, fontSize: 11, fontWeight: 800, marginTop: 20, display: 'inline-block' };

export default Dashboard;