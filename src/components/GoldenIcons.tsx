// 3D Golden PNG icons

import iconCompass       from '@/assets/icons/icon_compass.png';
import iconCompatibility from '@/assets/icons/icon_compatibility.png';
import iconSun           from '@/assets/icons/icon_sun.png';
import iconCalendar      from '@/assets/icons/icon_calendar.png';
import iconTree          from '@/assets/icons/icon_tree.png';
import iconScroll        from '@/assets/icons/icon_scroll.png';
import iconHeart         from '@/assets/icons/icon_heart.png';
import iconBriefcase     from '@/assets/icons/icon_briefcase.png';
import iconBriefcase2    from '@/assets/icons/icon_briefcase2.png';
import iconScales        from '@/assets/icons/icon_scales.png';
import iconWallet        from '@/assets/icons/icon_wallet.png';
import iconStar          from '@/assets/icons/icon_star.png';

const Ico = ({ src, className }: { src: string; className?: string }) => (
  <img src={src} alt="" style={{ width: 64, height: 64, objectFit: 'contain', display: 'inline-block', flexShrink: 0 }} className={className} />
);

export const GoldenIconCompass      = (p: { className?: string }) => <Ico src={iconCompass}       {...p} />;
export const GoldenIconUsers        = (p: { className?: string }) => <Ico src={iconCompatibility} {...p} />;
export const GoldenIconCalendarDays = (p: { className?: string }) => <Ico src={iconSun}           {...p} />;
export const GoldenIconCalendar     = (p: { className?: string }) => <Ico src={iconCalendar}      {...p} />;
export const GoldenIconClock        = (p: { className?: string }) => <Ico src={iconStar}          {...p} />;
export const GoldenIconBrain        = (p: { className?: string }) => <Ico src={iconTree}          {...p} />;
export const GoldenIconBuilding     = (p: { className?: string }) => <Ico src={iconBriefcase2}    {...p} />;
export const GoldenIconFileText     = (p: { className?: string }) => <Ico src={iconScroll}        {...p} />;
export const GoldenIconHeart        = (p: { className?: string }) => <Ico src={iconHeart}         {...p} />;
export const GoldenIconBriefcase    = (p: { className?: string }) => <Ico src={iconBriefcase}     {...p} />;
export const GoldenIconType         = (p: { className?: string }) => <Ico src={iconScales}        {...p} />;
export const GoldenIconWallet       = (p: { className?: string }) => <Ico src={iconWallet}        {...p} />;
export const GoldenIconSparkles     = (p: { className?: string }) => <Ico src={iconStar}          {...p} />;

export const GOLDEN_ICONS: Record<string, React.ComponentType> = {
  Compass:      GoldenIconCompass,
  Users:        GoldenIconUsers,
  CalendarDays: GoldenIconCalendarDays,
  Calendar:     GoldenIconCalendar,
  Clock:        GoldenIconClock,
  Brain:        GoldenIconBrain,
  Building:     GoldenIconBuilding,
  FileText:     GoldenIconFileText,
  Heart:        GoldenIconHeart,
  Briefcase:    GoldenIconBriefcase,
  Type:         GoldenIconType,
  Wallet:       GoldenIconWallet,
  Sparkles:     GoldenIconSparkles,
};
