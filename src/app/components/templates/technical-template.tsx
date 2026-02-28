import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function TechnicalTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'emerald'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className="w-[210mm] min-h-[297mm] text-sm bg-white flex" style={style}>
      {/* Sidebar */}
      <div className="w-[68mm] text-white flex-shrink-0 p-6 space-y-5" style={{ backgroundColor: c.hex + 'e6' }}>
        {/* Photo */}
        {cv.showPhoto && personalInfo.photo && (
          <div className="flex justify-center">
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/40"
            />
          </div>
        )}

        {/* Name + Title */}
        <div>
          <h1 className="text-xl font-bold leading-tight">
            {personalInfo.firstName}
            <br />{personalInfo.lastName}
          </h1>
          {personalInfo.headline && (
            <p className="text-white/70 text-xs mt-1 font-medium">{personalInfo.headline}</p>
          )}
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 pb-1 border-b border-white/20">
            Contact
          </h2>
          <div className="space-y-1 text-xs text-white/90">
            {personalInfo.email && (
              <div className="break-all">
                <span className="text-white/50 block text-xs">Email</span>
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <span className="text-white/50 block text-xs">Phone</span>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div>
                <span className="text-white/50 block text-xs">Location</span>
                {personalInfo.location}
              </div>
            )}
            {personalInfo.github && (
              <div>
                <span className="text-white/50 block text-xs">GitHub</span>
                <span className="break-all">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <span className="text-white/50 block text-xs">LinkedIn</span>
                <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
              </div>
            )}
            {personalInfo.website && (
              <div>
                <span className="text-white/50 block text-xs">Website</span>
                <span className="break-all">{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 pb-1 border-b border-white/20">
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
                  <p className="text-white/70 text-xs font-semibold mb-1">{category}</p>
                  <div className="flex flex-wrap gap-1">
                    {categorySkills.map(s => (
                      <span key={s.id} className="text-xs bg-white/15 text-white/90 px-1.5 py-0.5 rounded">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 pb-1 border-b border-white/20">
              Languages
            </h2>
            <div className="space-y-1">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center text-xs">
                  <span className="text-white">{lang.language}</span>
                  <span className="text-white/60 capitalize">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 pb-1 border-b border-white/20">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <p className="text-white text-xs font-semibold">{cert.name}</p>
                  <p className="text-white/60 text-xs">{cert.issuer}</p>
                  {cert.date && <p className="text-white/50 text-xs">{safeFormat(cert.date, 'MMM yyyy')}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-7 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b-2 pb-1" style={{ color: c.hex, borderColor: c.hex }}>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: c.hex, borderColor: c.hex }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="font-medium text-xs" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-3 font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {exp.startDate && safeFormat(exp.startDate, 'MM/yyyy')} – {exp.current ? 'now' : exp.endDate && safeFormat(exp.endDate, 'MM/yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.responsibilities.map((resp, idx) => resp && (
                        <li key={idx} className="flex items-start gap-1.5 text-gray-700 text-xs">
                          <span className="mt-1 flex-shrink-0" style={{ color: c.hex }}>›</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: c.hex, borderColor: c.hex }}>
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map(project => (
                <div key={project.id} className="border-l-2 pl-3" style={{ borderColor: c.hex + '60' }}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-xs">{project.name}</h3>
                    {project.url && (
                      <span className="text-xs font-mono" style={{ color: c.hex }}>↗</span>
                    )}
                  </div>
                  {project.role && <p className="text-xs" style={{ color: c.hex }}>{project.role}</p>}
                  <p className="text-gray-700 text-xs mt-0.5">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200">{tech}</span>
                      ))}
                    </div>
                  )}
                  {project.impact && <p className="text-xs mt-1 font-medium" style={{ color: c.hex }}>{project.impact}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: c.hex, borderColor: c.hex }}>
              Education
            </h2>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-900 text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-xs" style={{ color: c.hex }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-3 font-mono">
                    {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'now' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
