import { useRef, useEffect, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  style?: React.CSSProperties;
}

export default function DragCarousel({ children, speed = 0.55, style }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(0);
  const hoveredRef  = useRef(false);
  const draggingRef = useRef(false);
  const dragStart   = useRef({ x: 0, pos: 0 });
  const rafRef   = useRef<number>();

  const oneSet = useCallback(() => {
    const el = trackRef.current;
    return el ? el.scrollWidth / 3 : 0;
  }, []);

  const setPos = useCallback((raw: number) => {
    const os = oneSet();
    if (!os) return;
    let p = raw % os;
    if (p > 0) p -= os;
    posRef.current = p;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${p}px)`;
  }, [oneSet]);

  const tick = useCallback(() => {
    if (!hoveredRef.current && !draggingRef.current) {
      setPos(posRef.current - speed);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [speed, setPos]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  /* ── Mouse ────────────────────────────────────────── */
  const onMouseEnter = () => { hoveredRef.current = true; };
  const onMouseLeave = () => { hoveredRef.current = false; draggingRef.current = false; if (outerRef.current) outerRef.current.style.cursor = 'grab'; };
  const onMouseDown  = (e: React.MouseEvent) => {
    draggingRef.current = true;
    dragStart.current = { x: e.clientX, pos: posRef.current };
    if (outerRef.current) outerRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove  = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    setPos(dragStart.current.pos + (e.clientX - dragStart.current.x));
  };
  const onMouseUp    = () => { draggingRef.current = false; if (outerRef.current) outerRef.current.style.cursor = 'grab'; };

  /* ── Touch ────────────────────────────────────────── */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchIsH    = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchIsH.current = false;
    dragStart.current = { x: e.touches[0].clientX, pos: posRef.current };
    draggingRef.current = true;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!touchIsH.current && Math.abs(dx) < Math.abs(dy)) { draggingRef.current = false; return; }
    touchIsH.current = true;
    e.preventDefault();
    setPos(dragStart.current.pos + (e.touches[0].clientX - dragStart.current.x));
  };
  const onTouchEnd = () => { draggingRef.current = false; };

  return (
    <div
      ref={outerRef}
      style={{ overflow: 'hidden', cursor: 'grab', position: 'relative', ...style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', width: 'max-content', willChange: 'transform', userSelect: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}
