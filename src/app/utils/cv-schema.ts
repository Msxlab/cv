import {
  AccentColor,
  Achievement,
  Certification,
  CustomSection,
  CVData,
  Education,
  Experience,
  Language,
  LanguageSkill,
  Project,
  Publication,
  Reference,
  Skill,
  SkillLevel,
  Spacing,
  TemplateName,
} from '../types/cv';
import { accentColors, fontFamilies, templateSupportsDoubleLayout } from './template-styles';
import { normalizeUrl } from './content-helpers';

export const CV_SCHEMA_VERSION = 2;
export const BACKUP_FILE_TYPE = 'private-session-cv-builder-backup';
export const BACKUP_SCHEMA_VERSION = 1;
const APP_VERSION = '0.0.1';

export const SESSION_KEYS = {
  cvs: 'cv-builder:cvs',
  currentCVId: 'cv-builder:current-cv-id',
  sessionMeta: 'cv-builder:session-meta',
  legacySessionState: 'cv-builder:session-state',
  schemaVersion: 'cv-builder:schema-version',
} as const;

export const CORE_SECTION_IDS = [
  'summary',
  'experiences',
  'projects',
  'education',
  'certifications',
  'skills',
  'languages',
  'achievements',
  'volunteers',
  'publications',
  'references',
] as const;

export type CoreSectionId = typeof CORE_SECTION_IDS[number];
export type RenderableSectionId = CoreSectionId | string;

const SUPPORTED_LANGUAGES: Language[] = ['tr', 'en', 'fr', 'de', 'es'];
const SUPPORTED_TEMPLATES: TemplateName[] = [
  'classic',
  'modern',
  'executive',
  'technical',
  'creative',
  'minimalist',
  'elegant',
  'compact',
  'academic',
  'infographic',
  'bold',
  'twotone',
  'timeline',
  'metro',
  'newspaper',
  'gradient',
  'swiss',
];
const SUPPORTED_SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
const SUPPORTED_SPACINGS: Spacing[] = ['compact', 'normal', 'relaxed'];
const SUPPORTED_FONT_SIZES = ['small', 'medium', 'large'] as const;

export interface StoredSessionState {
  initialized: boolean;
  lastSavedAt?: string;
  lastExportedAt?: string;
  lastBackupExportedAt?: string;
  lastPDFExportedAt?: string;
  lastDOCXExportedAt?: string;
}

export interface LoadSessionResult {
  cvs: CVData[];
  currentCVId: string | null;
  sessionState: StoredSessionState;
  recoveredFromError: boolean;
  errorMessage?: string;
}

export interface CVBackupFile {
  fileType: typeof BACKUP_FILE_TYPE;
  schemaVersion: typeof BACKUP_SCHEMA_VERSION;
  backupVersion: typeof BACKUP_SCHEMA_VERSION;
  appName: 'Cyber Warriors - PonyCot';
  appVersion: string;
  exportedAt: string;
  cv: CVData;
}

