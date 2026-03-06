import { ReactNode } from 'react';
import { Briefcase, Github, Globe, Link2, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Language, PersonalInfo } from '../../types/cv';
import { getDisplayUrl, getPersonalLinks, normalizeUrl } from '../../utils/content-helpers';
import { getTranslation } from '../../utils/localization';
import { cn } from '../ui/utils';

type ContactTheme = 'light' | 'dark';
type ContactLayout = 'inline' | 'stacked';

interface TemplateContactListProps {
  personalInfo: PersonalInfo;
  language: Language;
  accentColor: string;
  content?: 'all' | 'links';
  layout?: ContactLayout;
  theme?: ContactTheme;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  linkClassName?: string;
  separator?: ReactNode;
  showLabels?: boolean;
  showIcons?: boolean;
}

interface ContactEntry {
  key: string;
  label: string;
  display: string;
  href?: string;
}

function getLinkLabel(language: Language, key: string, fallback: string) {
  switch (key) {
    case 'website':
      return getTranslation(language, 'website');
    case 'linkedin':
      return getTranslation(language, 'linkedin');
    case 'github':
      return getTranslation(language, 'github');
    case 'portfolio':
      return getTranslation(language, 'portfolio');
    default:
      return fallback;
  }
}

function getEntryIcon(key: string) {
  switch (key) {
    case 'email':
      return Mail;
    case 'phone':
      return Phone;
    case 'location':
      return MapPin;
    case 'website':
      return Globe;
    case 'linkedin':
      return Linkedin;
    case 'github':
      return Github;
    case 'portfolio':
      return Briefcase;
    default:
      return Link2;
  }
}

function buildEntries(personalInfo: PersonalInfo, language: Language): ContactEntry[] {
  return [
    personalInfo.email
      ? {
          key: 'email',
          label: getTranslation(language, 'email'),
          display: personalInfo.email,
          href: normalizeUrl(personalInfo.email),
        }
      : null,
    personalInfo.phone
      ? {
          key: 'phone',
          label: getTranslation(language, 'phone'),
          display: personalInfo.phone,
          href: normalizeUrl(personalInfo.phone),
        }
      : null,
    personalInfo.location
      ? {
          key: 'location',
          label: getTranslation(language, 'location'),
          display: personalInfo.location,
        }
      : null,
    ...getPersonalLinks(personalInfo).map((link) => ({
      key: link.key,
      label: getLinkLabel(language, link.key, link.label),
      display: link.display || getDisplayUrl(link.value),
      href: normalizeUrl(link.value),
    })),
  ].filter((entry): entry is ContactEntry => Boolean(entry));
}

export function TemplateContactList({
  personalInfo,
  language,
  accentColor,
  content = 'all',
  layout = 'inline',
  theme = 'light',
  className,
  itemClassName,
  labelClassName,
  linkClassName,
  separator,
  showLabels,
  showIcons = false,
}: TemplateContactListProps) {
  const entries = buildEntries(personalInfo, language).filter((entry) => {
    if (content === 'links') {
      return !['email', 'phone', 'location'].includes(entry.key);
    }
    return true;
  });

  if (entries.length === 0) return null;

  const baseTextClass = theme === 'dark' ? 'text-white/90' : 'text-gray-600';
  const baseLabelClass = theme === 'dark' ? 'text-white/50' : 'text-gray-500';
  const baseLinkClass = theme === 'dark' ? 'hover:text-white hover:underline' : 'hover:underline';
  const shouldShowLabels = showLabels ?? layout === 'stacked';

  const renderEntryContent = (entry: ContactEntry) => {
    const Icon = showIcons ? getEntryIcon(entry.key) : null;
    const content = entry.href ? (
      <a
        href={entry.href}
        className={cn(baseLinkClass, linkClassName)}
        style={{ color: entry.key === 'email' || entry.key === 'phone' ? undefined : accentColor }}
        target={entry.href.startsWith('mailto:') || entry.href.startsWith('tel:') ? undefined : '_blank'}
        rel={entry.href.startsWith('mailto:') || entry.href.startsWith('tel:') ? undefined : 'noreferrer'}
      >
        {entry.display}
      </a>
    ) : (
      <span>{entry.display}</span>
    );

    if (layout === 'stacked') {
      return (
        <div className={cn('space-y-0.5', itemClassName)} key={entry.key}>
          {shouldShowLabels && <p className={cn('text-xs', baseLabelClass, labelClassName)}>{entry.label}</p>}
          <div className={cn('flex items-start gap-2 break-all', baseTextClass)}>
            {Icon ? <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : null}
            <div className="min-w-0 break-all">{content}</div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('flex items-center gap-1.5 min-w-0', baseTextClass, itemClassName)} key={entry.key}>
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
        {shouldShowLabels ? <span className={cn(baseLabelClass, labelClassName)}>{entry.label}:</span> : null}
        <span className="min-w-0 break-all">{content}</span>
      </div>
    );
  };

  if (layout === 'stacked') {
    return <div className={cn('space-y-2', className)}>{entries.map(renderEntryContent)}</div>;
  }

  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-1', className)}>
      {entries.map((entry, index) => (
        <div className="flex items-center gap-2" key={entry.key}>
          {separator && index > 0 ? <span className={cn(baseLabelClass, labelClassName)}>{separator}</span> : null}
          {renderEntryContent(entry)}
        </div>
      ))}
    </div>
  );
}
