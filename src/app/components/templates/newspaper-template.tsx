import { CVData } from '../../types/cv';
import { formatDateRange, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function NewspaperTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'serif', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} bg-white`} style={style}>
      {/* Newspaper Masthead */}
      <div className="text-center mb-2">
        <div className="h-1 bg-black mb-2" />
        <div className="flex items-center justify-center gap-4">
          {cv.showPhoto && personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-14 h-14 rounded-full object-cover border border-gray-300" />
          )}
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase" style={{ fontVariant: 'small-caps' }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.headline && (
              <p className="text-sm italic" style={{ color: c.hex }}>{personalInfo.headline}</p>
            )}
          </div>
        </div>
        <div className="h-0.5 bg-black mt-2 mb-1" />
        <TemplateContactList
          personalInfo={personalInfo}
          language={cv.language}
          accentColor={c.hex}
          className="justify-center text-xs text-gray-500 mb-1"
          itemClassName="text-xs"
          separator="|"
        />
        <div className="h-px bg-gray-300" />
      </div>

      {/* Summary as lead */}
      {personalInfo.summary && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed text-justify first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-1">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Multi-column layout */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4" style={{ columnRule: `1px solid #e5e5e5` }}>
        {/* Experience - spans full or left */}
        {experiences.length > 0 && (
          <div className="col-span-2">
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Professional Experience
            </h2>
            <div className="columns-2 gap-6" style={{ columnRule: '1px solid #e5e5e5' }}>
              {experiences.map(exp => (
                <div key={exp.id} className="mb-3 break-inside-avoid">
                  <h3 className="font-bold text-sm">{exp.position}</h3>
                  <p className="text-xs italic" style={{ color: c.hex }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <p className="text-xs text-gray-400">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                  </p>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs text-justify">— {r}</li>
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
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Education
            </h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-xs">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                <p className="text-xs italic" style={{ color: c.hex }}>{edu.institution}</p>
                <p className="text-xs text-gray-400">
                  {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                </p>
                {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Skills
            </h2>
            <div className="space-y-1">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <p key={category} className="text-xs text-gray-700">
                  <span className="font-bold">{category}: </span>
                  {categorySkills.map(s => s.name).join(', ')}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Projects
            </h2>
            {projects.map(p => (
              <div key={p.id} className="mb-2">
                <h3 className="font-bold text-xs">{p.name}</h3>
                {p.role && <p className="text-xs italic" style={{ color: c.hex }}>{p.role}</p>}
                <p className="text-gray-600 text-xs text-justify">{p.description}</p>
                {p.technologies.length > 0 && <p className="text-xs text-gray-400 mt-0.5">{p.technologies.join(', ')}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications & Languages */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Certifications
            </h2>
            {certifications.map(cert => (
              <div key={cert.id} className="mb-1">
                <p className="text-xs font-bold">{cert.name}</p>
                <p className="text-xs text-gray-500 italic">{cert.issuer}{cert.date ? ` · ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
              </div>
            ))}
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2" style={{ borderBottomWidth: '2px', borderBottomColor: c.hex, borderBottomStyle: 'solid' }}>
              Languages
            </h2>
            {languages.map(lang => (
              <p key={lang.id} className="text-xs mb-0.5">
                <span className="font-bold">{lang.language}</span> — <span className="italic text-gray-500 capitalize">{lang.proficiency}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Footer line */}
      <div className="mt-6 h-0.5 bg-black" />
    </div>
  );
}
