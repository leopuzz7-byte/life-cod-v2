// EN/ES translations for personalForecast.ts.

type MonthD = { name: string; energy: string; risks: string; opportunities: string };
type DayD = { name: string; energy: string };

export type ForecastSet = { months: Record<number, MonthD>; days: Record<number, DayD> };
export type ForecastLabels = {
  ly: string; month: string; day: string; pm: string;
  personalMonth: string; personalDay: string;
};

const EN: ForecastSet = {
  months: {
    1: { name: 'Month of the start', energy: 'New beginnings, initiative', risks: 'Impulsive decisions', opportunities: 'Launching projects, personal decisions' },
    2: { name: 'Month of partnership', energy: 'Diplomacy, cooperation', risks: 'Indecision, dependence', opportunities: 'Negotiations, strengthening connections' },
    3: { name: 'Month of communication', energy: 'Creativity, social activity', risks: 'Scattering, empty chatter', opportunities: 'Networking, presentations, creativity' },
    4: { name: 'Month of work', energy: 'Structure, discipline', risks: 'Overload, rigidity', opportunities: 'Building a foundation, systematizing' },
    5: { name: 'Month of change', energy: 'Movement, experiments', risks: 'Chaos, incompletion', opportunities: 'Travel, new experience, flexibility' },
    6: { name: 'Month of responsibility', energy: 'Care, commitments', risks: 'Burnout, over-control', opportunities: 'Family matters, helping others' },
    7: { name: 'Month of analysis', energy: 'Reflection, introspection', risks: 'Isolation, paranoia', opportunities: 'Learning, research, solitude' },
    8: { name: 'Month of power', energy: 'Management, ambition', risks: 'Pressure, conflicts over resources', opportunities: 'Financial decisions, career growth' },
    9: { name: 'Month of completion', energy: 'Letting go, taking stock', risks: 'Abrupt breakups, losses', opportunities: 'Closing affairs, charity' },
  },
  days: {
    1: { name: 'Day of action', energy: 'Decide, start, take the initiative' },
    2: { name: 'Day of patience', energy: 'Listen, negotiate, be gentler' },
    3: { name: 'Day of communication', energy: 'Talk, write, make contacts' },
    4: { name: 'Day of work', energy: 'Do the routine, build the system' },
    5: { name: 'Day of freedom', energy: 'Experiment, try the new' },
    6: { name: 'Day of care', energy: 'Take care of loved ones and yourself' },
    7: { name: 'Day of silence', energy: "Analyze, don't make decisions" },
    8: { name: 'Day of strength', energy: 'Work with money and resources' },
    9: { name: 'Day of summing up', energy: 'Complete the old, let go' },
  },
};

const ES: ForecastSet = {
  months: {
    1: { name: 'Mes del arranque', energy: 'Nuevos comienzos, iniciativa', risks: 'Decisiones impulsivas', opportunities: 'Lanzar proyectos, decisiones personales' },
    2: { name: 'Mes de la asociación', energy: 'Diplomacia, cooperación', risks: 'Indecisión, dependencia', opportunities: 'Negociaciones, reforzar vínculos' },
    3: { name: 'Mes de la comunicación', energy: 'Creatividad, actividad social', risks: 'Dispersión, charla vacía', opportunities: 'Networking, presentaciones, creatividad' },
    4: { name: 'Mes del trabajo', energy: 'Estructura, disciplina', risks: 'Sobrecarga, rigidez', opportunities: 'Construir cimientos, sistematizar' },
    5: { name: 'Mes de los cambios', energy: 'Movimiento, experimentos', risks: 'Caos, lo inconcluso', opportunities: 'Viajes, experiencias nuevas, flexibilidad' },
    6: { name: 'Mes de la responsabilidad', energy: 'Cuidado, compromisos', risks: 'Agotamiento, hipercontrol', opportunities: 'Asuntos familiares, ayudar a los demás' },
    7: { name: 'Mes del análisis', energy: 'Reflexión, introspección', risks: 'Aislamiento, paranoia', opportunities: 'Aprendizaje, investigación, soledad' },
    8: { name: 'Mes del poder', energy: 'Gestión, ambición', risks: 'Presión, conflictos por recursos', opportunities: 'Decisiones financieras, crecimiento profesional' },
    9: { name: 'Mes del cierre', energy: 'Soltar, balance', risks: 'Rupturas bruscas, pérdidas', opportunities: 'Cerrar asuntos, beneficencia' },
  },
  days: {
    1: { name: 'Día de la acción', energy: 'Decide, empieza, toma la iniciativa' },
    2: { name: 'Día de la paciencia', energy: 'Escucha, negocia, sé más suave' },
    3: { name: 'Día de la comunicación', energy: 'Habla, escribe, crea contactos' },
    4: { name: 'Día del trabajo', energy: 'Haz la rutina, construye el sistema' },
    5: { name: 'Día de la libertad', energy: 'Experimenta, prueba lo nuevo' },
    6: { name: 'Día del cuidado', energy: 'Cuida de los seres queridos y de ti' },
    7: { name: 'Día del silencio', energy: 'Analiza, no tomes decisiones' },
    8: { name: 'Día de la fuerza', energy: 'Trabaja con el dinero y los recursos' },
    9: { name: 'Día del balance', energy: 'Cierra lo viejo, suelta' },
  },
};

export function getForecastSet(lang: string): ForecastSet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
export function getForecastLabels(lang: string): ForecastLabels {
  if (lang === 'en') return { ly: 'PY', month: 'Month', day: 'Day', pm: 'PM', personalMonth: 'Personal month', personalDay: 'Personal day' };
  if (lang === 'es') return { ly: 'AP', month: 'Mes', day: 'Día', pm: 'MP', personalMonth: 'Mes personal', personalDay: 'Día personal' };
  return { ly: 'LY', month: 'Месяц', day: 'День', pm: 'PM', personalMonth: 'Личный месяц', personalDay: 'Личный день' };
}
