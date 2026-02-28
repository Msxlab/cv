import { CVData } from '../../types/cv';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function ClassicTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'slate'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'serif', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} text-sm bg-white`} style={style}>
      {/* Header - Centered */}
      <div className="text-center mb-6">
        {cv.showPhoto && personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 mx-auto mb-3"
            style={{ borderColor: c.hex }}
          />
        )}
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-1" style={{ letterSpacing: '0.15em' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.headline && (
          <p className="text-base text-gray-600 mb-2 italic">{personalInfo.headline}</p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• LinkedIn</span>}
          {personalInfo.github && <span>• GitHub</span>}
          {personalInfo.website && <span>• {personalInfo.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </div>

      <hr className="border-t-2 mb-6" style={{ borderColor: c.hex }} />

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
            Professional Summary
          </h2>
          <hr className="border-t border-black mb-2" />
          <p className="text-gray-800 leading-relaxed text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
            Professional Experience
          </h2>
          <hr className="border-t border-black mb-3" />
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-base">{exp.position}</p>
                    <p className="italic text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  </div>
                  <p className="text-gray-600 text-xs whitespace-nowrap ml-4">
                    {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} –{' '}
                    {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                  </p>
                </div>
                {exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5 text-gray-800">
                    {exp.responsibilities.map((resp, idx) => resp && <li key={idx}>{resp}</li>)}
                  </ul>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-0.5 space-y-0.5 text-gray-800">
                    {exp.achievements.map((ach, idx) => ach && <li key={idx}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
            Education
          </h2>
          <hr className="border-t border-black mb-3" />
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="italic text-gray-700">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                  {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-gray-600 text-xs whitespace-nowrap ml-4">
                  {edu.startDate && safeFormat(edu.startDate, 'yyyy')} –{' '}
                  {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
            Skills
          </h2>
          <hr className="border-t border-black mb-2" />
          <div className="space-y-1">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, typeof skills>)
            ).map(([category, categorySkills]) => (
              <p key={category} className="text-gray-800">
                <span className="font-bold italic">{category}: </span>
                {categorySkills.map(s => s.name).join(' • ')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
            Projects
          </h2>
          <hr className="border-t border-black mb-3" />
          <div className="space-y-2">
            {projects.map(project => (
              <div key={project.id}>
                <p className="font-bold">{project.name}{project.role ? ` — ${project.role}` : ''}</p>
                <p className="text-gray-800">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-gray-600 text-xs italic">Technologies: {project.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-2 gap-6">
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              Certifications
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-1">
              {certifications.map(cert => (
                <div key={cert.id}>
                  <p className="font-semibold text-xs">{cert.name}</p>
                  <p className="text-gray-600 text-xs italic">{cert.issuer}{cert.date ? ` • ${safeFormat(cert.date, 'yyyy')}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ letterSpacing: '0.2em' }}>
              Languages
            </h2>
            <hr className="border-t border-black mb-2" />
            <div className="space-y-1">
              {languages.map(lang => (
                <p key={lang.id} className="text-gray-800 text-xs">
                  <span className="font-semibold">{lang.language}</span> — <span className="capitalize italic">{lang.proficiency}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
