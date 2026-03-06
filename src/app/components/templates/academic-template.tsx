import { CVData } from '../../types/cv';
import { formatDateRange, getDisplayUrl, normalizeUrl, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function AcademicTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, publications, achievements } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'serif', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} bg-white`} style={style}>
      {/* Header */}
      <div className={`text-center ${sp.section}`}>
        {cv.showPhoto && personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: c.hex }} />
        )}
        <h1 className="text-3xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h1>
        {personalInfo.headline && <p className="text-base mt-1" style={{ color: c.hex }}>{personalInfo.headline}</p>}
        <TemplateContactList
          personalInfo={personalInfo}
          language={cv.language}
          accentColor={c.hex}
          className="justify-center text-gray-500 text-xs mt-2"
          itemClassName="text-xs"
          separator="·"
        />
        <div className="mt-3 h-0.5" style={{ backgroundColor: c.hex }} />
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: c.hex }}>Research Interests / Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Education - prominent for academic */}
      {education.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c.hex }}>Education</h2>
          <div className={sp.item}>
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-gray-600 text-sm">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                    {edu.gpa && <p className="text-gray-500 text-xs">GPA: {edu.gpa}</p>}
                    {edu.description && <p className="text-gray-600 text-xs mt-1">{edu.description}</p>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {publications && publications.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c.hex }}>Publications</h2>
          <ol className="list-decimal list-inside space-y-1">
            {publications.map(pub => (
              <li key={pub.id} className="text-gray-700 text-xs">
                <span className="font-semibold">{pub.title}</span>. {pub.publisher}.{pub.date ? ` (${safeFormat(pub.date, 'yyyy')})` : ''}
                {pub.url && <a className="ml-1 hover:underline" style={{ color: c.hex }} href={normalizeUrl(pub.url)} target="_blank" rel="noreferrer">[{getDisplayUrl(pub.url) || 'Link'}]</a>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c.hex }}>Research & Professional Experience</h2>
          <div className={sp.item}>
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-gray-600 text-sm">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                  </span>
                </div>
                {exp.responsibilities.length > 0 && (
                  <ul className="mt-1 ml-4 space-y-0.5">
                    {exp.responsibilities.map((r, i) => r && (
                      <li key={i} className="text-gray-600 text-xs list-disc">{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements / Awards */}
      {achievements && achievements.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c.hex }}>Awards & Honors</h2>
          <div className="space-y-1">
            {achievements.map(a => (
              <div key={a.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-xs">{a.title}</span>
                  {a.description && <span className="text-gray-500 text-xs"> — {a.description}</span>}
                </div>
                {a.date && <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{safeFormat(a.date, 'yyyy')}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages side by side */}
      <div className="grid grid-cols-2 gap-8">
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: c.hex }}>Skills</h2>
            <div className="space-y-1">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => (
                <p key={category} className="text-xs text-gray-700">
                  <span className="font-semibold">{category}: </span>
                  {categorySkills.map(s => s.name).join(', ')}
                </p>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-3">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: c.hex }}>Certifications</h2>
              {certifications.map(cert => (
                <div key={cert.id} className="mb-1">
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: c.hex }}>Languages</h2>
              {languages.map(lang => (
                <p key={lang.id} className="text-xs">
                  <span className="font-semibold">{lang.language}</span> — <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
