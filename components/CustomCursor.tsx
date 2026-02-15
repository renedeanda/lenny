'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, select, textarea';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // default true to avoid flash

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Inner dot trails slightly behind for a subtle effect
  const springConfig = { damping: 30, stiffness: 200 };
  const dotXSpring = useSpring(cursorX, springConfig);
  const dotYSpring = useSpring(cursorY, springConfig);

  // Detect touch devices and small screens — hide the custom cursor
  useEffect(() => {
    const isTouchOrSmall =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.innerWidth < 768;
    setIsTouchDevice(isTouchOrSmall);
  }, []);

  // Stable references for window-level event listeners
  const handleWindowEnter = useCallback(() => setIsVisible(true), []);
  const handleWindowLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    // Use event delegation for hover detection instead of per-element listeners.
    // This avoids the MutationObserver thrashing and memory leak from re-binding
    // listeners on every DOM change.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target?.closest?.(INTERACTIVE_SELECTOR)) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', handleWindowEnter);
    window.addEventListener('mouseleave', handleWindowLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseenter', handleWindowEnter);
      window.removeEventListener('mouseleave', handleWindowLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, isTouchDevice, handleWindowEnter, handleWindowLeave]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Main cursor ring - tracks 1:1 with mouse, no lag */}
      <motion.div
        className="fixed w-8 h-8 border-2 border-amber/50 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ scale: { duration: 0.15 } }}
      />

      {/* Inner dot - trails slightly for visual flair */}
      <motion.div
        className="fixed w-2 h-2 bg-amber rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: dotXSpring,
          top: dotYSpring,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ opacity: { duration: 0.15 } }}
      />
    </>
  );
}
