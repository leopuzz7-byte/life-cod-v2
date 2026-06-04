// EN/ES translations for actionPlan.ts.

type NS = Record<number, string>;
export type ActionSet = { doNow: NS; strengthen: NS; avoid: NS; unlock: NS; advice: NS };
export type ActionLabels = {
  fallbackDoNow: string; fallbackStrengthen: string; fallbackAvoid: string; fallbackUnlock: string;
  workEnergy: (d: number, advice: string) => string;
  useStrong: (d: number) => string;
  crisisAvoid: string;
};

const EN: ActionSet = {
  doNow: {
    1: 'Start a new project or take the initiative',
    2: 'Find a partner or strengthen existing connections',
    3: 'Make yourself known — record a video, write a post',
    4: 'Put your finances and affairs in order',
    5: 'Try a new approach to an old task',
    6: 'Take responsibility for an important decision',
    7: 'Stop and analyze the situation',
    8: "Make the tough decision you've been putting off",
    9: "Finish what's been dragging on for a long time",
  },
  strengthen: {
    1: 'Strengthen self-discipline and independence',
    2: 'Develop emotional intelligence',
    3: 'Build up your public-speaking skills',
    4: 'Create a system of habits and routines',
    5: 'Develop adaptability and flexibility',
    6: 'Learn to set boundaries in your care for others',
    7: 'Deepen your expertise in your field',
    8: 'Build up your management skills',
    9: 'Develop the ability to let go and complete things',
  },
  avoid: {
    1: 'Avoid isolation and stubbornness',
    2: "Avoid submitting to others' will",
    3: 'Avoid empty promises and chatter',
    4: 'Avoid over-control and rigidity',
    5: 'Avoid chaotic changes without a plan',
    6: 'Avoid self-sacrificing behavior',
    7: 'Avoid total isolation from people',
    8: 'Avoid pressuring those around you',
    9: 'Avoid abrupt breakups of relationships',
  },
  unlock: {
    1: 'Your potential unfolds through leadership — start leading, not waiting',
    2: 'Your potential unfolds through partnership — find your person',
    3: 'Your potential unfolds through the word — start creating content',
    4: 'Your potential unfolds through system — build processes',
    5: "Your potential unfolds through variety — don't be afraid to experiment",
    6: "Your potential unfolds through care — help, but don't sacrifice yourself",
    7: 'Your potential unfolds through knowledge — become an expert',
    8: 'Your potential unfolds through scale — think bigger',
    9: 'Your potential unfolds through letting go — complete the old',
  },
  advice: {
    1: 'learn to make decisions on your own',
    2: 'develop empathy and the ability to listen',
    3: 'start expressing yourself publicly',
    4: 'create structure in your daily life',
    5: 'allow yourself change',
    6: 'learn to care without self-sacrifice',
    7: 'start asking deep questions',
    8: 'put your finances in order',
    9: 'learn to complete cycles',
  },
};

const ES: ActionSet = {
  doNow: {
    1: 'Empieza un nuevo proyecto o toma la iniciativa',
    2: 'Busca un socio o refuerza los vínculos existentes',
    3: 'Date a conocer: graba un vídeo, escribe una publicación',
    4: 'Pon en orden tus finanzas y asuntos',
    5: 'Prueba un nuevo enfoque para una tarea antigua',
    6: 'Asume la responsabilidad de una decisión importante',
    7: 'Detente y analiza la situación',
    8: 'Toma la decisión difícil que has estado aplazando',
    9: 'Cierra lo que se arrastra desde hace tiempo',
  },
  strengthen: {
    1: 'Refuerza la autodisciplina y la independencia',
    2: 'Desarrolla la inteligencia emocional',
    3: 'Mejora tus habilidades de hablar en público',
    4: 'Crea un sistema de hábitos y rutinas',
    5: 'Desarrolla la adaptabilidad y la flexibilidad',
    6: 'Aprende a poner límites en el cuidado',
    7: 'Profundiza tu experiencia en tu campo',
    8: 'Mejora tus habilidades de gestión',
    9: 'Desarrolla la capacidad de soltar y cerrar',
  },
  avoid: {
    1: 'Evita el aislamiento y la terquedad',
    2: 'Evita someterte a la voluntad ajena',
    3: 'Evita las promesas vacías y la cháchara',
    4: 'Evita el hipercontrol y la rigidez',
    5: 'Evita los cambios caóticos sin plan',
    6: 'Evita el comportamiento abnegado',
    7: 'Evita el aislamiento total de la gente',
    8: 'Evita presionar a quienes te rodean',
    9: 'Evita las rupturas bruscas de las relaciones',
  },
  unlock: {
    1: 'Tu potencial se despliega a través del liderazgo: empieza a guiar, no a esperar',
    2: 'Tu potencial se despliega a través de la asociación: encuentra a tu persona',
    3: 'Tu potencial se despliega a través de la palabra: empieza a crear contenido',
    4: 'Tu potencial se despliega a través del sistema: construye procesos',
    5: 'Tu potencial se despliega a través de la variedad: no temas experimentar',
    6: 'Tu potencial se despliega a través del cuidado: ayuda, pero no te sacrifiques',
    7: 'Tu potencial se despliega a través del conocimiento: conviértete en experto',
    8: 'Tu potencial se despliega a través de la escala: piensa en grande',
    9: 'Tu potencial se despliega a través del soltar: cierra lo viejo',
  },
  advice: {
    1: 'aprende a tomar decisiones por tu cuenta',
    2: 'desarrolla la empatía y la capacidad de escuchar',
    3: 'empieza a expresarte en público',
    4: 'crea estructura en tu día a día',
    5: 'permítete el cambio',
    6: 'aprende a cuidar sin sacrificarte',
    7: 'empieza a hacerte preguntas profundas',
    8: 'pon en orden tus finanzas',
    9: 'aprende a cerrar ciclos',
  },
};

export function getActionSet(lang: string): ActionSet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
export function getActionLabels(lang: string): ActionLabels {
  if (lang === 'en') {
    return {
      fallbackDoNow: 'Focus on your current tasks', fallbackStrengthen: 'Develop your awareness',
      fallbackAvoid: 'Avoid extremes', fallbackUnlock: 'Follow your mission',
      workEnergy: (d, advice) => `Work through the energy of ${d} — ${advice}`,
      useStrong: (d) => `Use your strong ${d} — it's your natural resource`,
      crisisAvoid: "Don't start major projects during a crisis period",
    };
  }
  if (lang === 'es') {
    return {
      fallbackDoNow: 'Concéntrate en tus tareas actuales', fallbackStrengthen: 'Desarrolla tu conciencia',
      fallbackAvoid: 'Evita los extremos', fallbackUnlock: 'Sigue tu misión',
      workEnergy: (d, advice) => `Trabaja la energía del ${d} — ${advice}`,
      useStrong: (d) => `Usa tu fuerte ${d}: es tu recurso natural`,
      crisisAvoid: 'No empieces grandes proyectos en un periodo de crisis',
    };
  }
  return {
    fallbackDoNow: 'Сфокусируйтесь на текущих задачах', fallbackStrengthen: 'Развивайте осознанность',
    fallbackAvoid: 'Избегайте крайностей', fallbackUnlock: 'Следуйте своей миссии',
    workEnergy: (d, advice) => `Проработайте энергию ${d} — ${advice}`,
    useStrong: (d) => `Используйте вашу сильную ${d} — это ваш природный ресурс`,
    crisisAvoid: 'Не начинайте крупных проектов в кризисный период',
  };
}
