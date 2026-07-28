// Общая матрица предназначения. Та же раскладка и те же карточки,
// что используются в остальных разборах сайта.
// Модалка карты рендерится через портал, чтобы её не ломали
// родители с backdrop-filter / transform.
import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function getArcanaImage(n: number): string {
  return `/arcana/arcana-${n}.webp`;
}

function ArcanaModal({ value, onClose }: { value: number; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  const a = getArcana(value);
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full sm:w-auto flex flex-col items-center pb-6 pt-4 sm:pb-0 sm:pt-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 transition-colors flex items-center justify-center text-white shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={getArcanaImage(value)}
          alt={`Аркан ${value}`}
          draggable={false}
          className="rounded-2xl shadow-2xl object-contain max-h-[78vh] w-auto sm:max-h-[80vh] sm:h-[520px]"
        />
        {a && (
          <div className="mt-3 text-center text-white/90 text-sm font-display">
            {value} {a.name} · {a.planet} · {a.element}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export function MatrixCell({ position, value, isHighlight = false }: { position: number; value: number; isHighlight?: boolean }) {
  const imgSrc = getArcanaImage(value);
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = useCallback(() => setModalOpen(false), []);
  return (
    <>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer",
          "w-12 h-[72px] md:w-14 md:h-[84px]",
          isHighlight ? "ring-2 ring-primary shadow-[0_0_8px_2px] shadow-primary/30" : "ring-1 ring-border/60"
        )}
        onClick={() => setModalOpen(true)}
      >
        <img src={imgSrc} alt={`Аркан ${value}`} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center py-[2px]">
          <span className={cn("text-[10px] font-bold leading-none", isHighlight ? "text-primary-foreground" : "text-white/90")}>
            {value}
          </span>
        </div>
        <div className={cn(
          "absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold leading-none",
          isHighlight ? "bg-primary text-primary-foreground" : "bg-black/50 text-white/80"
        )}>
          {position}
        </div>
      </div>
      {modalOpen && <ArcanaModal value={value} onClose={handleClose} />}
    </>
  );
}

export function MatrixGrid({ matrix, accentPos2 = false }: { matrix: PersonalMatrix; accentPos2?: boolean }) {
  const p = matrix.positions;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 md:gap-3">
        <MatrixCell position={10} value={p[9]} />
        <MatrixCell position={11} value={p[10]} />
        <MatrixCell position={12} value={p[11]} isHighlight />
      </div>
      <div className="w-full h-px bg-border/40 my-0.5" />
      <div className="flex flex-col items-start gap-2 md:gap-3">
        <div className="flex gap-2 md:gap-3">
          <MatrixCell position={1} value={p[0]} />
          <MatrixCell position={2} value={p[1]} isHighlight={accentPos2} />
          <MatrixCell position={4} value={p[3]} />
        </div>
        <div className="flex gap-2 md:gap-3 ml-[28px] md:ml-[34px]">
          <MatrixCell position={3} value={p[2]} />
          <MatrixCell position={5} value={p[4]} />
        </div>
        <div className="ml-[56px] md:ml-[68px]">
          <MatrixCell position={6} value={p[5]} />
        </div>
      </div>
      <div className="w-full h-px bg-border/40 my-0.5" />
      <div className="flex gap-2 md:gap-3">
        <MatrixCell position={7} value={p[6]} />
        <MatrixCell position={8} value={p[7]} />
        <MatrixCell position={9} value={p[8]} />
      </div>
    </div>
  );
}
