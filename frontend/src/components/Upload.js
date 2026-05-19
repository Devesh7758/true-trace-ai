import React, { useState, useRef } from 'react';
import { FileVideo, ImageIcon, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';

const UploadComponent = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) setFile(selectedFile);
  };

  const startAnalysis = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Neural Engine connection failed');

      const result = await response.json();
      onAnalysisComplete(result); 
      
    } catch (error) {
      console.error("System Error:", error);
      alert("System Error: Could not connect to Neural Engine. Ensure Python main.py is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '40px auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>Forensic Upload</h2>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>Submit media for neural artifact analysis</p>
      </div>

      <div onClick={() => fileInputRef.current.click()} style={dropZoneStyle}>
        <input 
          type="file" 
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="video/*,image/*" 
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />

        {!file ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', marginBottom: '24px' }}>
              <FileVideo size={48} color="#2563eb" />
              <ImageIcon size={48} color="#2563eb" />
            </div>
            <p style={{ fontWeight: 700, fontSize: '18px' }}>Select Video or Image</p>
            <p style={{ color: '#94a3b8' }}>Drag and drop or click to browse</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '16px' }} />
            <p style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b' }}>{file.name}</p>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>File Ready for Processing</p>
          </div>
        )}
      </div>

      {file && (
        <button 
          onClick={(e) => { e.stopPropagation(); startAnalysis(); }} 
          disabled={loading}
          style={loading ? btnDisabled : btnActive}
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> ANALYZING...</>
          ) : (
            <><ShieldAlert size={20} /> START FORENSIC SCAN</>
          )}
        </button>
      )}

      <div style={footerNote}>
        <CheckCircle2 size={14} color="#10b981" />
        <span>EfficientNet-B4 + LSTM Pipeline Active</span>
      </div>
    </div>
  );
};

const dropZoneStyle = { border: '2px dashed #e2e8f0', borderRadius: '24px', padding: '80px 40px', cursor: 'pointer', background: '#fff' };
const btnActive = { width: '100%', marginTop: '24px', padding: '16px', borderRadius: '16px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };
const btnDisabled = { ...btnActive, background: '#94a3b8', cursor: 'not-allowed' };
const footerNote = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, fontSize: 12, color: '#94a3b8', fontWeight: 600 };

export default UploadComponent;