import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function BoldTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'red'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white" style={style}>
      {/* Big Bold Header */}
      <div className="px-12 pt-10 pb-6" style={{ backgroundColor: c.hex }}>
        <div className="flex items-end gap-6">
          {cv.showPhoto && personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 flex-shrink-0" />
          )}
          <div className="flex-1 text-white">
            <h1 className="text-5xl font-black leading-none tracking-tight">
              {personalInfo.firstName}
            </h1>
            <h1 className="text-5xl font-black leading-none tracking-tight text-white/70">
              {personalInfo.lastName}
            </h1>
            {personalInfo.headline && (
              <p className="text-lg font-medium text-white/80 mt-2 uppercase tracking-widest">{personalInfo.headline}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-white/70 text-xs mt-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>LinkedIn</span>}
          {personalInfo.github && <span>GitHub</span>}
          {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </div>

      <div className={`px-12 py-8 space-y-6`}>
        {/* Summary */}
        {personalInfo.summary && (
          <div className={sp.section}>
            <p className="text-gray-600 leading-relaxed text-sm border-l-4 pl-4" style={{ borderColor: c.hex }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className={sp.section}>
            <h2 className="text-lg font-black uppercase tracking-wider mb-4" style={{ color: c.hex }}>Experience</h2>
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{exp.position}</h3>
                      <p className="text-sm font-medium" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-white font-bold px-3 py-1 rounded-full whitespace-nowrap ml-4" style={{ backgroundColor: c.hex }}>
                      {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="font-black mt-0.5" style={{ color: c.hex }}>&#9632;</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="mt-1 space-y-1">
                      {exp.achievements.map((a, i) => a && (
                        <li key={i} className="text-gray-700 text-sm font-semibold flex items-start gap-2">
                          <span style={{ color: c.hex }} className="mt-0.5">&#9733;</span>
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

        {/* Two Columns: Education + Skills */}
        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-3" style={{ color: c.hex }}>Education</h2>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="p-3 rounded-xl" style={{ backgroundColor: c.hex + '08' }}>
                    <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-xs" style={{ color: c.hex }}>{edu.institution}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                    </p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider mb-3" style={{ color: c.hex }}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <span key={s.id} className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: c.hex }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div className={sp.section}>
            <h2 className="text-lg font-black uppercase tracking-wider mb-3" style={{ color: c.hex }}>Projects</h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map(p => (
                <div key={p.id} className="p-3 rounded-xl border-2" style={{ borderColor: c.hex + '30' }}>
                  <h3 className="font-bold text-sm">{p.name}</h3>
                  {p.role && <p className="text-xs font-medium" style={{ color: c.hex }}>{p.role}</p>}
                  <p className="text-gray-600 text-xs mt-1">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: c.hex + '15', color: c.hex }}>{t}</span>
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
                <h2 className="text-lg font-black uppercase tracking-wider mb-2" style={{ color: c.hex }}>Certifications</h2>
                {certifications.map(cert => (
                  <div key={cert.id} className="mb-1.5">
                    <p className="text-sm font-bold">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.issuer}{cert.date ? ` · ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider mb-2" style={{ color: c.hex }}>Languages</h2>
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold">{lang.language}</span>
                    <span className="text-xs font-medium capitalize px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: c.hex }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
