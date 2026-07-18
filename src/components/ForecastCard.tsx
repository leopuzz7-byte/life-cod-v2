import { getArcana } from "@/lib/arcana";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

function getArcanaImage(n: number): string {
  return `/arcana/arcana-${n}.webp`;
}

function ArcanaModal({ value, onClose }: { value: number; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full sm:w-auto flex flex-col items-center pb-6 pt-4 sm:pb-0" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white">
          <X className="w-5 h-5" />
        </button>
        <img src={getArcanaImage(value)} alt={`Аркан ${value}`} draggable={false}
          className="rounded-2xl shadow-2xl object-contain max-h-[78vh] w-auto sm:max-h-[80vh] sm:h-[520px]" />
      </div>
    </div>,
    document.body
  );
}

interface ForecastCardProps {
  position?: number;
  value: number;
  positionTitle?: string;
  contextText?: string;
  loading?: boolean;
  highlight?: boolean;
  tip?: string;
}

export function ForecastCard({ position, value, positionTitle, contextText, loading = false, highlight = false, tip }: ForecastCardProps) {
  const arcana = getArcana(value);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = useCallback(() => setModalOpen(false), []);
  if (!arcana) return null;

  return (
    <div className={cn("gradient-card rounded-2xl overflow-hidden", highlight ? "border border-primary/40" : "border border-border")}>
      <div className="flex items-start gap-4 p-4">
        <button
          className="relative w-[50px] h-[75px] rounded-xl overflow-hidden shrink-0 ring-1 ring-border/60 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setModalOpen(true)}
          aria-label={`Открыть аркан ${value}`}
        >
          <img src={getArcanaImage(value)} alt={`Аркан ${value}`} className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[2px]">
            <span className="text-[9px] font-bold leading-none text-white/90">{value}</span>
          </div>
        </button>
        <div className="flex-1 min-w-0 py-0.5">
          {position !== undefined ? (
            // Day forecast: theme title is the hero, arcana name is secondary
            <>
              <div className="text-[9px] uppercase tracking-widest font-medium text-muted-foreground/50 mb-0.5">
                Поз. {position}
              </div>
              {positionTitle && (
                <div className={cn("font-display font-bold text-xl leading-tight mb-1", highlight ? "text-primary" : "text-foreground")}>
                  {positionTitle}
                </div>
              )}
              <div className="text-sm font-medium text-muted-foreground">{arcana.name}</div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">{arcana.planet} · {arcana.element}</div>
            </>
          ) : (
            // Month / year / other: arcana name is the hero
            <>
              {positionTitle && (
                <div className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">
                  {positionTitle}
                </div>
              )}
              <div className={cn("font-display font-bold text-xl leading-tight", highlight ? "text-primary" : "text-foreground")}>
                {arcana.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{arcana.planet} · {arcana.element}</div>
            </>
          )}
        </div>
      </div>
      <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3 min-h-[56px]">
        {(loading && !contextText) ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-muted/40 rounded w-full" />
            <div className="h-3 bg-muted/40 rounded w-11/12" />
            <div className="h-3 bg-muted/40 rounded w-4/5" />
          </div>
        ) : (contextText || arcana.personalDescription)}
      </div>
      {tip && (
        <div className="mx-4 mb-3 bg-primary/10 rounded-xl px-3 py-2">
          <p className="text-xs text-primary font-medium">{tip}</p>
        </div>
      )}
      <div className="px-4 pb-4">
        <button onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{expanded ? 'Скрыть' : 'Энергия аркана'}</span>
        </button>
        {expanded && (
          <div className="mt-2 rounded-xl p-3 text-sm text-muted-foreground leading-relaxed bg-muted/25">
            {arcana.personalDescription}
          </div>
        )}
      </div>
      {modalOpen && <ArcanaModal value={value} onClose={handleClose} />}
    </div>
  );
}

export function ForecastMiniCard({ value, posNum, label, highlight = false }: { value: number; posNum?: number; label?: string; highlight?: boolean }) {
  const arcana = getArcana(value);
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = useCallback(() => setModalOpen(false), []);
  return (
    <>
      <button
        className="flex flex-col items-center gap-1 group"
        onClick={() => setModalOpen(true)}
        title={arcana?.name}
      >
        <div className={cn("relative w-12 h-[72px] md:w-14 md:h-[84px] rounded-xl overflow-hidden group-hover:scale-105 transition-transform", highlight ? "ring-2 ring-primary shadow-[0_0_6px_2px] shadow-primary/25" : "ring-1 ring-border/60")}>
          <img src={getArcanaImage(value)} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[2px]">
            <span className="text-[9px] font-bold leading-none text-white/90">{value}</span>
          </div>
          {posNum !== undefined && (
            <div className="absolute top-[3px] right-[3px] w-4 h-4 rounded-full bg-black/50 flex items-center justify-center text-[8px] font-bold text-white/80">{posNum}</div>
          )}
        </div>
        {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
        {arcana && <span className="text-[9px] text-muted-foreground/60 -mt-0.5 max-w-[56px] truncate">{arcana.name}</span>}
      </button>
      {modalOpen && <ArcanaModal value={value} onClose={handleClose} />}
    </>
  );
}
