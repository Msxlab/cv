import type { CSSProperties, ReactNode } from 'react';
import { useCV } from '../context/cv-context';
import { CVData, TemplateName } from '../types/cv';
import { formatDateRange, getDisplayUrl, getPersonalLinks, normalizeUrl } from '../utils/content-helpers';
import { getOrderedSections, OrderedSection } from '../utils/resume-render';
import { getAccentColor, getTemplateStyle, spacings, templateSupportsDoubleLayout } from '../utils/template-styles';

interface CVTemplateRendererProps {
  cv: CVData;
}

interface DesignConfig {
  page: string;
  header: string;
  name: string;
  headline: string;
  contact: string;
  body: string;
  section: string;
  heading: string;
  item: string;
  meta: string;
  bullet: string;
  chip: string;
  photo: string;
  headerStyle?: (accent: string, light: string) => CSSProperties;
  headingStyle?: (accent: string) => CSSProperties;
  accentRule?: boolean;
}

const baseDesign: DesignConfig = {
  page: 'bg-white text-slate-900',
  header: 'border-b pb-6',
  name: 'text-4xl font-semibold tracking-normal',
  headline: 'mt-2 text-base text-slate-600',
  contact: 'mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600',
  body: 'mt-7',
  section: 'cv-section break-inside-avoid',
  heading: 'mb-3 text-xs font-bold uppercase tracking-[0.12em]',
  item: 'cv-item break-inside-avoid space-y-1',
  meta: 'text-xs text-slate-500',
  bullet: 'ml-4 list-disc space-y-1 text-sm leading-relaxed',
  chip: 'rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-700',
  photo: 'h-24 w-24 rounded-2xl object-cover',
  headingStyle: (accent) => ({ color: accent }),
};

