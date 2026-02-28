import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function TimelineTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'blue'] || accentColors['blue'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} bg-white`} style={style}>
      {/* Header */}
      <div className="flex items-center gap-6 mb-6 pb-4" style={{ borderBottomWidth: '3px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
        {cv.showPhoto && personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: c.hex }} />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h1>
          {personalInfo.headline && <p className="text-base mt-1" style={{ color: c.hex }}>{personalInfo.headline}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500 text-xs mt-2">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={sp.section}>
          <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Timeline Experience */}
      {experiences.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: c.hex }}>Experience</h2>
          <div className="relative ml-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: c.hex + '30' }} />
            <div className="space-y-5">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full -ml-[5px] border-2 bg-white" style={{ borderColor: c.hex }} />
                  <div className="absolute left-5 top-2 w-3 h-px" style={{ backgroundColor: c.hex + '40' }} />
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-1" style={{ backgroundColor: c.hex + '10', color: c.hex }}>
                    {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                  </div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-xs text-gray-500">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs flex items-start gap-1.5">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: c.hex }}>›</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Education */}
      {education.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: c.hex }}>Education</h2>
          <div className="relative ml-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: c.hex + '30' }} />
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-3 h-3 rounded-full -ml-[5px] border-2 bg-white" style={{ borderColor: c.hex }} />
                  <div className="text-xs px-2 py-0.5 rounded-full inline-block mb-0.5" style={{ backgroundColor: c.hex + '10', color: c.hex }}>
                    {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                  </div>
                  <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-xs text-gray-500">{edu.institution}</p>
                  {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-6">
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map(s => (
                <span key={s.id} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: c.hex + '40', color: c.hex }}>{s.name}</span>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Languages</h2>
            {languages.map(lang => (
              <p key={lang.id} className="text-xs mb-0.5"><span className="font-semibold">{lang.language}</span> — <span className="text-gray-500 capitalize">{lang.proficiency}</span></p>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Certifications</h2>
            {certifications.map(cert => (
              <div key={cert.id} className="mb-1">
                <p className="text-xs font-semibold">{cert.name}</p>
                <p className="text-xs text-gray-400">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Projects</h2>
          <div className="grid grid-cols-2 gap-3">
            {projects.map(p => (
              <div key={p.id} className="p-2 rounded-lg border" style={{ borderColor: c.hex + '20' }}>
                <h3 className="font-bold text-xs">{p.name}</h3>
                <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>
                {p.technologies.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: c.hex }}>{p.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
