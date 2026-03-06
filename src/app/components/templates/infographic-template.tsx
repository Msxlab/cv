import { CVData } from '../../types/cv';
import { formatDateRange, safeFormat } from '../../utils/content-helpers';
import { getAccentColor, getTemplateStyle, spacings } from '../../utils/template-styles';
import { TemplateContactList } from './template-contact-list';

interface TemplateProps {
  cv: CVData;
}

export function InfographicTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = getAccentColor(cv.accentColor || 'blue');
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  const skillLevelToPercent = (level: string) => {
    switch (level) {
      case 'expert': return 95;
      case 'advanced': return 80;
      case 'intermediate': return 60;
      case 'beginner': return 35;
      default: return 50;
    }
  };

  const proficiencyToPercent = (level: string) => {
    switch (level) {
      case 'native': return 100;
      case 'fluent': return 90;
      case 'professional': return 75;
      case 'intermediate': return 55;
      case 'basic': return 30;
      default: return 50;
    }
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white flex" style={style}>
      {/* Left Sidebar */}
      <div className="w-[75mm] flex-shrink-0 text-white p-6 space-y-5" style={{ backgroundColor: c.hex }}>
        {/* Photo */}
        {cv.showPhoto && personalInfo.photo && (
          <div className="flex justify-center">
            <img src={personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white/30" />
          </div>
        )}

        {/* Contact */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-white/70">Contact</h2>
          <TemplateContactList
            personalInfo={personalInfo}
            language={cv.language}
            accentColor="#ffffff"
            layout="stacked"
            theme="dark"
            className="space-y-1.5 text-xs"
            itemClassName="text-xs"
            showIcons
          />
        </div>

        {/* Skills with progress bars */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70">Skills</h2>
            <div className="space-y-2">
              {skills.map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium">{skill.name}</span>
                    <span className="text-xs text-white/60 capitalize">{skill.level}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full">
                    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${skillLevelToPercent(skill.level)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages with progress bars */}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70">Languages</h2>
            <div className="space-y-2">
              {languages.map(lang => (
                <div key={lang.id}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium">{lang.language}</span>
                    <span className="text-xs text-white/60 capitalize">{lang.proficiency}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full">
                    <div className="h-full bg-white rounded-full transition-all" style={{ width: `${proficiencyToPercent(lang.proficiency)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 text-white/70">Certifications</h2>
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id} className="bg-white/10 rounded-lg p-2">
                  <p className="text-xs font-semibold">{cert.name}</p>
                  <p className="text-xs text-white/60">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-7 space-y-5">
        {/* Name & Title */}
        <div className={sp.section}>
          <h1 className="text-3xl font-bold leading-tight" style={{ color: c.hex }}>
            {personalInfo.firstName}<br />{personalInfo.lastName}
          </h1>
          {personalInfo.headline && (
            <p className="text-gray-500 text-sm mt-1 font-medium uppercase tracking-wider">{personalInfo.headline}</p>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className={sp.section}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c.hex }}>About Me</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience with timeline */}
        {experiences.length > 0 && (
          <div className={sp.section}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Experience</h2>
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-5" style={{ borderLeftWidth: '2px', borderLeftColor: c.hex + '30', borderLeftStyle: 'solid' }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: c.hex }} />
                  <div className="flex justify-between items-start mb-0.5">
                    <div>
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <p className="text-xs" style={{ color: c.hex }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3 px-2 py-0.5 rounded-full" style={{ backgroundColor: c.hex + '10', color: c.hex }}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.responsibilities.map((r, i) => r && (
                        <li key={i} className="text-gray-600 text-xs flex items-start gap-1.5">
                          <span style={{ color: c.hex }} className="mt-0.5 flex-shrink-0">&#9654;</span>
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
          <div className={sp.section}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Education</h2>
            <div className="space-y-2">
              {education.map(edu => (
                <div key={edu.id} className="p-3 rounded-lg" style={{ backgroundColor: c.hex + '08', borderWidth: '1px', borderColor: c.hex + '20' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <p className="text-xs" style={{ color: c.hex }}>{edu.institution}</p>
                      {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.hex }}>Projects</h2>
            <div className="grid grid-cols-2 gap-2">
              {projects.map(p => (
                <div key={p.id} className="p-2 rounded-lg border" style={{ borderColor: c.hex + '20' }}>
                  <h3 className="font-bold text-xs">{p.name}</h3>
                  {p.role && <p className="text-xs" style={{ color: c.hex }}>{p.role}</p>}
                  <p className="text-gray-600 text-xs mt-0.5 leading-snug">{p.description}</p>
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