const designs: Record<TemplateName, DesignConfig> = {
  modern: {
    ...baseDesign,
    page: 'bg-white text-slate-900',
    header: 'rounded-3xl border p-6',
    heading: 'mb-3 border-l-4 pl-3 text-xs font-bold uppercase tracking-[0.12em]',
    headingStyle: (accent) => ({ borderColor: accent, color: accent }),
  },
  classic: {
    ...baseDesign,
    page: 'bg-white font-serif text-stone-900',
    header: 'border-y-2 py-6 text-center',
    name: 'text-4xl font-bold tracking-normal',
    contact: 'mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-stone-600',
    heading: 'mb-3 border-b pb-1 text-sm font-bold uppercase tracking-[0.12em]',
    chip: 'border border-stone-300 px-2 py-1 text-xs text-stone-700',
  },
  executive: {
    ...baseDesign,
    header: 'rounded-none p-7 text-white',
    name: 'text-4xl font-semibold tracking-normal',
    headline: 'mt-2 text-base text-white/80',
    contact: 'mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80',
    headerStyle: (accent) => ({ background: `linear-gradient(135deg, #111827 0%, ${accent} 100%)` }),
    heading: 'mb-3 border-b pb-2 text-xs font-bold uppercase tracking-[0.14em]',
  },
  technical: {
    ...baseDesign,
    page: 'bg-slate-50 text-slate-950',
    header: 'border-l-8 bg-white p-6',
    name: 'font-mono text-3xl font-bold tracking-normal',
    headline: 'mt-2 font-mono text-sm text-slate-600',
    heading: 'mb-3 font-mono text-xs font-bold uppercase tracking-[0.08em]',
    item: 'cv-item break-inside-avoid space-y-1 rounded-lg border bg-white p-4',
    chip: 'rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-800',
    headingStyle: (accent) => ({ color: accent }),
    headerStyle: (accent) => ({ borderColor: accent }),
  },
  creative: {
    ...baseDesign,
    header: 'rounded-[2rem] p-7 text-white',
    headline: 'mt-2 text-base text-white/85',
    contact: 'mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/85',
    headerStyle: (accent) => ({ background: `linear-gradient(120deg, ${accent}, #111827)` }),
    heading: 'mb-3 text-sm font-semibold',
    chip: 'rounded-xl px-3 py-1 text-xs text-white',
    headingStyle: (accent) => ({ color: accent }),
  },
  minimalist: {
    ...baseDesign,
    header: 'pb-8',
    name: 'text-3xl font-medium tracking-normal',
    heading: 'mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500',
    section: 'cv-section break-inside-avoid border-t pt-5',
    item: 'cv-item break-inside-avoid space-y-1',
  },
  elegant: {
    ...baseDesign,
    page: 'bg-white font-serif text-zinc-900',
    header: 'border-b pb-7 text-center',
    name: 'text-4xl font-normal tracking-normal',
    headline: 'mt-2 text-base italic text-zinc-600',
    contact: 'mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-600',
    heading: 'mb-3 text-sm font-semibold uppercase tracking-[0.16em]',
  },
  compact: {
    ...baseDesign,
    name: 'text-3xl font-semibold tracking-normal',
    body: 'mt-5',
    section: 'cv-section break-inside-avoid',
    heading: 'mb-2 border-b pb-1 text-[11px] font-bold uppercase tracking-[0.1em]',
    item: 'cv-item break-inside-avoid space-y-0.5',
    bullet: 'ml-4 list-disc space-y-0.5 text-xs leading-relaxed',
    chip: 'rounded border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700',
  },
  academic: {
    ...baseDesign,
    page: 'bg-white font-serif text-neutral-950',
    header: 'border-b-2 pb-5',
    name: 'text-3xl font-bold tracking-normal',
    heading: 'mb-3 text-sm font-bold uppercase tracking-[0.08em]',
    item: 'cv-item break-inside-avoid space-y-1',
  },
  infographic: {
    ...baseDesign,
    header: 'rounded-3xl p-6',
    headerStyle: (_accent, light) => ({ background: light }),
    heading: 'mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]',
    item: 'cv-item break-inside-avoid rounded-2xl border border-slate-200 p-4',
    chip: 'rounded-full px-3 py-1 text-xs font-medium',
    headingStyle: (accent) => ({ color: accent }),
  },
  bold: {
    ...baseDesign,
    header: 'border-b-8 pb-6',
    name: 'text-5xl font-black tracking-normal',
    headline: 'mt-2 text-lg font-semibold text-slate-700',
    heading: 'mb-3 text-sm font-black uppercase tracking-[0.12em]',
    headerStyle: (accent) => ({ borderColor: accent }),
  },
  twotone: {
    ...baseDesign,
    page: 'bg-white text-slate-900',
    header: 'p-7 text-white',
    headerStyle: (accent) => ({ background: `linear-gradient(90deg, #0f172a 0%, #0f172a 42%, ${accent} 42%, ${accent} 100%)` }),
    headline: 'mt-2 text-base text-white/80',
    contact: 'mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80',
    heading: 'mb-3 rounded-r-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]',
    headingStyle: (accent) => ({ backgroundColor: `${accent}18`, color: accent }),
  },
  timeline: {
    ...baseDesign,
    header: 'border-b pb-6',
    section: 'cv-section break-inside-avoid border-l-2 pl-5',
    heading: 'mb-3 text-xs font-bold uppercase tracking-[0.12em]',
    item: 'cv-item break-inside-avoid relative space-y-1',
    accentRule: true,
  },
  metro: {
    ...baseDesign,
    header: 'grid gap-4 p-6 text-white sm:grid-cols-[1fr_auto]',
    headerStyle: (accent) => ({ backgroundColor: accent }),
    headline: 'mt-2 text-base text-white/85',
    contact: 'mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/85',
    heading: 'mb-3 inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white',
    headingStyle: (accent) => ({ backgroundColor: accent }),
    item: 'cv-item break-inside-avoid border border-slate-200 p-4',
  },
  newspaper: {
    ...baseDesign,
    page: 'bg-white font-serif text-neutral-950',
    header: 'border-y-4 py-5 text-center',
    name: 'text-4xl font-black tracking-normal',
    contact: 'mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-neutral-600',
    body: 'mt-7 md:columns-2 md:gap-8',
    heading: 'mb-2 border-b pb-1 text-sm font-black uppercase tracking-[0.08em]',
    item: 'cv-item break-inside-avoid space-y-1',
  },
  gradient: {
    ...baseDesign,
    header: 'rounded-3xl p-7 text-white',
    headerStyle: (accent) => ({ background: `linear-gradient(135deg, ${accent}, #475569)` }),
    headline: 'mt-2 text-base text-white/85',
    contact: 'mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/85',
    heading: 'mb-3 text-xs font-bold uppercase tracking-[0.12em]',
    headingStyle: (accent) => ({ color: accent }),
  },
  swiss: {
    ...baseDesign,
    header: 'grid gap-4 border-b-2 pb-6 sm:grid-cols-[1fr_auto]',
    name: 'text-4xl font-bold tracking-normal',
    heading: 'mb-3 border-t-4 pt-2 text-xs font-bold uppercase tracking-[0.14em]',
    headingStyle: (accent) => ({ borderColor: accent, color: '#111827' }),
  },
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function textBlock(value: string | undefined) {
  return (value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function DetailLine({ children, className }: { children: ReactNode; className: string }) {
  if (!children) return null;
  return <p className={className}>{children}</p>;
}

function LinkText({ url }: { url?: string }) {
  const safeUrl = normalizeUrl(url);
  if (!safeUrl) return null;
  return (
    <a href={safeUrl} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-2">
      {getDisplayUrl(safeUrl)}
    </a>
  );
}

function Bullets({ items, className }: { items: string[]; className: string }) {
  const cleanItems = items.filter((item) => item.trim());
  if (cleanItems.length === 0) return null;
  return (
    <ul className={className}>
      {cleanItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  );
}

function SectionShell({ section, design, accent, children }: { section: OrderedSection; design: DesignConfig; accent: string; children: ReactNode }) {
  return (
    <section className={design.section}>
      <h2 className={design.heading} style={design.headingStyle?.(accent)}>
        {design.accentRule && <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: accent }} />}
        {section.title}
      </h2>
      {children}
    </section>
  );
}

function renderSection(section: OrderedSection, cv: CVData, design: DesignConfig, accent: string) {
  switch (section.type) {
    case 'summary':
      return <p className="text-sm leading-relaxed text-slate-700">{cv.personalInfo.summary}</p>;
    case 'experiences':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.experiences.map((exp) => (
            <article key={exp.id} className={design.item}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{exp.position || exp.company}</h3>
                <DetailLine className={design.meta}>{formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}</DetailLine>
              </div>
              <DetailLine className={design.meta}>{[exp.company, exp.location].filter(Boolean).join(' | ')}</DetailLine>
              <Bullets items={[...exp.responsibilities, ...exp.achievements]} className={design.bullet} />
            </article>
          ))}
        </div>
      );
    case 'projects':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.projects.map((project) => (
            <article key={project.id} className={design.item}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{project.name || project.role}</h3>
                <DetailLine className={design.meta}>{formatDateRange(project.startDate, project.endDate, false, cv.language, 'MMM yyyy')}</DetailLine>
              </div>
              <DetailLine className={design.meta}>{project.role}</DetailLine>
              {project.description && <p className="text-sm leading-relaxed text-slate-700">{project.description}</p>}
              {project.url && <p className={design.meta}><LinkText url={project.url} /></p>}
              {project.technologies.length > 0 && <p className={design.meta}>Technologies: {project.technologies.join(', ')}</p>}
              {project.impact && <p className="text-sm leading-relaxed text-slate-700">{project.impact}</p>}
            </article>
          ))}
        </div>
      );
    case 'education':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.education.map((edu) => (
            <article key={edu.id} className={design.item}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{[edu.degree, edu.field].filter(Boolean).join(' in ') || edu.institution}</h3>
                <DetailLine className={design.meta}>{formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}</DetailLine>
              </div>
              <DetailLine className={design.meta}>{[edu.institution, edu.location].filter(Boolean).join(' | ')}</DetailLine>
              {edu.gpa && <p className={design.meta}>GPA: {edu.gpa}</p>}
              {edu.description && <p className="text-sm leading-relaxed text-slate-700">{edu.description}</p>}
            </article>
          ))}
        </div>
      );
    case 'certifications':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.certifications.map((cert) => (
            <article key={cert.id} className={design.item}>
              <h3 className="font-semibold">{cert.name || cert.issuer}</h3>
              <DetailLine className={design.meta}>{cert.issuer}</DetailLine>
              <DetailLine className={design.meta}>{[
                cert.date ? `Issued: ${cert.date}` : '',
                cert.expiryDate ? `Expires: ${cert.expiryDate}` : '',
                cert.credentialId ? `Credential ID: ${cert.credentialId}` : '',
              ].filter(Boolean).join(' | ')}</DetailLine>
              {cert.url && <p className={design.meta}><LinkText url={cert.url} /></p>}
            </article>
          ))}
        </div>
      );
    case 'skills': {
      const grouped = cv.skills.reduce((acc, skill) => {
        const category = skill.category || 'Skills';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);

      return (
        <div className="space-y-3">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category} className="break-inside-avoid">
              <p className="mb-2 text-sm font-semibold">{category}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className={design.chip} style={cv.template === 'creative' ? { backgroundColor: accent } : undefined}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    case 'languages':
      return (
        <div className="flex flex-wrap gap-2">
          {cv.languages.map((language) => (
            <span key={language.id} className={design.chip}>{language.language}: {language.proficiency}</span>
          ))}
        </div>
      );
    case 'achievements':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.achievements.map((achievement) => (
            <article key={achievement.id} className={design.item}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{achievement.title}</h3>
                <DetailLine className={design.meta}>{achievement.date}</DetailLine>
              </div>
              {achievement.description && <p className="text-sm leading-relaxed text-slate-700">{achievement.description}</p>}
            </article>
          ))}
        </div>
      );
    case 'volunteers':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.volunteers.map((volunteer) => (
            <article key={volunteer.id} className={design.item}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{volunteer.role || volunteer.organization}</h3>
                <DetailLine className={design.meta}>{formatDateRange(volunteer.startDate, volunteer.endDate, volunteer.current, cv.language, 'MMM yyyy')}</DetailLine>
              </div>
              <DetailLine className={design.meta}>{volunteer.organization}</DetailLine>
              {volunteer.description && <p className="text-sm leading-relaxed text-slate-700">{volunteer.description}</p>}
            </article>
          ))}
        </div>
      );
    case 'publications':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.publications.map((publication) => (
            <article key={publication.id} className={design.item}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{publication.title || publication.publisher}</h3>
                <DetailLine className={design.meta}>{publication.date}</DetailLine>
              </div>
              <DetailLine className={design.meta}>{publication.publisher}</DetailLine>
              {publication.description && <p className="text-sm leading-relaxed text-slate-700">{publication.description}</p>}
              {publication.url && <p className={design.meta}><LinkText url={publication.url} /></p>}
            </article>
          ))}
        </div>
      );
    case 'references':
      return (
        <div className={spacings[cv.spacing].item}>
          {cv.references.map((reference) => (
            <article key={reference.id} className={design.item}>
              <h3 className="font-semibold">{reference.name}</h3>
              <DetailLine className={design.meta}>{[
                reference.relationship,
                reference.position || reference.company ? `${reference.position}${reference.company ? ` at ${reference.company}` : ''}` : '',
              ].filter(Boolean).join(' | ')}</DetailLine>
              <DetailLine className={design.meta}>{[reference.email, reference.phone].filter(Boolean).join(' | ')}</DetailLine>
            </article>
          ))}
        </div>
      );
    case 'custom': {
      const custom = cv.customSections.find((item) => item.id === section.id);
      return (
        <div className="space-y-2 text-sm leading-relaxed text-slate-700">
          {textBlock(custom?.content).map((line, index) => <p key={`${section.id}-${index}`}>{line}</p>)}
        </div>
      );
    }
    default:
      return null;
  }
}

