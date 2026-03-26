import React from 'react';
import { X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// --- FALLBACK MOCK DATA (used only when no real backend data is available) ---
const generateMockFrames = () => {
  const data = [];
  let currentProb = 0.3;
  for (let i = 0; i < 100; i += 1) {
    currentProb += (Math.random() - 0.5) * 0.2;
    currentProb = Math.max(0.1, Math.min(0.9, currentProb));
    data.push({ frame: i, probability: currentProb });
  }
  data[40].probability = 0.75;
  data[41].probability = 0.82;
  data[42].probability = 0.68;
  return data;
};

const mockFrameData = generateMockFrames();

// --- CUSTOM INTERACTIVE TOOLTIP ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const prob = payload[0].value;
    const isFake = prob >= 0.5;
    
    return (
      <div style={{
        background: 'rgba(10, 15, 28, 0.95)',
        border: `1px solid ${isFake ? 'var(--danger)' : 'var(--success)'}`,
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)'
      }}>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0', fontSize: '0.85rem', fontFamily: 'monospace' }}>
          Frame Sequence: {label}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            color: isFake ? 'var(--danger)' : 'var(--success)', 
            fontWeight: '800', 
            fontSize: '1.1rem' 
          }}>
            {isFake ? '⚠️ FAKE' : '✅ REAL'}
          </span>
          <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
            ({(prob * 100).toFixed(1)}% Confidence)
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// --- THE MODAL COMPONENT ---
function TelemetryModal({ isOpen, onClose, frameData }) {
  if (!isOpen) return null;

  // Use real backend data if available, otherwise fall back to mock
  const chartData = (frameData && frameData.length > 0) ? frameData : mockFrameData;
  const isRealData = frameData && frameData.length > 0;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Confidence Heartbeat Analysis</h3>
            <p style={styles.subtitle}>
              {isRealData
                ? `Frame-by-frame ViT structural verification · ${chartData.length} samples`
                : "Frame-by-frame ViT structural verification (demo data)"}
            </p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={24} color="var(--text-muted)" />
          </button>
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              
              {/* This creates the dual-color effect based on the 0.5 threshold! */}
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="50%" stopColor="var(--danger)" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="var(--success)" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              {/* Faint background grid */}
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              
              <XAxis
                dataKey="frame"
                stroke="var(--text-muted)"
                tick={{fill: 'var(--text-muted)', fontSize: 12}}
                tickMargin={10}
                label={{ value: isRealData ? 'Time (s)' : 'Frame', position: 'insideBottomRight', offset: -10, fill: 'var(--text-muted)', fontSize: 11 }}
                tickFormatter={(val) => isRealData ? `${val}s` : val}
              />
              <YAxis 
                domain={[0, 1]} 
                stroke="var(--text-muted)" 
                tick={{fill: 'var(--text-muted)', fontSize: 12}}
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* The 0.5 Decision Threshold Line */}
              <ReferenceLine y={0.5} stroke="var(--text-main)" strokeDasharray="5 5" strokeWidth={2} opacity={0.5}>
              </ReferenceLine>

              <Area 
                type="monotone" 
                dataKey="probability" 
                stroke="#fff" 
                strokeWidth={2}
                fill="url(#splitColor)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--text-main)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  modal: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '900px', height: '600px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' },
  subtitle: { margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace' },
  closeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' },
  chartContainer: { flex: 1, padding: '30px 40px 40px 20px' }
};

export default TelemetryModal;