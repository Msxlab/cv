import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function ElegantTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'serif', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} bg-white`} style={style}>
      {/* Elegant Header */}
      <div className={`text-center ${sp.section}`}>
        {cv.showPhoto && personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover mx-auto mb-4" style={{ borderWidth: '3px', borderColor: c.hex, borderStyle: 'solid' }} />
        )}
        <h1 className="text-4xl font-light tracking-wider" style={{ letterSpacing: '0.2em' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.headline && (
          <p className="text-sm mt-2 italic" style={{ color: c.hex }}>{personalInfo.headline}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-500 text-xs mt-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex items-center gap-2 justify-center mt-3">
          <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '40' }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: c.hex }} />
          <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '40' }} />
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={sp.section}>
          <p className="text-gray-600 leading-relaxed text-center italic">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className={sp.section}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.hex, letterSpacing: '0.2em' }}>Experience</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
          </div>
          <div className={sp.item}>
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-xs italic" style={{ color: c.hex }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                  </span>
                </div>
                {exp.responsibilities.length > 0 && (
                  <ul className="mt-1 space-y-0.5 ml-4">
                    {exp.responsibilities.map((r, i) => r && (
                      <li key={i} className="text-gray-600 text-xs list-disc">{r}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="mt-0.5 space-y-0.5 ml-4">
                    {exp.achievements.map((a, i) => a && (
                      <li key={i} className="text-gray-700 text-xs list-disc font-medium">{a}</li>
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
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.hex, letterSpacing: '0.2em' }}>Education</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
          </div>
          <div className={sp.item}>
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-xs italic" style={{ color: c.hex }}>{edu.institution}</p>
                  {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className={sp.section}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.hex, letterSpacing: '0.2em' }}>Skills</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
          </div>
          <div className="space-y-1">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, typeof skills>)
            ).map(([category, categorySkills]) => (
              <p key={category} className="text-xs text-gray-700">
                <span className="font-semibold italic" style={{ color: c.hex }}>{category}: </span>
                {categorySkills.map(s => s.name).join(' · ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className={sp.section}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.hex, letterSpacing: '0.2em' }}>Projects</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
          </div>
          <div className={sp.item}>
            {projects.map(p => (
              <div key={p.id}>
                <h3 className="font-semibold text-sm">{p.name}</h3>
                {p.role && <p className="text-xs italic" style={{ color: c.hex }}>{p.role}</p>}
                <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>
                {p.technologies.length > 0 && <p className="text-xs text-gray-400 mt-0.5">{p.technologies.join(', ')}</p>}
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
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.hex, letterSpacing: '0.15em' }}>Certifications</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
              </div>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-1">
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-xs text-gray-500 italic">{cert.issuer}{cert.date ? ` · ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: c.hex, letterSpacing: '0.15em' }}>Languages</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: c.hex + '30' }} />
              </div>
              {languages.map(lang => (
                <p key={lang.id} className="text-xs mb-0.5">
                  <span className="font-semibold">{lang.language}</span> — <span className="italic text-gray-500 capitalize">{lang.proficiency}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
