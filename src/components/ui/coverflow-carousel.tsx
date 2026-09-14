"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/class-name";

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides, rotate = 44, depth = 0.6, perspective = 3, falloff = 0.56,
  fade = 0.1, cardWidth = "clamp(148px, 22vw, 260px)", gap = 0.05,
  loop = true, showCaption = false, showPagination = false,
  showNavigation = false, label = "Galeria de fotos", className, cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;
  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{ id: number; x: number; pos: number; v: number; t: number } | null>(null);
  const [selected, setSelected] = React.useState(0);

  const indexAt = React.useCallback((pos: number) => count ? ((Math.round(pos) % count) + count) % count : 0, [count]);

  // Fractional position is painted directly, without rerendering every frame.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || !count) return;
    const pitch = width * (1 + gap);
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let offset = index - posRef.current;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      const edge = loop && count > 1 ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback((target: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    targetRef.current = target;
    setSelected(indexAt(target));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = () => {
      const remaining = target - posRef.current;
      if (reducedMotion || Math.abs(remaining) < 0.0004) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }
      posRef.current += remaining * 0.16;
      paint();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [indexAt, paint]);

  const clamp = React.useCallback((pos: number) => loop && count > 1 ? pos : Math.max(0, Math.min(count - 1, pos)), [count, loop]);
  const goTo = React.useCallback((index: number) => {
    const target = loop && count > 1 ? index + Math.round((targetRef.current - index) / count) * count : index;
    settle(clamp(target));
  }, [clamp, count, loop, settle]);
  const nudge = React.useCallback((by: number) => settle(clamp(Math.round(targetRef.current) + by)), [clamp, settle]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || count < 2) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = { id: event.pointerId, x: event.clientX, pos: posRef.current, v: 0, t: performance.now() };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;
    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;
    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = event.type === "pointerup" && performance.now() - drag.t < 100 ? Math.max(-2, Math.min(2, drag.v * 0.18)) : 0;
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    if (cardRefs.current[0]) observer.observe(cardRefs.current[0]);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  const active = slides[indexAt(selected)];
  if (!count) return null;

  return (
    <div className={cn("w-full", className)} style={{ ["--cf-card" as string]: cardWidth }} role="region" aria-roledescription="carrossel" aria-label={label}>
      <div className="relative">
        <div ref={frameRef} tabIndex={0} aria-label="Use as setas para navegar pelas fotos" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              nudge(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing"
          style={{ perspective: `calc(var(--cf-card) * ${perspective})`, touchAction: "pan-y" }}>
          <div className="relative select-none" style={{ height: "var(--cf-card)", transformStyle: "preserve-3d" }}>
            {slides.map((slide, index) => (
              <div key={index} ref={(node) => { cardRefs.current[index] = node; }} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${count}`}
                className={cn("absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-surface-light shadow-xl will-change-transform", cardClassName)} style={{ width: "var(--cf-card)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.src} alt={slide.alt} draggable={false} className="h-full w-full select-none object-cover" />
              </div>
            ))}
          </div>
        </div>
        {showNavigation && count > 1 && (<>
          <button type="button" aria-label="Foto anterior" disabled={!loop && selected === 0} onClick={() => nudge(-1)} className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-ink/70 p-2 text-bone backdrop-blur transition hover:bg-ink focus-visible:outline-gold disabled:opacity-30"><ChevronLeft className="size-5" /></button>
          <button type="button" aria-label="Próxima foto" disabled={!loop && selected === count - 1} onClick={() => nudge(1)} className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-ink/70 p-2 text-bone backdrop-blur transition hover:bg-ink focus-visible:outline-gold disabled:opacity-30"><ChevronRight className="size-5" /></button>
        </>)}
      </div>
      {showCaption && active?.title && (
        <div className="mt-2 flex min-h-24 flex-col items-center px-6 text-center" aria-live="polite" aria-atomic="true">
          <p className="text-[15px] font-semibold tracking-tight text-bone">{active.title}</p>
          {active.subtitle && <p className="mt-1 max-w-md text-[13px] text-bone/60">{active.subtitle}</p>}
          {!!active.meta?.length && <dl className="mt-10 w-full max-w-[230px] text-[12px]">{active.meta.map((row) => <div key={row.label} className="flex justify-between py-[5px]"><dt className="text-muted">{row.label}</dt><dd className="font-medium text-bone">{row.value}</dd></div>)}</dl>}
        </div>
      )}
      {showPagination && count > 1 && <div className="mt-6 flex items-center justify-center gap-1">{slides.map((_, index) => (
        <button key={index} type="button" aria-label={`Ir para foto ${index + 1}`} aria-current={index === selected} onClick={() => goTo(index)} className="flex size-8 items-center justify-center rounded-full focus-visible:outline-gold"><span className={cn("size-2 rounded-full bg-bone transition-opacity", index === selected ? "opacity-100" : "opacity-30")} /></button>
      ))}</div>}
    </div>
  );
}
