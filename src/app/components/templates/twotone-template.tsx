import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function TwoToneTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'slate'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white flex" style={style}>
      {/* Dark Left Panel */}
      <div className="w-[72mm] flex-shrink-0 text-white p-6 space-y-5" style={{ backgroundColor: '#1a1a2e' }}>
        {/* Photo */}
        {cv.showPhoto && personalInfo.photo && (
          <div className="flex justify-center">
            <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: c.hex }} />
          </div>
        )}

        {/* Name */}
        <div className="text-center">
          <h1 className="text-xl font-bold leading-tight">{personalInfo.firstName}</h1>
          <h1 className="text-xl font-light leading-tight">{personalInfo.lastName}</h1>
          {personalInfo.headline && (
            <p className="text-xs mt-2 uppercase tracking-widest font-medium" style={{ color: c.hex }}>{personalInfo.headline}</p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: c.hex + '40' }} />

        {/* Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Contact</h2>
          <div className="space-y-2 text-xs">
            {personalInfo.email && (
              <div>
                <p className="text-white/40 text-xs">Email</p>
                <p className="break-all">{personalInfo.email}</p>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <p className="text-white/40 text-xs">Phone</p>
                <p>{personalInfo.phone}</p>
              </div>
            )}
            {personalInfo.location && (
              <div>
                <p className="text-white/40 text-xs">Location</p>
                <p>{personalInfo.location}</p>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <p className="text-white/40 text-xs">LinkedIn</p>
                <p className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</p>
              </div>
            )}
            {personalInfo.github && (
              <div>
                <p className="text-white/40 text-xs">GitHub</p>
                <p className="break-all">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</p>
              </div>
            )}
            {personalInfo.website && (
              <div>
                <p className="text-white/40 text-xs">Website</p>
                <p className="break-all">{personalInfo.website.replace(/^https?:\/\//, '')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: c.hex + '40' }} />

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Skills</h2>
            <div className="space-y-2">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <div key={category}>
                  <p className="text-xs font-semibold mb-1" style={{ color: c.hex }}>{category}</p>
                  <div className="flex flex-wrap gap-1">
                    {categorySkills.map(s => (
                      <span key={s.id} className="text-xs px-1.5 py-0.5 rounded text-white/90" style={{ backgroundColor: c.hex + '30' }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Languages</h2>
            <div className="space-y-1">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center text-xs">
                  <span>{lang.language}</span>
                  <span className="capitalize" style={{ color: c.hex }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Certifications</h2>
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-xs text-white/50">{cert.issuer}</p>
                  {cert.date && <p className="text-xs" style={{ color: c.hex }}>{safeFormat(cert.date, 'MMM yyyy')}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content - Light */}
      <div className="flex-1 p-7 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <div className={sp.section}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1" style={{ color: c.hex, borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Profile
            </h2>
            <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className={sp.section}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: c.hex, borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Work Experience
            </h2>
            <div className={sp.item}>
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-sm font-medium" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3 px-2 py-0.5 rounded" style={{ backgroundColor: c.hex + '10' }}>
                      {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs flex items-start gap-1.5">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: c.hex }}>&#8250;</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.achievements.map((a, i) => a && (
                        <li key={i} className="text-gray-700 text-xs font-medium flex items-start gap-1.5">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: c.hex }}>&#9733;</span>
                          <span>{a}</span>
                        </li>
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
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: c.hex, borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Education
            </h2>
            <div className={sp.item}>
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-sm" style={{ color: c.hex }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                    {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: c.hex, borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Projects
            </h2>
            <div className={sp.item}>
              {projects.map(p => (
                <div key={p.id} className="pl-3" style={{ borderLeftWidth: '2px', borderLeftColor: c.hex + '40', borderLeftStyle: 'solid' }}>
                  <h3 className="font-bold text-sm">{p.name}</h3>
                  {p.role && <p className="text-xs" style={{ color: c.hex }}>{p.role}</p>}
                  <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: c.hex + '30', color: c.hex }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
