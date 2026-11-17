import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useAuraTransition
 * High-performance, anti-flicker page navigation transition hook.
 * Replicates the ~440ms cubic ease-out sequence from AURA Loading Animation.
 */
export function useAuraTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState('HOME');
  const [progress, setProgress] = useState(0);

  const rafRef = useRef(null);
  const watchdogRef = useRef(null);
  const exitTimerRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const cancelTimers = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
  }, []);

  const triggerTransition = useCallback(
    (targetTab, subRouteKey, onApply) => {
      cancelTimers();

      const displayTarget = subRouteKey || targetTab || 'HOME';
      setTransitionTarget(displayTarget);
      setIsTransitioning(true);
      isTransitioningRef.current = true;
      setProgress(0);

      // Snappy ~420ms duration (respects prefers-reduced-motion)
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const durationMs = prefersReduced ? 180 : 420;

      const startTime = performance.now();
      let applied = false;

      // Watchdog failsafe: guarantees overlay never traps the user
      watchdogRef.current = setTimeout(() => {
        if (isTransitioningRef.current) {
          if (!applied && onApply) {
            onApply();
            applied = true;
          }
          setProgress(100);
          setIsTransitioning(false);
          isTransitioningRef.current = false;
        }
      }, durationMs + 400);

      const tick = (now) => {
        const elapsed = now - startTime;
        const ratio = Math.min(1, elapsed / durationMs);

        // Smooth cubic ease-out
        const eased = 1 - Math.pow(1 - ratio, 3);
        setProgress(Math.round(eased * 100));

        // Swap the active underlying view at ~58% progress while overlay is fully opaque
        if (ratio >= 0.58 && !applied) {
          applied = true;
          if (onApply) onApply();
        }

        if (ratio < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setProgress(100);
          if (!applied && onApply) {
            applied = true;
            onApply();
          }
          exitTimerRef.current = setTimeout(() => {
            setIsTransitioning(false);
            isTransitioningRef.current = false;
          }, 60);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelTimers]
  );

  useEffect(() => {
    return () => cancelTimers();
  }, [cancelTimers]);

  return {
    isTransitioning,
    transitionTarget,
    progress,
    triggerTransition,
  };
}
