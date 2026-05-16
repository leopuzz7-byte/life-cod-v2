import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Heart, Briefcase } from "lucide-react";

interface RelationTypeSelectorProps {
  value: 'love' | 'business';
  onChange: (value: 'love' | 'business') => void;
}

export function RelationTypeSelector({ value, onChange }: RelationTypeSelectorProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange('love')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300",
          value === 'love'
            ? "bg-pink-50 border-pink-400 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
            : "bg-card border-border hover:border-pink-200"
        )}
      >
        <Heart className={cn("w-5 h-5", value === 'love' ? "fill-pink-400" : "")} />
        <span className="font-medium">{t('lifecod.relationType.love')}</span>
      </button>
      
      <button
        onClick={() => onChange('business')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300",
          value === 'business'
            ? "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            : "bg-card border-border hover:border-blue-200"
        )}
      >
        <Briefcase className={cn("w-5 h-5", value === 'business' ? "fill-blue-400" : "")} />
        <span className="font-medium">{t('lifecod.relationType.business')}</span>
      </button>
    </div>
  );
}