export interface ParsedBackupResult {
  cv: CVData;
  exportedAt?: string;
  fileType: typeof BACKUP_FILE_TYPE | 'legacy-cv-data';
  schemaVersion: number;
  warnings: string[];
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${randomPart}`;
}

export function createEmptyCV(name: string): CVData {
  const now = new Date().toISOString();

  return {
    id: createId(),
    name: name.trim() || 'Untitled Resume',
    schemaVersion: CV_SCHEMA_VERSION,
    language: 'en',
    template: 'modern',
    layout: 'single',
    accentColor: 'blue',
    fontFamily: 'sans',
    fontSize: 'medium',
    spacing: 'normal',
    showPhoto: true,
    personalInfo: {
      firstName: '',
      lastName: '',
      headline: '',
      summary: '',
      email: '',
      phone: '',
      location: '',
      otherLinks: [],
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    achievements: [],
    languages: [],
    volunteers: [],
    publications: [],
    references: [],
    customSections: [],
    sectionOrder: [...CORE_SECTION_IDS],
    createdAt: now,
    updatedAt: now,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafePhoto(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (!value.startsWith('data:image/jpeg') && !value.startsWith('data:image/png') && !value.startsWith('data:image/webp')) return false;
  return value.length <= 900_000;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function booleanValue(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function safeOptionalUrl(value: unknown): string | undefined {
  const normalized = normalizeUrl(stringValue(value));
  return normalized || undefined;
}

function arrayValue<T>(value: unknown, mapper: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(mapper).filter((item): item is T => item !== null);
}

function ensureUniqueItemIds<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();

  return items.map((item) => {
    if (item.id && !seen.has(item.id)) {
      seen.add(item.id);
      return item;
    }

    const next = { ...item, id: createId() };
    seen.add(next.id);
    return next;
  });
}

function normalizePersonalInfo(value: unknown): CVData['personalInfo'] {
  const info = isRecord(value) ? value : {};
  const rawLinks = Array.isArray(info.otherLinks) ? info.otherLinks : [];

  return {
    firstName: stringValue(info.firstName),
    lastName: stringValue(info.lastName),
    headline: stringValue(info.headline),
    summary: stringValue(info.summary),
    photo: isSafePhoto(info.photo) ? info.photo : undefined,
    email: stringValue(info.email),
    phone: stringValue(info.phone),
    location: stringValue(info.location),
    website: safeOptionalUrl(info.website),
    linkedin: safeOptionalUrl(info.linkedin),
    github: safeOptionalUrl(info.github),
    portfolio: safeOptionalUrl(info.portfolio),
    otherLinks: rawLinks
      .filter(isRecord)
      .map((link) => ({
        label: stringValue(link.label),
        url: normalizeUrl(stringValue(link.url)),
      })),
  };
}

function normalizeExperience(value: unknown): Experience | null {
  if (!isRecord(value)) return null;
  const current = booleanValue(value.current);

  return {
    id: stringValue(value.id) || createId(),
    company: stringValue(value.company),
    position: stringValue(value.position),
    location: stringValue(value.location),
    startDate: stringValue(value.startDate),
    endDate: current ? '' : stringValue(value.endDate),
    current,
    responsibilities: Array.isArray(value.responsibilities)
      ? value.responsibilities.map((item) => stringValue(item)).filter(Boolean)
      : [],
    achievements: Array.isArray(value.achievements)
      ? value.achievements.map((item) => stringValue(item)).filter(Boolean)
      : [],
  };
}

function normalizeEducation(value: unknown): Education | null {
  if (!isRecord(value)) return null;
  const current = booleanValue(value.current);

  return {
    id: stringValue(value.id) || createId(),
    institution: stringValue(value.institution),
    degree: stringValue(value.degree),
    field: stringValue(value.field),
    location: stringValue(value.location),
    startDate: stringValue(value.startDate),
    endDate: current ? '' : stringValue(value.endDate),
    current,
    gpa: stringValue(value.gpa) || undefined,
    description: stringValue(value.description) || undefined,
  };
}

function normalizeSkill(value: unknown): Skill | null {
  if (!isRecord(value)) return null;
  const rawLevel = stringValue(value.level) as SkillLevel;

  return {
    id: stringValue(value.id) || createId(),
    name: stringValue(value.name),
    category: stringValue(value.category) || 'Technical Skills',
    level: SUPPORTED_SKILL_LEVELS.includes(rawLevel) ? rawLevel : 'intermediate',
  };
}

function normalizeCertification(value: unknown): Certification | null {
  if (!isRecord(value)) return null;

  return {
    id: stringValue(value.id) || createId(),
    name: stringValue(value.name),
    issuer: stringValue(value.issuer),
    date: stringValue(value.date),
    expiryDate: stringValue(value.expiryDate) || undefined,
    credentialId: stringValue(value.credentialId) || undefined,
    url: safeOptionalUrl(value.url),
  };
}

function normalizeProject(value: unknown): Project | null {
  if (!isRecord(value)) return null;

  return {
    id: stringValue(value.id) || createId(),
    name: stringValue(value.name),
    role: stringValue(value.role),
    description: stringValue(value.description),
    technologies: Array.isArray(value.technologies)
      ? value.technologies.map((item) => stringValue(item)).filter(Boolean)
      : [],
    impact: stringValue(value.impact) || undefined,
    url: safeOptionalUrl(value.url),
    startDate: stringValue(value.startDate),
    endDate: stringValue(value.endDate),
  };
}

function normalizeAchievement(value: unknown): Achievement | null {
  if (!isRecord(value)) return null;

  return {
    id: stringValue(value.id) || createId(),
    title: stringValue(value.title),
    description: stringValue(value.description),
    date: stringValue(value.date),
  };
}

function normalizeLanguageSkill(value: unknown): LanguageSkill | null {
  if (!isRecord(value)) return null;
  const proficiency = stringValue(value.proficiency) as LanguageSkill['proficiency'];
  const safeProficiency: LanguageSkill['proficiency'] = [
    'native',
    'fluent',
    'professional',
    'intermediate',
    'basic',
  ].includes(proficiency)
    ? proficiency
    : 'intermediate';

  return {
    id: stringValue(value.id) || createId(),
    language: stringValue(value.language),
    proficiency: safeProficiency,
  };
}

function normalizeVolunteer(value: unknown): CVData['volunteers'][number] | null {
  if (!isRecord(value)) return null;
  const current = booleanValue(value.current);

  return {
    id: stringValue(value.id) || createId(),
    organization: stringValue(value.organization),
    role: stringValue(value.role),
    description: stringValue(value.description),
    startDate: stringValue(value.startDate),
    endDate: current ? '' : stringValue(value.endDate),
    current,
  };
}

function normalizePublication(value: unknown): Publication | null {
  if (!isRecord(value)) return null;

  return {
    id: stringValue(value.id) || createId(),
    title: stringValue(value.title),
    publisher: stringValue(value.publisher),
    date: stringValue(value.date),
    url: safeOptionalUrl(value.url),
    description: stringValue(value.description) || undefined,
  };
}

function normalizeReference(value: unknown): Reference | null {
  if (!isRecord(value)) return null;

  return {
    id: stringValue(value.id) || createId(),
    name: stringValue(value.name),
    position: stringValue(value.position),
    company: stringValue(value.company),
    email: stringValue(value.email),
    phone: stringValue(value.phone) || undefined,
    relationship: stringValue(value.relationship) || undefined,
  };
}

function normalizeCustomSection(value: unknown): CustomSection | null {
  if (!isRecord(value)) return null;

  return {
    id: stringValue(value.id) || createId(),
    title: stringValue(value.title),
    content: stringValue(value.content),
  };
}

export function normalizeSectionOrder(value: unknown, customSections: CustomSection[]): string[] {
  const customIds = new Set(customSections.map((section) => section.id));
  const allowed = new Set<string>([...CORE_SECTION_IDS, ...customIds]);
  const source = Array.isArray(value) ? value.map((item) => stringValue(item)).filter(Boolean) : [];
  const normalized = source.filter((sectionId, index) => allowed.has(sectionId) && source.indexOf(sectionId) === index);

  CORE_SECTION_IDS.forEach((sectionId) => {
    if (!normalized.includes(sectionId)) normalized.push(sectionId);
  });

  customSections.forEach((section) => {
    if (!normalized.includes(section.id)) normalized.push(section.id);
  });

  return normalized;
}

export function normalizeCVData(value: unknown, options: { forceNewId?: boolean; fallbackName?: string } = {}): CVData {
  const record = isRecord(value) ? value : {};
  const base = createEmptyCV(options.fallbackName || stringValue(record.name) || 'Imported Resume');
  const rawLanguage = stringValue(record.language) as Language;
  const rawTemplate = stringValue(record.template) as TemplateName;
  const rawFontSize = stringValue(record.fontSize) as CVData['fontSize'];
  const rawSpacing = stringValue(record.spacing) as Spacing;
  const rawLayout = stringValue(record.layout);
  const rawAccent = stringValue(record.accentColor) as AccentColor;
  const rawFontFamily = stringValue(record.fontFamily);
  const customSections = arrayValue(record.customSections, normalizeCustomSection);
  const safeCustomSections = ensureUniqueItemIds(customSections);
  const template = SUPPORTED_TEMPLATES.includes(rawTemplate) ? rawTemplate : base.template;
  const layout = rawLayout === 'double' && templateSupportsDoubleLayout(template) ? 'double' : 'single';
  const accentColor = rawAccent.startsWith('#') || accentColors[rawAccent] ? rawAccent : base.accentColor;
  const fontFamily = fontFamilies[rawFontFamily] ? rawFontFamily : base.fontFamily;
  const createdAt = stringValue(record.createdAt) || base.createdAt;
  const updatedAt = stringValue(record.updatedAt) || base.updatedAt;

  return {
    ...base,
    id: options.forceNewId ? createId() : stringValue(record.id) || base.id,
    name: stringValue(record.name) || base.name,
    schemaVersion: CV_SCHEMA_VERSION,
    language: SUPPORTED_LANGUAGES.includes(rawLanguage) ? rawLanguage : base.language,
    template,
    layout,
    accentColor,
    fontFamily,
    fontSize: SUPPORTED_FONT_SIZES.includes(rawFontSize) ? rawFontSize : base.fontSize,
    spacing: SUPPORTED_SPACINGS.includes(rawSpacing) ? rawSpacing : base.spacing,
    showPhoto: booleanValue(record.showPhoto, base.showPhoto),
    personalInfo: normalizePersonalInfo(record.personalInfo),
    experiences: ensureUniqueItemIds(arrayValue(record.experiences, normalizeExperience)),
    education: ensureUniqueItemIds(arrayValue(record.education, normalizeEducation)),
    skills: ensureUniqueItemIds(arrayValue(record.skills, normalizeSkill)),
    certifications: ensureUniqueItemIds(arrayValue(record.certifications, normalizeCertification)),
    projects: ensureUniqueItemIds(arrayValue(record.projects, normalizeProject)),
    achievements: ensureUniqueItemIds(arrayValue(record.achievements, normalizeAchievement)),
    languages: ensureUniqueItemIds(arrayValue(record.languages, normalizeLanguageSkill)),
    volunteers: ensureUniqueItemIds(arrayValue(record.volunteers, normalizeVolunteer)),
    publications: ensureUniqueItemIds(arrayValue(record.publications, normalizePublication)),
    references: ensureUniqueItemIds(arrayValue(record.references, normalizeReference)),
    customSections: safeCustomSections,
    sectionOrder: normalizeSectionOrder(record.sectionOrder, safeCustomSections),
    createdAt,
    updatedAt,
  };
}

export function ensureUniqueCVIds(cvs: CVData[]): CVData[] {
  const seen = new Set<string>();

  return cvs.map((cv) => {
    if (!seen.has(cv.id)) {
      seen.add(cv.id);
      return cv;
    }

    const next = { ...cv, id: createId() };
    seen.add(next.id);
    return next;
  });
}

export function parseCVJson(raw: string): CVData {
  return parseEditableBackup(raw, { allowLegacy: true }).cv;
}

export function createEditableBackup(cv: CVData): CVBackupFile {
  return {
    fileType: BACKUP_FILE_TYPE,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    backupVersion: BACKUP_SCHEMA_VERSION,
    appName: 'Cyber Warriors - PonyCot',
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    cv: normalizeCVData(cv),
  };
}

export function parseEditableBackup(raw: string, options: { allowLegacy?: boolean } = {}): ParsedBackupResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('This is not valid JSON.');
  }

  if (!isRecord(parsed)) {
    throw new Error('Backup file must be a JSON object.');
  }

  if (parsed.fileType === BACKUP_FILE_TYPE) {
    const schemaVersion = typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : 0;
    if (schemaVersion < 1 || schemaVersion > BACKUP_SCHEMA_VERSION) {
      throw new Error('This backup version is not supported by this app.');
    }

    return {
      cv: normalizeCVData(parsed.cv, { forceNewId: true, fallbackName: 'Imported Backup' }),
      exportedAt: stringValue(parsed.exportedAt) || undefined,
      fileType: BACKUP_FILE_TYPE,
      schemaVersion,
      warnings: [],
    };
  }

  if (!options.allowLegacy) {
    throw new Error('This JSON file is not a Cyber Warriors - PonyCot editable backup.');
  }

  const legacyCV = isRecord(parsed.cv) ? parsed.cv : parsed;
  return {
    cv: normalizeCVData(legacyCV, { forceNewId: true, fallbackName: 'Imported Legacy Backup' }),
    exportedAt: stringValue(parsed.exportedAt) || undefined,
    fileType: 'legacy-cv-data',
    schemaVersion: typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : 0,
    warnings: ['Legacy CV JSON was normalized into the current editable backup format.'],
  };
}

export function loadSessionFromStorage(storage: Storage = sessionStorage): LoadSessionResult {
  try {
    const rawCVs = storage.getItem(SESSION_KEYS.cvs);
    const rawState = storage.getItem(SESSION_KEYS.sessionMeta) || storage.getItem(SESSION_KEYS.legacySessionState);
    const currentCVId = storage.getItem(SESSION_KEYS.currentCVId);
    const parsedState = rawState ? JSON.parse(rawState) : {};
    const safeState = isRecord(parsedState) ? parsedState : {};
    const sessionState: StoredSessionState = {
      initialized: Boolean(safeState.initialized || rawCVs !== null),
      lastSavedAt: stringValue(safeState.lastSavedAt) || undefined,
      lastExportedAt: stringValue(safeState.lastExportedAt) || undefined,
      lastBackupExportedAt: stringValue(safeState.lastBackupExportedAt) || undefined,
      lastPDFExportedAt: stringValue(safeState.lastPDFExportedAt) || undefined,
      lastDOCXExportedAt: stringValue(safeState.lastDOCXExportedAt) || undefined,
    };

    if (rawCVs === null) {
      return {
        cvs: [],
        currentCVId: null,
        sessionState,
        recoveredFromError: false,
      };
    }

    const parsedCVs = JSON.parse(rawCVs);
    if (!Array.isArray(parsedCVs)) {
      throw new Error('Stored CV list is not an array.');
    }

    const cvs = ensureUniqueCVIds(parsedCVs.map((item) => normalizeCVData(item)));
    return {
      cvs,
      currentCVId: currentCVId || cvs[0]?.id || null,
      sessionState: {
        ...sessionState,
        initialized: true,
      },
      recoveredFromError: false,
    };
  } catch (error) {
    clearAppSessionStorage(storage);
    return {
      cvs: [],
      currentCVId: null,
      sessionState: { initialized: true },
      recoveredFromError: true,
      errorMessage: error instanceof Error ? error.message : 'Unable to load session data.',
    };
  }
}

export function saveSessionToStorage(
  cvs: CVData[],
  currentCVId: string | null,
  sessionState: StoredSessionState,
  storage: Storage = sessionStorage
) {
  const now = new Date().toISOString();
  storage.setItem(SESSION_KEYS.cvs, JSON.stringify(cvs));
  storage.setItem(SESSION_KEYS.currentCVId, currentCVId || '');
  storage.setItem(SESSION_KEYS.schemaVersion, String(CV_SCHEMA_VERSION));
  storage.setItem(
    SESSION_KEYS.sessionMeta,
    JSON.stringify({
      ...sessionState,
      initialized: true,
      lastSavedAt: now,
    })
  );
  storage.removeItem(SESSION_KEYS.legacySessionState);
}

export function clearAppSessionStorage(storage: Storage = sessionStorage) {
  Object.values(SESSION_KEYS).forEach((key) => storage.removeItem(key));
}

export function hasMeaningfulCVContent(cv: CVData | null): boolean {
  if (!cv) return false;
  const info = cv.personalInfo;
  const personalValues = [
    info.firstName,
    info.lastName,
    info.headline,
    info.summary,
    info.email,
    info.phone,
    info.location,
    info.website,
    info.linkedin,
    info.github,
    info.portfolio,
    info.photo,
  ];

  return (
    personalValues.some((value) => Boolean(value && value.trim())) ||
    (info.otherLinks || []).some((link) => Boolean(link.label.trim() || link.url.trim())) ||
    cv.experiences.length > 0 ||
    cv.education.length > 0 ||
    cv.skills.length > 0 ||
    cv.certifications.length > 0 ||
    cv.projects.length > 0 ||
    cv.achievements.length > 0 ||
    cv.languages.length > 0 ||
    cv.volunteers.length > 0 ||
    cv.publications.length > 0 ||
    cv.references.length > 0 ||
    cv.customSections.some((section) => Boolean(section.title.trim() || section.content.trim()))
  );
}
