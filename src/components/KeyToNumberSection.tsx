// KEYTO (методика 2) — секция одного числа: бейдж «X из Y», название, описание + доп-контент.
interface Props {
  id: string;
  title: string;      // Число Ума / Действия / ...
  value: number;      // сведённое число (5)
  full?: number;      // полное число (23) для «из»; если нет, показываем только число
  name?: string;      // архетип (Прагматик и т.п.)
  description: string;
  children?: React.ReactNode;
}

export function KeyToNumberSection({ id, title, value, full, name, description, children }: Props) {
  return (
    <section id={id} className="gradient-card rounded-2xl border border-border p-6 md:p-7 scroll-mt-24">
      <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5 mb-5 text-center">
        <div className="flex items-start justify-center gap-1.5">
          <span className="text-4xl md:text-5xl font-display font-bold text-primary leading-none">{value}</span>
          {full !== undefined && full !== value && (
            <span className="text-[11px] text-muted-foreground leading-tight mt-1">из<br />{full}</span>
          )}
        </div>
        <div className="font-display font-semibold text-foreground mt-2">{title}</div>
        {name && <div className="text-sm text-muted-foreground mt-0.5">{name}</div>}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
      {children && <div className="mt-5 space-y-5">{children}</div>}
    </section>
  );
}
