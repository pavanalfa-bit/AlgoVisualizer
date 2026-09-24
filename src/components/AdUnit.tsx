import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export function AdUnit({ format = 'rectangle', className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);

  // This is a placeholder for where you would initialize the ad script.
  // For example, if using Google AdSense:
  // useEffect(() => {
  //   try {
  //     (window.adsbygoogle = window.adsbygoogle || []).push({});
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, []);

  const styles: Record<string, React.CSSProperties> = {
    horizontal: { width: '100%', height: '90px' },
    vertical: { width: '160px', height: '600px' },
    rectangle: { width: '100%', minHeight: '250px' }
  };

  return (
    <div 
      className={`ad-container ${className}`} 
      style={{
        ...styles[format],
        background: 'var(--surface2)',
        border: '1px dashed var(--border)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        fontSize: '0.85rem',
        overflow: 'hidden',
        position: 'relative',
        marginTop: '24px',
        marginBottom: '24px'
      }}
    >
      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', position: 'absolute', top: 8, right: 8, background: 'var(--surface)', padding: '2px 6px', borderRadius: '4px', color: 'var(--muted)' }}>
        Advertisement
      </span>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🚀</div>
        <div style={{ fontWeight: 600, color: 'var(--text)' }}>Your Ad Here</div>
        <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Support AlgoVisualizer</div>
      </div>
      
      {/* 
        Uncomment this when ready to insert real Google AdSense:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      */}
    </div>
  );
}
