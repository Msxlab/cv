import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function GradientTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue') || accentColors['indigo'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white" style={style}>
      {/* Gradient Header */}
      <div className="px-10 py-8 text-white" style={{ background: `linear-gradient(135deg, ${c.hex}, ${c.hex}88, ${c.hex}44)` }}>
        <div className="flex items-center gap-6">
          {cv.showPhoto && personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20" />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h1>
            {personalInfo.headline && <p className="text-lg text-white/80 mt-1">{personalInfo.headline}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/60 text-xs mt-3">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && <span>LinkedIn</span>}
              {personalInfo.github && <span>GitHub</span>}
              {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient accent strip */}
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent)` }} />

      <div className={`px-10 py-8 space-y-6`}>
        {/* Summary with gradient left border */}
        {personalInfo.summary && (
          <div className="pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded" style={{ background: `linear-gradient(180deg, ${c.hex}, ${c.hex}33)` }} />
            <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 rounded" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent)` }} />
              <span style={{ color: c.hex }}>Experience</span>
            </h2>
            <div className={sp.item}>
              {experiences.map(exp => (
                <div key={exp.id} className="p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${c.hex}05, ${c.hex}0a)` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-sm" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-white px-3 py-1 rounded-full whitespace-nowrap" style={{ background: `linear-gradient(90deg, ${c.hex}, ${c.hex}aa)` }}>
                      {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} – {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs flex items-start gap-1.5">
                          <span className="mt-0.5" style={{ color: c.hex }}>▸</span>
                          <span>{r}</span>
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
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 rounded" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent)` }} />
              <span style={{ color: c.hex }}>Education</span>
            </h2>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${c.hex}05, ${c.hex}08)` }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <p className="text-xs" style={{ color: c.hex }}>{edu.institution}</p>
                      {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                      {edu.startDate && safeFormat(edu.startDate, 'yyyy')} – {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills with gradient tags */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 rounded" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent)` }} />
              <span style={{ color: c.hex }}>Skills</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s.id} className="text-xs px-3 py-1 rounded-full text-white font-medium" style={{ background: `linear-gradient(90deg, ${c.hex}, ${c.hex}bb)` }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 rounded" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent)` }} />
              <span style={{ color: c.hex }}>Projects</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map(p => (
                <div key={p.id} className="p-3 rounded-xl border" style={{ borderColor: c.hex + '20' }}>
                  <h3 className="font-bold text-xs">{p.name}</h3>
                  {p.role && <p className="text-xs" style={{ color: c.hex }}>{p.role}</p>}
                  <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: c.hex + '10', color: c.hex }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-8">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-1">
                  <p className="text-xs font-bold">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}{cert.date ? ` · ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>Languages</h2>
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold">{lang.language}</span>
                  <span className="text-xs text-white px-2 py-0.5 rounded-full capitalize" style={{ background: `linear-gradient(90deg, ${c.hex}, ${c.hex}bb)` }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