export function CVTemplateRenderer({ cv }: CVTemplateRendererProps) {
  const design = designs[cv.template] || designs.modern;
  const accentDef = getAccentColor(cv.accentColor);
  const templateStyle = getTemplateStyle(cv.fontFamily, cv.fontSize);
  const orderedSections = getOrderedSections(cv);
  const name = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`.trim() || cv.name;
  const contactItems = [
    cv.personalInfo.email,
    cv.personalInfo.phone,
    cv.personalInfo.location,
    ...getPersonalLinks(cv.personalInfo).map((link) => link.display),
  ].filter(Boolean);
  const canUseDoubleLayout = cv.layout === 'double' && templateSupportsDoubleLayout(cv.template);
  const paddingClass = cv.template === 'compact' ? 'p-8' : spacings[cv.spacing].padding;

  return (
    <article
      className={cx('cv-template w-[210mm] min-h-[297mm]', paddingClass, design.page)}
      style={{ ...templateStyle } as CSSProperties}
    >
      <header className={design.header} style={design.headerStyle?.(accentDef.hex, accentDef.hexLight)}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className={design.name}>{name}</h1>
            {cv.personalInfo.headline && <p className={design.headline}>{cv.personalInfo.headline}</p>}
            {contactItems.length > 0 && (
              <div className={design.contact}>
                {contactItems.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
              </div>
            )}
          </div>
          {cv.showPhoto && cv.personalInfo.photo && (
            <img src={cv.personalInfo.photo} alt="" className={design.photo} />
          )}
        </div>
      </header>

      <div
        className={cx(design.body, canUseDoubleLayout && 'md:columns-2 md:gap-8', !canUseDoubleLayout && 'space-y-6', canUseDoubleLayout && 'space-y-5')}
        style={canUseDoubleLayout ? { columnFill: 'balance' } : undefined}
      >
        {orderedSections.map((section) => (
          <SectionShell key={section.id} section={section} design={design} accent={accentDef.hex}>
            {renderSection(section, cv, design, accentDef.hex)}
          </SectionShell>
        ))}
      </div>
    </article>
  );
}

export function CVPreview() {
  const { currentCV } = useCV();

  if (!currentCV) return null;

  return (
    <div className="flex justify-center p-8">
      <div id="cv-preview" className="bg-white shadow-2xl">
        <CVTemplateRenderer cv={currentCV} />
      </div>
    </div>
  );
}
