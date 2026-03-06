import { CVData } from '../../types/cv';
import { formatDateRange, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, spacings, getTemplateStyle } from '../../utils/template-styles';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function MinimalistTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, achievements, volunteers, publications, references } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} bg-white`} style={style}>
      {/* Header - Minimal */}
      <div className={sp.section}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-wide">
              {personalInfo.firstName} <span className="font-semibold">{personalInfo.lastName}</span>
            </h1>
            {personalInfo.headline && (
              <p className="text-base mt-1" style={{ color: c.hex }}>{personalInfo.headline}</p>
            )}
          </div>
          {cv.showPhoto && personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover" style={{ borderColor: c.hex, borderWidth: '2px' }} />
          )}
        </div>
        <TemplateContactList
          personalInfo={personalInfo}
          language={cv.language}
          accentColor={c.hex}
          className="text-gray-500 text-xs mt-3"
          itemClassName="text-xs"
        />
        <div className="mt-4 h-px bg-gray-200" />
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={sp.section}>
          <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Experience</h2>
          <div className={sp.item}>
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{exp.position}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.responsibilities.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.responsibilities.map((r, i) => r && (
                      <li key={i} className="text-gray-600 text-xs pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Education</h2>
          <div className={sp.item}>
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-gray-500 text-xs">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s.id} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: c.hex + '40', color: c.hex }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Projects</h2>
          <div className={sp.item}>
            {projects.map(p => (
              <div key={p.id}>
                <h3 className="font-medium text-sm">{p.name}</h3>
                <p className="text-gray-600 text-xs">{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{p.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages inline */}
      {(certifications.length > 0 || languages.length > 0) && (
        <div className="grid grid-cols-2 gap-8">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-1">
                  <p className="text-xs font-medium">{cert.name}</p>
                  <p className="text-xs text-gray-400">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Languages</h2>
              {languages.map(lang => (
                <p key={lang.id} className="text-xs"><span className="font-medium">{lang.language}</span> — <span className="text-gray-500 capitalize">{lang.proficiency}</span></p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
