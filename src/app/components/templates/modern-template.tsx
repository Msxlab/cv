import { CVData } from '../../types/cv';
import { Mail, Phone } from 'lucide-react';
import { formatDateRange, getDisplayUrl, normalizeUrl, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { getTranslation } from '../../utils/localization';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function ModernTemplate({ cv }: TemplateProps) {
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
          <div key="summary" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('summary')}
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        );
        
      case 'experiences':
        if (experiences.length === 0) return null;
        return (
          <div key="experiences" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('experiences')}
            </h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-base">{exp.position}</h3>
                      <p className="text-gray-600">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-gray-500 text-sm whitespace-nowrap ml-4">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                    </div>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 mt-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="font-medium">{ach}</li>
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
          <div key="education" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('education')}
            </h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                      {edu.description && <p className="text-gray-700 mt-1 text-sm">{edu.description}</p>}
                    </div>
                    <div className="text-gray-500 text-sm whitespace-nowrap ml-4">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'skills':
        if (skills.length === 0) return null;
        return (
          <div key="skills" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('skills')}
            </h2>
            <div className="space-y-2">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <div key={category}>
                  <span className="font-semibold">{category}:</span>{' '}
                  <span className="text-gray-700">
                    {categorySkills.map(s => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'projects':
        if (projects.length === 0) return null;
        return (
          <div key="projects" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('projects')}
            </h2>
            <div className="space-y-3">
              {projects.map(project => (
                <div key={project.id}>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-gray-600 text-sm">{project.role}</p>
                  <p className="text-gray-700 mt-1">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Technologies:</span>{' '}
                      {project.technologies.join(', ')}
                    </p>
                  )}
                  {project.url && (
                    <a href={normalizeUrl(project.url)} className="text-sm mt-1 inline-block hover:underline" style={{ color: c.hex }} target="_blank" rel="noreferrer">
                      {getDisplayUrl(project.url)}
                    </a>
                  )}
                  {project.impact && (
                    <p className="text-sm mt-1" style={{ color: c.hex }}>
                      <span className="font-medium">Impact:</span> {project.impact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'certifications':
        if (certifications.length === 0) return null;
        return (
          <div key="certifications" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('certifications')}
            </h2>
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {cert.issuer} • {cert.date && safeFormat(cert.date, 'MMM yyyy')}
                  </p>
                  {cert.url && (
                    <a href={normalizeUrl(cert.url)} className="text-sm hover:underline" style={{ color: c.hex }} target="_blank" rel="noreferrer">
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'languages':
        if (languages.length === 0) return null;
        return (
          <div key="languages" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('languages')}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {languages.map(lang => (
                <div key={lang.id}>
                  <span className="font-semibold">{lang.language}:</span>{' '}
                  <span className="text-gray-700 capitalize">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'achievements':
        if (achievements.length === 0) return null;
        return (
          <div key="achievements" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('achievements')}
            </h2>
            <div className="space-y-3">
              {achievements.map(ach => (
                <div key={ach.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{ach.title}</h3>
                    <span className="text-gray-500 text-sm whitespace-nowrap ml-4">
                      {ach.date && safeFormat(ach.date, 'MMM yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'volunteers':
        if (volunteers.length === 0) return null;
        return (
          <div key="volunteers" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('volunteers')}
            </h2>
            <div className="space-y-4">
              {volunteers.map(vol => (
                <div key={vol.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-base">{vol.role}</h3>
                      <p className="text-gray-600">{vol.organization}</p>
                    </div>
                    <div className="text-gray-500 text-sm whitespace-nowrap ml-4">
                      {formatDateRange(vol.startDate, vol.endDate, vol.current, cv.language, 'MMM yyyy')}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-1">{vol.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'publications':
        if (publications.length === 0) return null;
        return (
          <div key="publications" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('publications')}
            </h2>
            <div className="space-y-3">
              {publications.map(pub => (
                <div key={pub.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{pub.title}</h3>
                    <span className="text-gray-500 text-sm whitespace-nowrap ml-4">
                      {pub.date && safeFormat(pub.date, 'MMM yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{pub.publisher}</p>
                  {pub.description && <p className="text-gray-700 mt-1">{pub.description}</p>}
                  {pub.url && (
                    <a href={normalizeUrl(pub.url)} className="text-sm mt-1 inline-block hover:underline" style={{ color: c.hex }} target="_blank" rel="noreferrer">
                      View Publication
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'references':
        if (references.length === 0) return null;
        return (
          <div key="references" className={sp.section}>
            <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
              {t('references')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map(ref => (
                <div key={ref.id}>
                  <h3 className="font-semibold">{ref.name}</h3>
                  <p className="text-gray-600 text-sm">{ref.position} at {ref.company}</p>
                  <div className="text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${ref.email}`} className="hover:underline text-sm">{ref.email}</a>
                    </div>
                    {ref.phone && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{ref.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        // Handle custom sections
        const customSec = customSections?.find(c => c.id === sectionId);
        if (customSec) {
          return (
            <div key={customSec.id} className={sp.section}>
              <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
                {customSec.title}
              </h2>
              <div className="text-gray-700 whitespace-pre-wrap">{customSec.content}</div>
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} text-sm bg-white`} style={style}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6">
          {cv.showPhoto && personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: c.hex }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.headline && (
              <p className="text-xl mb-3" style={{ color: c.hex }}>{personalInfo.headline}</p>
            )}
            <TemplateContactList
              personalInfo={personalInfo}
              language={cv.language}
              accentColor={c.hex}
              className="text-gray-600"
              itemClassName="text-sm"
              showIcons
            />
          </div>
        </div>
      </div>

      {cv.layout === 'double' ? (
        <div className="grid grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            {cv.sectionOrder.filter(s => ['summary', 'experiences', 'projects', 'volunteers', 'publications', 'references'].includes(s) || customSections?.some(c => c.id === s)).map(renderSection)}
          </div>
          <div className="space-y-6 border-l pl-8">
            {cv.sectionOrder.filter(s => ['education', 'skills', 'certifications', 'languages', 'achievements'].includes(s)).map(renderSection)}
          </div>
        </div>
      ) : (
        cv.sectionOrder.map(renderSection)
      )}
    </div>
  );
}
