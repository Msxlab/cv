import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function CreativeTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className="w-[210mm] min-h-[297mm] text-sm bg-white" style={style}>
      {/* Bold colorful header */}
      <div className="px-10 py-7 text-white" style={{ background: `linear-gradient(135deg, ${c.hex}, ${c.hex}aa)` }}>
        <div className="flex items-center gap-5">
          {cv.showPhoto && personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold leading-none mb-1">
              {personalInfo.firstName} <span className="text-white/70">{personalInfo.lastName}</span>
            </h1>
            {personalInfo.headline && (
              <p className="text-white/80 text-base font-medium mb-2">{personalInfo.headline}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/70 text-xs">
              {personalInfo.email && <span>✉ {personalInfo.email}</span>}
              {personalInfo.phone && <span>✆ {personalInfo.phone}</span>}
              {personalInfo.location && <span>⊙ {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>in LinkedIn</span>}
              {personalInfo.github && <span>⎔ GitHub</span>}
              {personalInfo.website && <span>⌂ {personalInfo.website.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Accent strip */}
      <div className="h-2" style={{ backgroundColor: c.hex + '80' }} />

      <div className="grid grid-cols-3 min-h-[calc(297mm-80px)]">
        {/* Left sidebar (1/3) */}
        <div className="col-span-1 px-5 py-6 space-y-5" style={{ backgroundColor: c.hex + '0a' }}>
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: c.hex }}>
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c.hex }} />
                About
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: c.hex }}>
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c.hex }} />
                Skills
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
                    <p className="text-xs font-semibold mb-1" style={{ color: c.hex }}>{category}</p>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.map(s => (
                        <span key={s.id} className="text-xs px-2 py-0.5 bg-white border rounded-full" style={{ borderColor: c.hex + '30', color: c.hex }}>
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
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: c.hex }}>
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c.hex + '80' }} />
                Languages
              </h2>
              <div className="space-y-1">
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-800">{lang.language}</span>
                    <span className="text-xs capitalize bg-white px-1.5 py-0.5 rounded-full border" style={{ color: c.hex, borderColor: c.hex + '30' }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: c.hex }}>
                <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c.hex }} />
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map(cert => (
                  <div key={cert.id} className="bg-white rounded-lg p-2 border" style={{ borderColor: c.hex + '20' }}>
                    <p className="text-xs font-semibold text-gray-900">{cert.name}</p>
                    <p className="text-xs" style={{ color: c.hex }}>{cert.issuer}</p>
                    {cert.date && <p className="text-xs text-gray-400">{safeFormat(cert.date, 'MMM yyyy')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main (2/3) */}
        <div className="col-span-2 px-6 py-6 space-y-5">
          {/* Experience */}
          {experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3 pb-1 border-b-2 flex items-center gap-2" style={{ color: c.hex, borderColor: c.hex + '30' }}>
                <span className="w-4 h-4 border-2 rounded inline-block" style={{ backgroundColor: c.hex + '15', borderColor: c.hex }} />
                Experience
              </h2>
              <div className="space-y-4">
                {experiences.map(exp => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: c.hex + '30' }}>
                    <div className="absolute w-2.5 h-2.5 rounded-full -left-[7px] top-1.5" style={{ backgroundColor: c.hex }} />
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <p className="font-medium text-xs" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap ml-3 border" style={{ color: c.hex, backgroundColor: c.hex + '0a', borderColor: c.hex + '30' }}>
                        {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Now' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                      </span>
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul className="space-y-0.5 mt-1">
                        {exp.responsibilities.map((resp, idx) => resp && (
                          <li key={idx} className="flex items-start gap-1.5 text-gray-700 text-xs">
                            <span className="mt-0.5 flex-shrink-0" style={{ color: c.hex }}>◆</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="space-y-0.5 mt-1">
                        {exp.achievements.map((ach, idx) => ach && (
                          <li key={idx} className="flex items-start gap-1.5 text-gray-700 text-xs font-medium">
                            <span className="mt-0.5 flex-shrink-0" style={{ color: c.hex }}>★</span>
                            <span>{ach}</span>
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
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3 pb-1 border-b-2 flex items-center gap-2" style={{ color: c.hex, borderColor: c.hex + '30' }}>
                <span className="w-4 h-4 border-2 rounded inline-block" style={{ backgroundColor: c.hex + '15', borderColor: c.hex }} />
                Education
              </h2>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="rounded-xl p-3 border" style={{ backgroundColor: c.hex + '08', borderColor: c.hex + '20' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                        <p className="text-xs font-medium" style={{ color: c.hex }}>{edu.institution}</p>
                        {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-xs whitespace-nowrap ml-3" style={{ color: c.hex }}>
                        {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Now' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3 pb-1 border-b-2 flex items-center gap-2" style={{ color: c.hex, borderColor: c.hex + '30' }}>
                <span className="w-4 h-4 border-2 rounded inline-block" style={{ backgroundColor: c.hex + '15', borderColor: c.hex }} />
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project.id} className="rounded-xl p-3 border" style={{ backgroundColor: c.hex + '08', borderColor: c.hex + '20' }}>
                    <p className="font-bold text-gray-900">{project.name}</p>
                    {project.role && <p className="text-xs font-medium" style={{ color: c.hex }}>{project.role}</p>}
                    <p className="text-gray-700 text-xs mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="text-xs px-1.5 py-0.5 bg-white border rounded" style={{ borderColor: c.hex + '30', color: c.hex }}>{tech}</span>
                        ))}
                      </div>
                    )}
                    {project.impact && (
                      <p className="text-xs mt-1 font-semibold" style={{ color: c.hex }}>{project.impact}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
