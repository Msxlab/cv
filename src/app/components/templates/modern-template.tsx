import { CVData } from '../../types/cv';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { safeFormat } from '../../utils/content-helpers';
import { accentColors, getTemplateStyle, spacings } from '../../utils/template-styles';

interface TemplateProps {
  cv: CVData;
}

export function ModernTemplate({ cv }: TemplateProps) {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = cv;
  const c = accentColors[cv.accentColor || 'blue'];
  const sp = spacings[cv.spacing || 'normal'];
  const style = getTemplateStyle(cv.fontFamily || 'sans', cv.fontSize || 'medium');

  return (
    <div className={`w-[210mm] min-h-[297mm] ${sp.padding} text-sm`} style={style}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6">
          {cv.showPhoto && personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: c.hex }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.headline && (
              <p className="text-xl mb-3" style={{ color: c.hex }}>{personalInfo.headline}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <a href={personalInfo.website} className="hover:underline" style={{ color: c.hex }}>
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  <a href={personalInfo.linkedin} className="hover:underline" style={{ color: c.hex }}>
                    LinkedIn
                  </a>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  <a href={personalInfo.github} className="hover:underline" style={{ color: c.hex }}>
                    GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className={sp.section}>
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-base">{exp.position}</h3>
                    <p className="text-gray-600">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </p>
                  </div>
                  <div className="text-gray-500 text-sm whitespace-nowrap ml-4">
                    {exp.startDate && safeFormat(exp.startDate, 'MMM yyyy')} -{' '}
                    {exp.current ? 'Present' : exp.endDate && safeFormat(exp.endDate, 'MMM yyyy')}
                  </div>
                </div>
                {exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 mt-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="font-medium">{ach}</li>
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
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-gray-500 text-sm whitespace-nowrap ml-4">
                    {edu.startDate && safeFormat(edu.startDate, 'yyyy')} -{' '}
                    {edu.current ? 'Present' : edu.endDate && safeFormat(edu.endDate, 'yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Skills
          </h2>
          <div className="space-y-2">
            {Object.entries(
              skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, typeof skills>)
            ).map(([category, categorySkills]) => (
              <div key={category}>
                <span className="font-semibold">{category}:</span>{' '}
                <span className="text-gray-700">
                  {categorySkills.map(s => s.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map(project => (
              <div key={project.id}>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.role}</p>
                <p className="text-gray-700 mt-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Technologies:</span>{' '}
                    {project.technologies.join(', ')}
                  </p>
                )}
                {project.impact && (
                  <p className="text-sm mt-1" style={{ color: c.hex }}>
                    <span className="font-medium">Impact:</span> {project.impact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map(cert => (
              <div key={cert.id}>
                <h3 className="font-semibold">{cert.name}</h3>
                <p className="text-gray-600 text-sm">
                  {cert.issuer} • {cert.date && safeFormat(cert.date, 'MMM yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className={sp.section}>
          <h2 className="text-lg uppercase tracking-wide border-b-2 pb-1 mb-3" style={{ borderColor: c.hex }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {languages.map(lang => (
              <div key={lang.id}>
                <span className="font-semibold">{lang.language}:</span>{' '}
                <span className="text-gray-700 capitalize">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
