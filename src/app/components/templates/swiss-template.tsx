import { CVData } from '../../types/cv';
import { formatDateRange, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function SwissTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} bg-white`} style={style}>
      {/* Swiss grid header */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-4">
          {cv.showPhoto && personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-full aspect-square object-cover" />
          )}
          {!personalInfo.photo && (
            <div className="w-full aspect-square flex items-center justify-center" style={{ backgroundColor: c.hex }}>
              <span className="text-5xl font-black text-white">
                {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
        <div className="col-span-8 flex flex-col justify-end">
          <h1 className="text-5xl font-black leading-none tracking-tight">
            {personalInfo.firstName}
          </h1>
          <h1 className="text-5xl font-light leading-none tracking-tight" style={{ color: c.hex }}>
            {personalInfo.lastName}
          </h1>
          {personalInfo.headline && (
            <p className="text-sm mt-3 uppercase tracking-widest text-gray-500">{personalInfo.headline}</p>
          )}
        </div>
      </div>

      {/* Contact bar */}
      <div className="mb-6 pb-3" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
        <TemplateContactList
          personalInfo={personalInfo}
          language={cv.language}
          accentColor={c.hex}
          className="text-xs text-gray-500"
          itemClassName="text-xs"
        />
      </div>

      {/* Grid-based content */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Profile</h2>
            </div>
            <div className="col-span-9">
              <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
            </div>
          </>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Experience</h2>
            </div>
            <div className="col-span-9 space-y-4">
              {experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-xs" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs">— {r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Education */}
        {education.length > 0 && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Education</h2>
            </div>
            <div className="col-span-9 space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-xs" style={{ color: c.hex }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Skills</h2>
            </div>
            <div className="col-span-9">
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <span key={s.id} className="text-xs px-2 py-0.5 border font-medium" style={{ borderColor: c.hex, color: c.hex }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Projects</h2>
            </div>
            <div className="col-span-9 space-y-3">
              {projects.map(p => (
                <div key={p.id}>
                  <h3 className="font-bold text-sm">{p.name}</h3>
                  {p.role && <p className="text-xs" style={{ color: c.hex }}>{p.role}</p>}
                  <p className="text-gray-600 text-xs mt-0.5">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.technologies.map((t, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Certifications</h2>
            </div>
            <div className="col-span-9 space-y-1">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <span className="text-xs font-bold">{cert.name}</span>
                  <span className="text-xs text-gray-500"> — {cert.issuer}{cert.date ? ` · ${safeFormat(cert.date, 'yyyy')}` : ''}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <>
            <div className="col-span-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: c.hex }}>Languages</h2>
            </div>
            <div className="col-span-9">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {languages.map(lang => (
                  <span key={lang.id} className="text-xs">
                    <span className="font-bold">{lang.language}</span> <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
