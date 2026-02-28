import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function ExecutiveTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'amber'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

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
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-300 text-xs">
              {personalInfo.email && <span className="flex items-center gap-1">✉ {personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1">✆ {personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1">⊙ {personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1">in LinkedIn</span>}
              {personalInfo.github && <span className="flex items-center gap-1">⊞ GitHub</span>}
              {personalInfo.website && <span className="flex items-center gap-1">⌂ {personalInfo.website.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Accent bar */}
      <div className="h-1" style={{ backgroundColor: c.hex }} />

      {/* Content */}
      <div className="px-12 py-8 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Executive Summary</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <p className="text-gray-700 leading-relaxed border-l-4 pl-4 italic" style={{ borderColor: c.hex }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Career History</h2>
              <div className="flex-1 h-px" style={{ backgroundColor: c.hex }} />
            </div>
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-5 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: c.hex }} />
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{exp.position}</h3>
                      <p className="text-slate-600 font-medium">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-white bg-slate-700 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
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
        )}

        {/* Two columns: Education + Skills */}
        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Education</h2>
                <div className="flex-1 h-px bg-amber-400" />
              </div>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    {edu.field && <p className="text-slate-700 text-xs">{edu.field}</p>}
                    <p className="text-slate-500 text-xs">{edu.institution}</p>
                    <p className="text-amber-600 text-xs font-medium mt-1">
                      {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                    </p>
                    {edu.gpa && <p className="text-slate-500 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Core Competencies</h2>
                <div className="flex-1 h-px bg-amber-400" />
              </div>
              <div className="space-y-2">
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
                        <span key={s.id} className="px-2 py-0.5 bg-slate-900 text-white text-xs rounded">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Key Projects</h2>
              <div className="flex-1 h-px bg-amber-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {projects.map(project => (
                <div key={project.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="font-bold text-slate-900">{project.name}</p>
                  {project.role && <p className="text-amber-600 text-xs font-medium">{project.role}</p>}
                  <p className="text-gray-700 text-xs mt-1">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Languages */}
        {(certifications.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-2 gap-8">
            {certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Certifications</h2>
                  <div className="flex-1 h-px bg-amber-400" />
                </div>
                <div className="space-y-1">
                  {certifications.map(cert => (
                    <div key={cert.id} className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">◆</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">{cert.name}</p>
                        <p className="text-slate-500 text-xs">{cert.issuer}{cert.date ? ` • ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xs font-bold uppercase text-slate-900 tracking-widest" style={{ letterSpacing: '0.2em' }}>Languages</h2>
                  <div className="flex-1 h-px bg-amber-400" />
                </div>
                <div className="space-y-1">
                  {languages.map(lang => (
                    <div key={lang.id} className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900 text-xs">{lang.language}</span>
                      <span className="text-amber-700 text-xs capitalize font-medium">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
