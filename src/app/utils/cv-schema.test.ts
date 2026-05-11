import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVTemplateRenderer } from '../components/cv-preview';
import {
  BACKUP_FILE_TYPE,
  createEditableBackup,
  createEmptyCV,
  loadSessionFromStorage,
  parseEditableBackup,
  saveSessionToStorage,
  SESSION_KEYS,
} from './cv-schema';
import { buildPlainTextCV } from './resume-render';
import { templateOptions } from './template-styles';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('editable backup and session safety', () => {
  it('exports and imports a full editable backup with custom section order', () => {
    const cv = createEmptyCV('Restore Me');
    const customId = 'custom-portfolio';
    const filled = {
      ...cv,
      template: 'classic' as const,
      accentColor: 'emerald' as const,
      fontFamily: 'serif',
      language: 'fr' as const,
      personalInfo: {
        ...cv.personalInfo,
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        summary: 'Mathematician and computing pioneer with measurable analytical impact.',
      },
      experiences: [
        {
          id: 'exp-1',
          company: 'Analytical Engines',
          position: 'Researcher',
          location: 'London',
          startDate: '1842',
          endDate: '1843',
          current: false,
          responsibilities: ['Designed an algorithm with 1 complete worked example'],
          achievements: ['Documented computing concepts'],
        },
      ],
      skills: [{ id: 'skill-1', name: 'Algorithms', category: 'Technical', level: 'expert' as const }],
      customSections: [{ id: customId, title: 'Notes', content: 'Restored custom content.' }],
      sectionOrder: ['summary', customId, 'experiences', 'skills', 'education', 'projects', 'certifications', 'languages', 'achievements', 'volunteers', 'publications', 'references'],
    };

    const backup = createEditableBackup(filled);
    expect(backup.fileType).toBe(BACKUP_FILE_TYPE);

    const parsed = parseEditableBackup(JSON.stringify(backup));
    expect(parsed.cv.template).toBe('classic');
    expect(parsed.cv.accentColor).toBe('emerald');
    expect(parsed.cv.customSections[0].content).toContain('Restored');
    expect(parsed.cv.sectionOrder[1]).toBe(customId);
    expect(buildPlainTextCV(parsed.cv)).toContain('Restored custom content');
  });

  it('rejects invalid JSON and unsupported backup file types', () => {
    expect(() => parseEditableBackup('{nope')).toThrow('valid JSON');
    expect(() => parseEditableBackup(JSON.stringify({ fileType: 'unknown', cv: {} }))).toThrow('not a Cyber Warriors - PonyCot');
  });

  it('recovers safely from corrupt sessionStorage', () => {
    const storage = new MemoryStorage();
    storage.setItem(SESSION_KEYS.cvs, 'not-json');
    const loaded = loadSessionFromStorage(storage);
    expect(loaded.recoveredFromError).toBe(true);
    expect(loaded.cvs).toEqual([]);
    expect(storage.getItem(SESSION_KEYS.cvs)).toBeNull();
  });

  it('persists an intentionally empty CV list without resurrection', () => {
    const storage = new MemoryStorage();
    saveSessionToStorage([], null, { initialized: true }, storage);
    const loaded = loadSessionFromStorage(storage);
    expect(loaded.cvs).toEqual([]);
    expect(loaded.currentCVId).toBeNull();
  });

  it('normalizes unsupported template and preserves editable data', () => {
    const parsed = parseEditableBackup(JSON.stringify({ name: 'Legacy', template: 'not-real', skills: [{ id: 'same', name: 'React', category: 'Frontend', level: 'expert' }] }), { allowLegacy: true });
    expect(parsed.cv.template).toBe('modern');
    expect(parsed.cv.skills[0].name).toBe('React');
  });

  it('renders every ordered section in every template without an additional sections fallback', () => {
    const cv = createEmptyCV('Full Template Test');
    const fullCV = {
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        firstName: 'Ada',
        lastName: 'Lovelace',
        headline: 'Computing Pioneer',
        summary: 'Section summary marker.',
        email: 'ada@example.com',
      },
      experiences: [{
        id: 'exp',
        company: 'Analytical Engines',
        position: 'Researcher',
        location: 'London',
        startDate: '1842',
        endDate: '1843',
        current: false,
        responsibilities: ['Experience marker'],
        achievements: ['Experience achievement marker'],
      }],
      projects: [{
        id: 'project',
        name: 'Notes on Engines',
        role: 'Author',
        description: 'Project marker',
        technologies: ['Mathematics'],
        startDate: '1842',
        endDate: '1843',
      }],
      education: [{
        id: 'education',
        institution: 'Self Study',
        degree: 'Mathematics',
        field: 'Logic',
        location: 'London',
        startDate: '1830',
        endDate: '1840',
        current: false,
        description: 'Education marker',
      }],
      certifications: [{ id: 'cert', name: 'Certificate marker', issuer: 'Royal Society', date: '1843' }],
      skills: [{ id: 'skill', name: 'Skill marker', category: 'Analysis', level: 'expert' as const }],
      languages: [{ id: 'language', language: 'Language marker', proficiency: 'fluent' as const }],
      achievements: [{ id: 'achievement', title: 'Achievement marker', description: 'Achievement body', date: '1843' }],
      volunteers: [{ id: 'volunteer', organization: 'Volunteer org', role: 'Volunteer marker', description: 'Volunteer body', startDate: '1840', endDate: '1841', current: false }],
      publications: [{ id: 'publication', title: 'Publication marker', publisher: 'Journal', date: '1843' }],
      references: [{ id: 'reference', name: 'Reference marker', position: 'Mentor', company: 'Academy', email: 'ref@example.com' }],
      customSections: [
        { id: 'custom-one', title: 'Custom One', content: 'Custom marker one' },
        { id: 'custom-two', title: 'Custom Two', content: 'Custom marker two' },
      ],
      sectionOrder: ['custom-two', 'summary', 'experiences', 'projects', 'education', 'certifications', 'skills', 'languages', 'achievements', 'volunteers', 'publications', 'references', 'custom-one'],
    };

    templateOptions.forEach((template) => {
      const markup = renderToStaticMarkup(React.createElement(CVTemplateRenderer, { cv: { ...fullCV, template: template.value } }));
      [
        'Custom marker two',
        'Section summary marker',
        'Experience marker',
        'Project marker',
        'Education marker',
        'Certificate marker',
        'Skill marker',
        'Language marker',
        'Achievement marker',
        'Volunteer marker',
        'Publication marker',
        'Reference marker',
        'Custom marker one',
      ].forEach((marker) => expect(markup, `${template.value} should render ${marker}`).toContain(marker));
      expect(markup).not.toContain(['Additional', 'Sections'].join(' '));
      expect(markup.indexOf('Custom marker two')).toBeLessThan(markup.indexOf('Section summary marker'));
      expect(markup.indexOf('Custom marker one')).toBeGreaterThan(markup.indexOf('Reference marker'));
    });
  });
});
