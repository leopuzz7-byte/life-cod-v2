import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ProSectionBlockProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
}

export function ProSectionBlock({ icon: Icon, title, children, variant = 'default', className }: ProSectionBlockProps) {
  return (
    <div className={cn(
      "gradient-card rounded-2xl p-6 border",
      variant === 'default' && "border-border",
      variant === 'highlight' && "border-primary/30 bg-primary/5",
      variant === 'warning' && "border-destructive/20 bg-destructive/5",
      variant === 'success' && "border-emerald-500/20 bg-emerald-500/5",
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn(
          "w-5 h-5",
          variant === 'default' && "text-primary",
          variant === 'highlight' && "text-primary",
          variant === 'warning' && "text-destructive",
          variant === 'success' && "text-emerald-600",
        )} />
        <h2 className="text-lg font-display text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface ProTextBlockProps {
  text: string;
  className?: string;
}

export function ProTextBlock({ text, className }: ProTextBlockProps) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed whitespace-pre-line", className)}>{text}</p>;
}

interface ProListBlockProps {
  items: string[];
  icon?: string;
  className?: string;
}

export function ProListBlock({ items, icon = "→", className }: ProListBlockProps) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="text-primary mt-0.5 flex-shrink-0">{icon}</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface ProNumberedListProps {
  items: string[];
  className?: string;
}

export function ProNumberedList({ items, className }: ProNumberedListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{i + 1}</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
