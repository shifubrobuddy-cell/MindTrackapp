import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface CustomCursorProps {
  enabled?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Precision springs for responsive follower
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 32, stiffness: 400, mass: 0.3 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    if (!enabled) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.onclick !== null ||
          target.getAttribute('role') === 'button' ||
          target.closest('button') !== null ||
          target.closest('a') !== null;

        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT';

        setIsHovered(!!isClickable);
        setIsInputHovered(!!isInput);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [enabled, isVisible, cursorX, cursorY]);

  if (!enabled || !isVisible || isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Sleek Follower Ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full border border-indigo-400/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(129,140,248,0.3)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isInputHovered ? 16 : isHovered ? 40 : isClicking ? 20 : 28,
          height: isInputHovered ? 28 : isHovered ? 40 : isClicking ? 20 : 28,
          borderRadius: isInputHovered ? '4px' : '9999px',
          borderColor: isHovered
            ? 'rgba(45, 212, 191, 0.8)'
            : 'rgba(129, 140, 248, 0.4)',
          backgroundColor: isHovered
            ? 'rgba(45, 212, 191, 0.15)'
            : 'rgba(129, 140, 248, 0.08)',
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />

      {/* Center Precision Pointer Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.9)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 6 : isClicking ? 10 : 5,
          height: isHovered ? 6 : isClicking ? 10 : 5,
          opacity: isInputHovered ? 0.2 : 1,
        }}
        transition={{ duration: 0.08 }}
      />
    </div>
  );
};
