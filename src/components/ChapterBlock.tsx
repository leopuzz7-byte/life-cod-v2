import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ChapterBlockProps {
  num?: number;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
}

// Крупная красивая глава с нумерованным бейджем и заголовком.
export function ChapterBlock({ num, icon: Icon, title, subtitle, children, variant = 'default', className }: ChapterBlockProps) {
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
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          variant === 'warning' ? "bg-destructive/10" : variant === 'success' ? "bg-emerald-500/10" : "bg-primary/10"
        )}>
          {num !== undefined ? (
            <span className={cn(
              "font-display font-bold text-lg",
              variant === 'warning' ? "text-destructive" : variant === 'success' ? "text-emerald-600" : "text-primary"
            )}>{num}</span>
          ) : Icon ? (
            <Icon className={cn(
              "w-5 h-5",
              variant === 'warning' ? "text-destructive" : variant === 'success' ? "text-emerald-600" : "text-primary"
            )} />
          ) : null}
        </div>
        <div className="min-w-0 pt-0.5">
          <h2 className="font-display font-bold text-xl md:text-2xl text-foreground leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {children}
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
