import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { LucideIcon, X } from "lucide-react";
import { getArcana } from "@/lib/arcana";

interface ChapterBlockProps {
  num?: number;
  icon?: LucideIcon;
  arcana?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
}

function ArcanaModal({ value, onClose }: { value: number; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center pb-6 pt-4 sm:pb-0 sm:pt-0" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white shadow-lg">
          <X className="w-5 h-5" />
        </button>
        <img src={`/arcana/arcana-${value}.webp`} alt={`Аркан ${value}`} draggable={false} className="rounded-2xl shadow-2xl object-contain max-h-[78vh] w-auto sm:max-h-[80vh] sm:h-[520px]" />
      </div>
    </div>,
    document.body
  );
}

// Крупная глава. Слева: кликабельная карта аркана (arcana), номер (num) или иконка (icon).
export function ChapterBlock({ num, icon: Icon, arcana, title, subtitle, children, variant = 'default', className }: ChapterBlockProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const arc = arcana !== undefined ? getArcana(arcana) : null;
  const accent = variant === 'warning' ? "text-destructive" : variant === 'success' ? "text-emerald-600" : "text-primary";
  const badgeBg = variant === 'warning' ? "bg-destructive/10" : variant === 'success' ? "bg-emerald-500/10" : "bg-primary/10";

  return (
    <section className={cn(
      "gradient-card rounded-2xl border p-6 md:p-7",
      variant === 'default' && "border-border",
      variant === 'highlight' && "border-primary/30 bg-primary/5",
      variant === 'warning' && "border-destructive/20 bg-destructive/5",
      variant === 'success' && "border-emerald-500/20 bg-emerald-500/5",
      className
    )}>
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-border/50">
        {arcana !== undefined ? (
          <button
            onClick={() => setModalOpen(true)}
            className="relative w-11 h-[62px] rounded-lg overflow-hidden shrink-0 ring-1 ring-border/60 hover:scale-105 transition-transform"
            aria-label={`Открыть аркан ${arcana}`}
          >
            <img src={`/arcana/arcana-${arcana}.webp`} alt="" className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
              <span className="text-[9px] font-bold text-white/90">{arcana}</span>
            </div>
          </button>
        ) : (num !== undefined || Icon) ? (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", badgeBg)}>
            {num !== undefined ? (
              <span className={cn("font-display font-bold text-lg", accent)}>{num}</span>
            ) : Icon ? (
              <Icon className={cn("w-5 h-5", accent)} />
            ) : null}
          </div>
        ) : null}
        <div className="min-w-0 pt-0.5">
          <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-tight">{title}</h2>
          {arc && <p className="text-sm text-muted-foreground mt-1">{arcana} {arc.name} · {arc.planet} · {arc.element}</p>}
          {subtitle && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {children}
      {arcana !== undefined && modalOpen && <ArcanaModal value={arcana} onClose={() => setModalOpen(false)} />}
    </section>
  );
}

// Скелетон текста для состояния загрузки.
export function ChapterSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn("h-3 rounded bg-muted/40", i === lines - 1 ? "w-3/4" : "w-full")} />
      ))}
    </div>
  );
}
