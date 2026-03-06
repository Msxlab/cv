import { CVData } from '../../types/cv';
import { formatDateRange, getDisplayUrl, normalizeUrl, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { getTranslation } from '../../utils/localization';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function ClassicTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, achievements, volunteers, publications, references, customSections } = cv;
  const c = getAccentColor(cv.accentColor || 'slate');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'serif', cv.fontSize || 'medium');
  const t = (key: string) => getTranslation(cv.language || 'en', key);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <div key="summary" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('summary')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <p className="text-gray-800 leading-relaxed text-justify">{personalInfo.summary}</p>
          </div>
        );

      case 'experiences':
        if (experiences.length === 0) return null;
        return (
          <div key="experiences" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('experiences')}
            </h2>
            <hr className="border-t border-black mb-3" />
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-base">{exp.position}</p>
                      <p className="italic text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-gray-600 text-xs whitespace-nowrap ml-4">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                    </p>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5 text-gray-800">
                      {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
                    </ul>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-0.5 space-y-0.5 text-gray-800">
                      {exp.achievements.map((ach, idx) => ach && <li key={idx}>{ach}</li>)}
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
          <div key="education" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('education')}
            </h2>
            <hr className="border-t border-black mb-3" />
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start break-inside-avoid">
                  <div>
                    <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="italic text-gray-700">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-gray-800 mt-1 text-sm">{edu.description}</p>}
                  </div>
                  <p className="text-gray-600 text-xs whitespace-nowrap ml-4">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key="skills" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('skills')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-1">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <p key={category} className="text-gray-800">
                  <span className="font-bold italic">{category}: </span>
                  {categorySkills.map(s => s.name).join(' • ')}
                </p>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key="projects" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('projects')}
            </h2>
            <hr className="border-t border-black mb-3" />
            <div className="space-y-3">
              {projects.map(project => (
                <div key={project.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <p className="font-bold">{project.name}{project.role ? ` — ${project.role}` : ''}</p>
                    {project.url && <a href={normalizeUrl(project.url)} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noreferrer">{getDisplayUrl(project.url)}</a>}
                  </div>
                  <p className="text-gray-800">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-gray-600 text-xs italic">Technologies: {project.technologies.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('certifications')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-1">
              {certifications.map(cert => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{cert.name}</p>
                    <p className="text-gray-600 text-xs italic">{cert.issuer}</p>
                  </div>
                  <p className="text-gray-600 text-xs">{cert.date && safeFormat(cert.date, 'yyyy')}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div key="languages" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('languages')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {languages.map(lang => (
                <p key={lang.id} className="text-gray-800 text-sm">
                  <span className="font-semibold">{lang.language}</span> — <span className="capitalize italic">{lang.proficiency}</span>
                </p>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (achievements.length === 0) return null;
        return (
          <div key="achievements" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('achievements')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-2">
              {achievements.map(ach => (
                <div key={ach.id}>
                  <div className="flex justify-between">
                    <p className="font-bold">{ach.title}</p>
                    <p className="text-xs text-gray-600">{ach.date && safeFormat(ach.date, 'MMM yyyy')}</p>
                  </div>
                  <p className="text-gray-800 text-sm">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteers':
        if (volunteers.length === 0) return null;
        return (
          <div key="volunteers" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('volunteers')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-3">
              {volunteers.map(vol => (
                <div key={vol.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-base">{vol.role}</p>
                      <p className="italic text-gray-700">{vol.organization}</p>
                    </div>
                    <p className="text-gray-600 text-xs whitespace-nowrap ml-4">
                      {formatDateRange(vol.startDate, vol.endDate, vol.current, cv.language, 'MMM yyyy')}
                    </p>
                  </div>
                  <p className="text-gray-800 leading-relaxed mt-1 text-sm">{vol.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'publications':
        if (publications.length === 0) return null;
        return (
          <div key="publications" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('publications')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-2">
              {publications.map(pub => (
                <div key={pub.id}>
                  <div className="flex justify-between">
                    <p className="font-bold">{pub.title}</p>
                    <p className="text-xs text-gray-600">{pub.date && safeFormat(pub.date, 'MMM yyyy')}</p>
                  </div>
                  <p className="italic text-gray-700 text-sm">{pub.publisher}</p>
                  {pub.description && <p className="text-gray-800 text-sm mt-0.5">{pub.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'references':
        if (references.length === 0) return null;
        return (
          <div key="references" className="mb-5 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              {t('references')}
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="grid grid-cols-2 gap-4">
              {references.map(ref => (
                <div key={ref.id}>
                  <p className="font-bold">{ref.name}</p>
                  <p className="italic text-gray-700 text-sm">{ref.position} at {ref.company}</p>
                  <p className="text-gray-600 text-xs mt-1">{ref.email}</p>
                  {ref.phone && <p className="text-gray-600 text-xs">{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        const customSec = customSections?.find(c => c.id === sectionId);
        if (customSec) {
          return (
            <div key={customSec.id} className="mb-5 break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
                {customSec.title}
              </h2>
              <hr className="border-t border-black mb-2" />
              <div className="text-gray-800 whitespace-pre-wrap">{customSec.content}</div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} text-sm bg-white`} style={style}>
      {/* Header - Centered */}
      <div className="text-center mb-6">
        {cv.showPhoto && personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 mx-auto mb-3"
            style={{ borderColor: c.hex }}
          />
        )}
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-1" style={{ letterSpacing: '0.15em' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.headline && (
          <p className="text-base text-gray-600 mb-2 italic">{personalInfo.headline}</p>
        )}
        <TemplateContactList
          personalInfo={personalInfo}
          language={cv.language}
          accentColor={c.hex}
          className="justify-center text-gray-600 text-xs"
          itemClassName="text-xs"
          separator="•"
        />
      </div>

      <hr className="border-t-2 mb-6" style={{ borderColor: c.hex }} />

      {cv.layout === 'double' ? (
        <div className="grid grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-1">
            {cv.sectionOrder.filter(s => ['summary', 'experiences', 'projects', 'volunteers', 'publications', 'references'].includes(s) || customSections?.some(c => c.id === s)).map(renderSection)}
          </div>
          <div className="space-y-1 border-l border-gray-300 pl-6">
            {cv.sectionOrder.filter(s => ['education', 'skills', 'certifications', 'languages', 'achievements'].includes(s)).map(renderSection)}
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {cv.sectionOrder.map(renderSection)}
        </div>
      )}
    </div>
  );
}
