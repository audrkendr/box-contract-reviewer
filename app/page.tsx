// app/page.tsx
'use client';

import { useState } from 'react';
import type { ContractReview } from '@/lib/reviewer';

// Box Design System Tokens
const COLORS = {
  boxBlue: '#0061E0',
  boxBlueHover: '#0051C2',
  textDark: '#1E293B',
  textMuted: '#64748B',
  bgLight: '#F8FAFC',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  white: '#FFFFFF',
};

export default function Home() {
  const [fileId, setFileId] = useState('2242235754258');
  const [review, setReview] = useState<ContractReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReview() {
    if (!fileId.trim()) return;

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }

      setReview(data.review);
    } catch (err) {
      setError('Failed to reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: COLORS.bgLight, minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: COLORS.textDark }}>
      {/* Box-Inspired Top Bar Header */}
      <header style={{ backgroundColor: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mock Box Logo Element */}
          <div style={{ backgroundColor: COLORS.boxBlue, color: COLORS.white, fontWeight: 'bold', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
            box
          </div>
          <span style={{ color: COLORS.textMuted, fontSize: '1.2rem', fontWeight: 300 }}>|</span>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>AI Contract Reviewer</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 840, margin: '2rem auto', padding: '0 1.5rem' }}>
        
        {/* Input Card Container */}
        <div style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Analyze Document</h2>
          <p style={{ color: COLORS.textMuted, fontSize: '0.9rem', margin: '0 0 1.5rem 0', lineHeight: '1.4' }}>
            Paste a unique Box file ID below to trigger real-time AI compliance extraction and risk categorization.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Box file ID e.g. 123456789"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                fontSize: '0.95rem',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: COLORS.bgLight,
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.boxBlue}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
            <button
              onClick={handleReview}
              disabled={loading || !fileId.trim()}
              style={{
                padding: '0.65rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: COLORS.white,
                backgroundColor: loading || !fileId.trim() ? '#93C5FD' : COLORS.boxBlue,
                border: 'none',
                borderRadius: '6px',
                cursor: loading || !fileId.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Analyzing Content...' : 'Review File'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: COLORS.dangerBg, color: COLORS.danger, borderRadius: '6px', fontSize: '0.9rem', border: `1px solid ${COLORS.danger}20` }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Stream */}
        {review && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Executive Summary Section */}
            <section style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.textDark, margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                Executive Summary
              </h3>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6', color: COLORS.textDark }}>
                {review.summary}
              </p>
            </section>

            {/* Red Flags Summary Panel (If Any) */}
            {review.redFlags.length > 0 && (
              <section style={{ backgroundColor: COLORS.dangerBg, border: `1px solid ${COLORS.danger}30`, borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.danger, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span></span> Red Flags Detected
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: COLORS.textDark, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {review.redFlags.map((flag, i) => (
                    <li key={i} style={{ lineHeight: '1.4' }}>{flag}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Clauses Breakdown Grid */}
            <section>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.textMuted, marginBottom: '1rem' }}>
                Analyzed Clauses ({review.clauses.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {review.clauses.map((clause, i) => {
                  const currentRiskColor = riskColor(clause.risk);
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: COLORS.white,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        padding: '1.25rem',
                        borderLeft: `4px solid ${currentRiskColor}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <strong style={{ fontSize: '1.05rem', fontWeight: 600 }}>{clause.name}</strong>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: currentRiskColor,
                            backgroundColor: `${currentRiskColor}12`,
                            padding: '0.25rem 0.6rem',
                            borderRadius: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {clause.risk} risk
                        </span>
                      </div>
                      
                      {/* Original text blockquote format */}
                      <div style={{ backgroundColor: COLORS.bgLight, padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: `2px solid ${COLORS.border}`, fontSize: '0.9rem', color: COLORS.textMuted, marginBottom: '0.75rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                        "{clause.text}"
                      </div>
                      
                      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: COLORS.textDark }}>
                        {clause.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Missing Clauses Panel */}
            {review.missing.length > 0 && (
              <section style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORS.textMuted, margin: '0 0 1rem 0' }}>
                  Omissions &amp; Missing Items
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
                  {review.missing.map((item, i) => (
                    <li key={i} style={{ color: COLORS.textDark }}>
                      <span style={{ color: COLORS.warning, fontWeight: 'bold', marginRight: '0.25rem' }}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            
          </div>
        )}
      </main>
    </div>
  );
}

function riskColor(risk: 'low' | 'medium' | 'high'): string {
  if (risk === 'high') return COLORS.danger;
  if (risk === 'medium') return COLORS.warning;
  return COLORS.success;
}