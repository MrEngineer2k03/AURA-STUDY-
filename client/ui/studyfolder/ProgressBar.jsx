import { useState, useEffect } from 'react';

/**
 * ProgressBar - Reusable futuristic RPG progress bar with glow & smooth animation
 *
 * @param {Object} props
 * @param {number} [props.value=0] - Percentage from 0 to 100
 * @param {string} [props.color='red'] - Color key ('red', 'blue', 'purple', 'green', 'gold', 'cyan') or hex
 * @param {number|string} [props.height=5] - Track height in px
 * @param {boolean} [props.animated=true] - Whether to animate on mount
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function ProgressBar({
  value = 0,
  color = 'red',
  height = 5,
  animated = true,
  className = '',
}) {
  const [mounted, setMounted] = useState(!animated);

  useEffect(() => {
    if (!animated) return;
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [animated]);

  // Color mapping configuration
  const colorMap = {
    red: {
      fill: 'linear-gradient(90deg, #ef4444 0%, #ff2a44 100%)',
      glow: 'rgba(255, 42, 68, 0.55)',
    },
    blue: {
      fill: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
      glow: 'rgba(59, 130, 246, 0.55)',
    },
    purple: {
      fill: 'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
      glow: 'rgba(168, 85, 247, 0.55)',
    },
    green: {
      fill: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
      glow: 'rgba(16, 185, 129, 0.55)',
    },
    gold: {
      fill: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
      glow: 'rgba(245, 158, 11, 0.55)',
    },
    cyan: {
      fill: 'linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%)',
      glow: 'rgba(6, 182, 212, 0.55)',
    },
  };

  const currentTheme = colorMap[color] || {
    fill: color,
    glow: 'rgba(255, 42, 68, 0.4)',
  };

  const clampedValue = Math.min(Math.max(value, 0), 100);
  const currentWidth = mounted ? clampedValue : 0;

  return (
    <div
      className={`study-progress-track ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="study-progress-fill"
        style={{
          width: `${currentWidth}%`,
          background: currentTheme.fill,
          boxShadow: currentWidth > 0 ? `0 0 10px ${currentTheme.glow}` : 'none',
        }}
      />
    </div>
  );
}
