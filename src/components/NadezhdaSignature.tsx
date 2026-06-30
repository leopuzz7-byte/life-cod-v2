import { Sparkles } from "lucide-react";

export function NadezhdaSignature() {
  return (
    <div className="mt-8 mb-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border/40" />
        <Sparkles className="w-4 h-4 text-primary/40" />
        <div className="flex-1 h-px bg-border/40" />
      </div>

      <div className="gradient-card rounded-2xl p-5 sm:p-6 border border-primary/10 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed text-center font-medium">
          Благодарю вас за доверие.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Помните, что нумерология не лишает человека свободы выбора. Она помогает увидеть
          направление, понять свои сильные стороны, заранее заметить возможные трудности
          и использовать благоприятные периоды максимально эффективно.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Каждый день, месяц и год открывают перед вами новые возможности. И именно ваши
          решения определяют, насколько полно вы сможете раскрыть свой потенциал.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Пусть этот прогноз станет для вас не просто описанием событий, а надёжным
          помощником — поможет лучше понять себя, использовать сильные энергии периода
          и пройти жизненные уроки с уверенностью и внутренним спокойствием.
        </p>

        <div className="pt-3 border-t border-border/30 text-center">
          <p className="text-sm text-foreground leading-relaxed">
            Искренне желаю вам здоровья, гармонии, финансового благополучия,
            счастливых отношений и исполнения самых важных желаний.
          </p>
          <div className="mt-4 space-y-0.5">
            <p className="text-xs text-muted-foreground italic">С уважением и наилучшими пожеланиями,</p>
            <p className="text-lg font-display font-semibold text-primary">Надежда Ковалева Серина</p>
            <p className="text-xs text-muted-foreground tracking-wide uppercase">консультант Life Code</p>
          </div>
        </div>
      </div>
    </div>
  );
}
