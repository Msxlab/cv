import { CVData } from '../../types/cv';
import { formatDateRange, getDisplayUrl, normalizeUrl, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { getTranslation } from '../../utils/localization';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function ExecutiveTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, achievements, volunteers, publications, references, customSections } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');
  const t = (key: string) => getTranslation(cv.language || 'en', key);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <div key="summary">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('summary')}</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <p className="text-gray-700 leading-relaxed border-l-4 pl-4 italic" style={{ borderColor: c.hex }}>
              {personalInfo.summary}
            </p>
          </div>
        );

      case 'experiences':
        if (experiences.length === 0) return null;
        return (
          <div key="experiences">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('experiences')}</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-5 border-l-2 border-slate-200 break-inside-avoid">
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: c.hex }} />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{exp.position}</h3>
                      <p className="text-slate-600 font-medium">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-white bg-slate-700 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {exp.responsibilities.map((resp, idx) => resp && (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="mt-1 flex-shrink-0" style={{ color: c.hex }}>▸</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="space-y-1 mt-1">
                      {exp.achievements.map((ach, idx) => ach && (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium">
                          <span className="mt-1 flex-shrink-0" style={{ color: c.hex }}>★</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <div key="education">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('education')}</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100 break-inside-avoid">
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  {edu.field && <p className="text-slate-700 text-xs">{edu.field}</p>}
                  <p className="text-slate-500 text-xs">{edu.institution}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: c.hex }}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                  </p>
                  {edu.gpa && <p className="text-slate-500 text-xs mt-0.5">GPA: {edu.gpa}</p>}
                  {edu.description && <p className="text-slate-700 text-xs mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key="skills">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('skills')}</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-2 break-inside-avoid">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{category}</p>
                  <div className="flex flex-wrap gap-1">
                    {categorySkills.map(s => (
                      <span key={s.id} className="px-2 py-0.5 bg-slate-800 text-white text-xs rounded">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key="projects">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('projects')}</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {projects.map(project => (
                <div key={project.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 break-inside-avoid">
                  <p className="font-bold text-slate-900">{project.name}</p>
                  {project.role && <p className="text-xs font-medium" style={{ color: c.hex }}>{project.role}</p>}
                  <p className="text-gray-700 text-xs mt-1">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-xs rounded" style={{ backgroundColor: `${c.hex}1A`, color: c.hex }}>{tech}</span>
                      ))}
                    </div>
                  )}
                  {project.url && (
                    <a href={normalizeUrl(project.url)} className="text-xs mt-1 inline-block hover:underline" style={{ color: c.hex }} target="_blank" rel="noreferrer">{getDisplayUrl(project.url)}</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <div key="certifications">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('certifications')}</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-1">
              {certifications.map(cert => (
                <div key={cert.id} className="flex items-start gap-2 break-inside-avoid">
                  <span className="mt-0.5" style={{ color: c.hex }}>◆</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">{cert.name}</p>
                    <p className="text-slate-500 text-xs">{cert.issuer}{cert.date ? ` • ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div key="languages">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('languages')}</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-1">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center break-inside-avoid border-b border-slate-100 pb-1">
                  <span className="font-semibold text-slate-900 text-xs">{lang.language}</span>
                  <span className="text-xs capitalize font-medium" style={{ color: c.hex }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (achievements.length === 0) return null;
        return (
          <div key="achievements">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('achievements')}</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <div className="space-y-2">
              {achievements.map(ach => (
                <div key={ach.id} className="break-inside-avoid">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm text-slate-900">{ach.title}</p>
                    <span className="text-xs text-slate-500">{ach.date && safeFormat(ach.date, 'MMM yyyy')}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteers':
        if (volunteers.length === 0) return null;
        return (
          <div key="volunteers">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('volunteers')}</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <div className="space-y-3">
              {volunteers.map(vol => (
                <div key={vol.id} className="break-inside-avoid relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1" style={{ backgroundColor: c.hex }} />
                  <div className="flex justify-between items-start mb-0.5">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{vol.role}</h3>
                      <p className="text-slate-600 text-xs font-medium">{vol.organization}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDateRange(vol.startDate, vol.endDate, vol.current, cv.language, 'MMM yyyy')}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs mt-1">{vol.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'publications':
        if (publications.length === 0) return null;
        return (
          <div key="publications">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('publications')}</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <div className="space-y-2">
              {publications.map(pub => (
                <div key={pub.id} className="break-inside-avoid">
                  <div className="flex justify-between">
                    <p className="font-bold text-slate-900">{pub.title}</p>
                    <p className="text-xs text-slate-500">{pub.date && safeFormat(pub.date, 'MMM yyyy')}</p>
                  </div>
                  <p className="italic text-slate-600 text-xs">{pub.publisher}</p>
                  {pub.description && <p className="text-slate-700 text-xs mt-0.5">{pub.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'references':
        if (references.length === 0) return null;
        return (
          <div key="references">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{t('references')}</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {references.map(ref => (
                <div key={ref.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 break-inside-avoid">
                  <p className="font-bold text-slate-900">{ref.name}</p>
                  <p className="text-xs text-slate-600 font-medium">{ref.position} @ {ref.company}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">✉ {ref.email}</p>
                    {ref.phone && <p className="text-xs text-slate-500 flex items-center gap-1">✆ {ref.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const customSec = customSections?.find(c => c.id === sectionId);
        if (customSec) {
          return (
            <div key={customSec.id}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>{customSec.title}</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
              </div>
              <div className="text-slate-700 whitespace-pre-wrap text-sm break-inside-avoid">{customSec.content}</div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="w-[210mm] min-h-[297mm] text-sm bg-white" style={style}>
      {/* Dark Header */}
      <div className="bg-slate-900 text-white px-12 py-8">
        <div className="flex items-center gap-6">
          {cv.showPhoto && personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 flex-shrink-0"
              style={{ borderColor: c.hex }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-light tracking-wide mb-1">
              <span className="font-bold">{personalInfo.firstName}</span> {personalInfo.lastName}
            </h1>
            {personalInfo.headline && (
              <p className="text-lg font-medium mb-3 tracking-wider uppercase" style={{ letterSpacing: '0.12em', color: c.hex }}>
                {personalInfo.headline}
              </p>
            )}
            <TemplateContactList
              personalInfo={personalInfo}
              language={cv.language}
              accentColor={c.hex}
              theme="dark"
              className="text-slate-300 text-xs"
              itemClassName="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Accent bar */}
      <div className="h-1" style={{ backgroundColor: c.hex }} />

      {/* Content */}
      <div className="px-12 py-8">
        {cv.layout === 'double' ? (
          <div className="grid grid-cols-[2fr_1fr] gap-10">
            <div className="space-y-6">
              {cv.sectionOrder.filter(s => ['summary', 'experiences', 'projects', 'volunteers', 'publications', 'achievements'].includes(s) || customSections?.some(cs => cs.id === s)).map(renderSection)}
            </div>
            <div className="space-y-6">
              {cv.sectionOrder.filter(s => ['education', 'skills', 'certifications', 'languages', 'references'].includes(s)).map(renderSection)}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {cv.sectionOrder.map(renderSection)}
          </div>
        )}
      </div>
    </div>
  );
}
