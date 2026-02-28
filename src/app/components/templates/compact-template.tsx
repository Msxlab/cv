import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function CompactTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'blue'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', 'small');

  return (
    <div className="w-[210mm] min-h-[297mm] p-6 bg-white text-xs" style={style}>
      {/* Compact Header */}
      <div className="mb-3 pb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
        <div className="flex items-center gap-3">
          {cv.showPhoto && personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover flex-shrink-0" style={{ borderWidth: '2px', borderColor: c.hex, borderStyle: 'solid' }} />
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold leading-tight">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.headline && (
              <p className="text-xs" style={{ color: c.hex }}>{personalInfo.headline}</p>
            )}
          </div>
          <div className="text-right text-xs text-gray-500 space-y-0.5">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
          </div>
        </div>
      </div>

      {/* Summary - condensed */}
      {personalInfo.summary && (
        <div className="mb-3">
          <p className="text-gray-600 leading-snug text-xs">{personalInfo.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Left 2/3 - Experience, Education, Projects */}
        <div className="col-span-2 space-y-3">
          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Experience</h2>
              <div className="space-y-2">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-xs">{exp.position}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {exp.startDate && safeFormat(exp.startDate, 'MM/yy')} – {exp.current ? 'Now' : exp.endDate && safeFormat(exp.endDate, 'MM/yy')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    {exp.responsibilities.length > 0 && (
                      <ul className="mt-0.5 space-y-0">
                        {exp.responsibilities.map((r, i) => r && (
                          <li key={i} className="text-gray-600 text-xs leading-snug">· {r}</li>
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
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Education</h2>
              <div className="space-y-1">
                {education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                      <span className="text-gray-500 text-xs"> — {edu.institution}</span>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Now' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Projects</h2>
              <div className="space-y-1.5">
                {projects.map(p => (
                  <div key={p.id}>
                    <h3 className="font-bold text-xs">{p.name}{p.role ? ` — ${p.role}` : ''}</h3>
                    <p className="text-gray-600 text-xs leading-snug">{p.description}</p>
                    {p.technologies.length > 0 && <p className="text-xs text-gray-400">{p.technologies.join(', ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1/3 - Skills, Certs, Languages */}
        <div className="space-y-3">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Skills</h2>
              <div className="space-y-1">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category}>
                    <p className="font-semibold text-xs" style={{ color: c.hex }}>{category}</p>
                    <p className="text-gray-600 text-xs leading-snug">{categorySkills.map(s => s.name).join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-1">
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-xs text-gray-400">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Languages</h2>
              {languages.map(lang => (
                <p key={lang.id} className="text-xs"><span className="font-semibold">{lang.language}</span> <span className="text-gray-400 capitalize">({lang.proficiency})</span></p>
              ))}
            </div>
          )}

          {/* Links */}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-0.5 mb-1.5" style={{ color: c.hex, borderBottomWidth: '1px', borderBottomColor: c.hex + '40', borderBottomStyle: 'solid' }}>Links</h2>
              {personalInfo.linkedin && <p className="text-xs text-gray-600">LinkedIn</p>}
              {personalInfo.github && <p className="text-xs text-gray-600">GitHub</p>}
              {personalInfo.website && <p className="text-xs text-gray-600">{personalInfo.website.replace(/^https?:\/\//, '')}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
