import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RelationTypeSelector } from "./RelationTypeSelector";
import { RelationType } from "@/lib/lifecod/types";
import { Users } from "lucide-react";

interface LifeCodInputFormProps {
  onCalculate: (
    person1Name: string, person1Day: number, person1Month: number, person1Year: number,
    person2Name: string, person2Day: number, person2Month: number, person2Year: number,
    relationType: RelationType
  ) => void;
}

export function LifeCodInputForm({ onCalculate }: LifeCodInputFormProps) {
  const { t } = useTranslation();
  
  const [relationType, setRelationType] = useState<RelationType>('love');
  
  const [person1, setPerson1] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
  });
  
  const [person2, setPerson2] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const p1Day = parseInt(person1.day);
    const p1Month = parseInt(person1.month);
    const p1Year = parseInt(person1.year);
    const p2Day = parseInt(person2.day);
    const p2Month = parseInt(person2.month);
    const p2Year = parseInt(person2.year);
    
    if (p1Day && p1Month && p1Year && p2Day && p2Month && p2Year) {
      onCalculate(
        person1.name || (relationType === 'love' ? t('lifecod.defaultNames.partner1') : t('lifecod.defaultNames.business1')),
        p1Day, p1Month, p1Year,
        person2.name || (relationType === 'love' ? t('lifecod.defaultNames.partner2') : t('lifecod.defaultNames.business2')),
        p2Day, p2Month, p2Year,
        relationType
      );
    }
  };
  
  const renderPersonInputs = (
    person: typeof person1, 
    setPerson: typeof setPerson1, 
    labelKey: string
  ) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">{t(labelKey)}</h4>
      
      <div>
        <Label className="text-xs">{t('lifecod.form.name')}</Label>
        <Input
          placeholder={t('lifecod.form.namePlaceholder')}
          value={person.name}
          onChange={(e) => setPerson({ ...person, name: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">{t('lifecod.form.day')}</Label>
          <Input
            type="number"
            min="1"
            max="31"
            placeholder="ДД"
            value={person.day}
            onChange={(e) => setPerson({ ...person, day: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-xs">{t('lifecod.form.month')}</Label>
          <Input
            type="number"
            min="1"
            max="12"
            placeholder="ММ"
            value={person.month}
            onChange={(e) => setPerson({ ...person, month: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label className="text-xs">{t('lifecod.form.year')}</Label>
          <Input
            type="number"
            min="1900"
            max="2025"
            placeholder="ГГГГ"
            value={person.year}
            onChange={(e) => setPerson({ ...person, year: e.target.value })}
            className="mt-1"
            required
          />
        </div>
      </div>
    </div>
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RelationTypeSelector value={relationType} onChange={setRelationType} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPersonInputs(
          person1, 
          setPerson1, 
          relationType === 'love' ? 'lifecod.form.person1Love' : 'lifecod.form.person1Business'
        )}
        {renderPersonInputs(
          person2, 
          setPerson2, 
          relationType === 'love' ? 'lifecod.form.person2Love' : 'lifecod.form.person2Business'
        )}
      </div>
      
      <Button type="submit" className="w-full" size="lg">
        <Users className="w-4 h-4 mr-2" />
        {t('lifecod.form.calculate')}
      </Button>
    </form>
  );
}
