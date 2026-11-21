import { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const INTERACTIVE = 'a, button, .project, .chip-btn, .filter-btn, summary, label';

/* A small gold dot with a trailing ring. Desktop, fine-pointer and motion-safe only. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    document.body.classList.add('has-custom-cursor');
    if (!dot || !ring) return () => document.body.classList.remove('has-custom-cursor');

    let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0;

    const render = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.5 ? requestAnimationFrame(render) : 0;
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
      if (!raf) {
        rx = tx;
        ry = ty;
        raf = requestAnimationFrame(render);
      }
    };
    const onOver = (e) => {
      const hit = e.target instanceof Element && e.target.closest(INTERACTIVE);
      dot.classList.toggle('is-hover', Boolean(hit));
      ring.classList.toggle('is-hover', Boolean(hit));
    };
    const onLeave = () => {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      cancelAnimationFrame(raf);
      dot.classList.remove('is-visible', 'is-hover');
      ring.classList.remove('is-visible', 'is-hover');
      document.body.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
