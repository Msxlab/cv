import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function MetroTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue') || accentColors['blue'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] bg-gray-50`} style={style}>
      {/* Metro Tile Header */}
      <div className="grid grid-cols-4 gap-0.5">
        <div className="col-span-2 p-6 text-white" style={{ backgroundColor: c.hex }}>
          <h1 className="text-3xl font-bold leading-tight">{personalInfo.firstName}</h1>
          <h1 className="text-3xl font-light leading-tight">{personalInfo.lastName}</h1>
          {personalInfo.headline && (
            <p className="text-sm text-white/80 mt-2 uppercase tracking-wider">{personalInfo.headline}</p>
          )}
        </div>
        <div className="p-4 text-white flex flex-col justify-center" style={{ backgroundColor: c.hex + 'cc' }}>
          {personalInfo.email && <p className="text-xs mb-1 break-all">{personalInfo.email}</p>}
          {personalInfo.phone && <p className="text-xs mb-1">{personalInfo.phone}</p>}
          {personalInfo.location && <p className="text-xs">{personalInfo.location}</p>}
        </div>
        <div className="p-4 flex items-center justify-center" style={{ backgroundColor: c.hex + '99' }}>
          {cv.showPhoto && personalInfo.photo ? (
            <img src={personalInfo.photo} alt="Profile" className="w-20 h-20 rounded object-cover" />
          ) : (
            <div className="text-white text-center text-xs space-y-1">
              {personalInfo.linkedin && <p>LinkedIn</p>}
              {personalInfo.github && <p>GitHub</p>}
              {personalInfo.website && <p className="break-all">{personalInfo.website.replace(/^https?:\/\//, '')}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: c.hex + '08', borderLeft: `4px solid ${c.hex}` }}>
            <p className="text-gray-600 leading-relaxed text-sm">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c.hex }}>W</div>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: c.hex }}>Experience</h2>
            </div>
            <div className="space-y-4 ml-10">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-xs" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                      {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs">• {r}</li>
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
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c.hex }}>E</div>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: c.hex }}>Education</h2>
            </div>
            <div className="space-y-2 ml-10">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-xs" style={{ color: c.hex }}>{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                    {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metro Tiles for Skills, Languages, Certs */}
        <div className="grid grid-cols-3 gap-3">
          {skills.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: c.hex + '0a' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Skills</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map(s => (
                  <span key={s.id} className="text-xs px-2 py-0.5 rounded text-white" style={{ backgroundColor: c.hex }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: c.hex + '0a' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Languages</h2>
              {languages.map(lang => (
                <p key={lang.id} className="text-xs mb-0.5">
                  <span className="font-semibold">{lang.language}</span> — <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                </p>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: c.hex + '0a' }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-1">
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-xs text-gray-400">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects as tiles */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c.hex }}>P</div>
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: c.hex }}>Projects</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 ml-10">
              {projects.map(p => (
                <div key={p.id} className="p-3 rounded-lg border" style={{ borderColor: c.hex + '20' }}>
                  <h3 className="font-bold text-xs">{p.name}</h3>
                  {p.role && <p className="text-xs" style={{ color: c.hex }}>{p.role}</p>}
                  <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: c.hex + '15', color: c.hex }}>{t}</span>
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
