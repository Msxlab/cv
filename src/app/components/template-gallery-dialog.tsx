import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { CVData, TemplateName } from '../types/cv';
import { createEmptyCV } from '../utils/cv-schema';
import { templateOptions, TemplateCategory, TemplateOption } from '../utils/template-styles';
import { CVTemplateRenderer } from './cv-preview';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Notice } from './ui/notice';

interface TemplateGalleryDialogProps {
  open: boolean;
  currentCV: CVData;
  onSelect: (template: TemplateName) => void;
  onClose: () => void;
}

const categories: Array<'All' | TemplateCategory> = ['All', 'Professional', 'Modern', 'Creative', 'Executive', 'Academic', 'Compact'];
const filterTags = ['Supports photo', 'Best for 1 page'] as const;
type FilterTag = (typeof filterTags)[number];

function sampleCV(): CVData {
  const cv = createEmptyCV('Sample Resume');
  return {
    ...cv,
    personalInfo: {
      ...cv.personalInfo,
      firstName: 'Alex',
      lastName: 'Morgan',
      headline: 'Product Designer',
      summary: 'Designs accessible products with measurable business impact across web and mobile platforms.',
      email: 'alex@example.com',
      phone: '+1 555 0100',
      location: 'New York, NY',
    },
    experiences: [
      {
        id: 'sample-exp',
        company: 'Northstar Studio',
        position: 'Lead Product Designer',
        location: 'Remote',
        startDate: '2021-01',
        endDate: '',
        current: true,
        responsibilities: ['Led redesign that improved activation by 24%', 'Built reusable design system components'],
        achievements: [],
      },
    ],
    education: [
      {
        id: 'sample-edu',
        institution: 'State University',
        degree: 'BFA',
        field: 'Design',
        location: '',
        startDate: '2014',
        endDate: '2018',
        current: false,
      },
    ],
    skills: [
      { id: 'sample-skill-1', name: 'UX Research', category: 'Design', level: 'advanced' },
      { id: 'sample-skill-2', name: 'Figma', category: 'Design', level: 'expert' },
      { id: 'sample-skill-3', name: 'Accessibility', category: 'Design', level: 'advanced' },
    ],
    customSections: [{ id: 'sample-custom', title: 'Selected Work', content: 'Portfolio case studies available on request.' }],
    sectionOrder: ['summary', 'experiences', 'skills', 'projects', 'education', 'certifications', 'languages', 'achievements', 'volunteers', 'publications', 'references', 'sample-custom'],
  };
}

function hasContent(cv: CVData) {
  return Boolean(
    cv.personalInfo.firstName ||
    cv.personalInfo.summary ||
    cv.experiences.length ||
    cv.skills.length ||
    cv.customSections.length
  );
}

function matchesFilters(tmpl: TemplateOption, category: typeof categories[number], filters: Set<FilterTag>): boolean {
  if (category !== 'All' && tmpl.category !== category) return false;
  if (filters.has('Supports photo') && !tmpl.supportsPhoto) return false;
  if (filters.has('Best for 1 page') && !tmpl.tags.includes('Best for 1 page')) return false;
  return true;
}

function templateWarning(tmpl: TemplateOption, cv: CVData): string | null {
  const wantsPhoto = Boolean(cv.showPhoto && cv.personalInfo.photo);
  if (wantsPhoto && !tmpl.supportsPhoto) return 'This template hides the photo.';
  return null;
}

export function TemplateGalleryDialog({ open, currentCV, onSelect, onClose }: TemplateGalleryDialogProps) {
  const [category, setCategory] = useState<typeof categories[number]>('All');
  const [filters, setFilters] = useState<Set<FilterTag>>(new Set());

  const sourceCV = hasContent(currentCV) ? currentCV : sampleCV();

  const visibleTemplates = useMemo(
    () => templateOptions.filter((tmpl) => matchesFilters(tmpl, category, filters)),
    [category, filters]
  );

  const toggleFilter = (tag: FilterTag) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-hidden p-0">
        <div className="flex h-full max-h-[92vh] flex-col">
          <DialogHeader className="border-b border-slate-200 p-4 sm:p-6">
            <DialogTitle>Choose a template</DialogTitle>
            <DialogDescription>
              Browser-only · never uploaded. Templates use your current CV content.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:p-6">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-500">Filters</span>
              {filterTags.map((tag) => {
                const active = filters.has(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleFilter(tag)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      active
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {active ? '✓ ' : ''}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTemplates.map((template) => {
                const previewCV: CVData = {
                  ...sourceCV,
                  template: template.value,
                  layout: template.supportsDoubleLayout ? sourceCV.layout : 'single',
                };
                const selected = currentCV.template === template.value;
                const warning = templateWarning(template, currentCV);

                return (
                  <button
                    key={template.value}
                    type="button"
                    onClick={() => {
                      onSelect(template.value);
                      onClose();
                    }}
                    className={`group flex flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:shadow-md ${
                      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="relative aspect-[210/297] overflow-hidden border-b border-slate-200 bg-slate-100">
                      <div
                        className="origin-top-left"
                        style={{ transform: 'scale(0.32)', width: '210mm', transformOrigin: 'top left' }}
                        aria-hidden="true"
                      >
                        <CVTemplateRenderer cv={previewCV} />
                      </div>
                      {selected && (
                        <span className="absolute right-2 top-2 rounded-full bg-blue-600 p-1 text-white shadow">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{template.label}</p>
                          <p className="text-xs text-slate-500">{template.description}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-700">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{template.bestFor}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {warning && (
                        <Notice tone="warning" className="px-2 py-1.5 text-[11px]" icon={false}>
                          {warning}
                        </Notice>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {visibleTemplates.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">No templates match those filters.</div>
            )}
          </div>

          <DialogFooter className="border-t border-slate-200 p-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
