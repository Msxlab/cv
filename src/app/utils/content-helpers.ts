import { format, isValid, parse, parseISO } from 'date-fns';
import { Language, PersonalInfo } from '../types/cv';
import { getTranslation } from './localization';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const monthDatePattern = /^\d{4}-\d{2}$/;

export function safeParseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  const normalized = dateStr.trim();
  if (!normalized) return null;

  const parsed = isoDatePattern.test(normalized)
    ? parseISO(normalized)
    : monthDatePattern.test(normalized)
      ? parse(normalized, 'yyyy-MM', new Date())
      : parseISO(normalized);

  return isValid(parsed) ? parsed : null;
}

export function toStoredDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function safeFormat(dateStr: string | undefined | null, fmt: string): string {
  const date = safeParseDate(dateStr);
  if (!date) return '';
  return format(date, fmt);
}

export function formatDateRange(
  startDate: string | undefined | null,
  endDate: string | undefined | null,
  current: boolean,
  language: Language,
  fmt = 'MMM yyyy'
): string {
  const start = safeFormat(startDate, fmt);
  const end = current ? getTranslation(language, 'present') : safeFormat(endDate, fmt);

  if (start && end) return `${start} - ${end}`;
  return start || end;
}

export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;
  if (/^[+\d][\d\s().-]+$/.test(trimmed)) return `tel:${trimmed.replace(/\s+/g, '')}`;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return '';
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function getDisplayUrl(url: string | undefined | null): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/^(https?:\/\/|mailto:|tel:)/i, '')
    .replace(/\/$/, '');
}

export interface PersonalLinkEntry {
  key: string;
  label: string;
  value: string;
  display: string;
}

export function getPersonalLinks(personalInfo: PersonalInfo): PersonalLinkEntry[] {
  return [
    personalInfo.website
      ? { key: 'website', label: 'website', value: personalInfo.website, display: getDisplayUrl(personalInfo.website) }
      : null,
    personalInfo.linkedin
      ? { key: 'linkedin', label: 'linkedin', value: personalInfo.linkedin, display: 'LinkedIn' }
      : null,
    personalInfo.github
      ? { key: 'github', label: 'github', value: personalInfo.github, display: 'GitHub' }
      : null,
    personalInfo.portfolio
      ? { key: 'portfolio', label: 'portfolio', value: personalInfo.portfolio, display: 'Portfolio' }
      : null,
    ...(personalInfo.otherLinks || [])
      .filter(link => link.url?.trim())
      .map((link, index) => ({
        key: `other-${index}`,
        label: link.label?.trim() || 'link',
        value: link.url,
        display: link.label?.trim() || getDisplayUrl(link.url),
    })),
  ].filter((link): link is PersonalLinkEntry => Boolean(link));
}

