import { CVData } from '../types/cv';
import { CORE_SECTION_IDS, CoreSectionId } from './cv-schema';
import { formatDateRange, getPersonalLinks } from './content-helpers';
import { getTranslation } from './localization';

export interface OrderedSection {
  id: string;
  title: string;
  type: CoreSectionId | 'custom';
}

export function isCoreSectionId(sectionId: string): sectionId is CoreSectionId {
  return (CORE_SECTION_IDS as readonly string[]).includes(sectionId);
}

export function sectionHasContent(cv: CVData, sectionId: string): boolean {
  if (sectionId === 'summary') return Boolean(cv.personalInfo.summary.trim());
  if (sectionId === 'experiences') return cv.experiences.length > 0;
  if (sectionId === 'projects') return cv.projects.length > 0;
  if (sectionId === 'education') return cv.education.length > 0;
  if (sectionId === 'certifications') return cv.certifications.length > 0;
  if (sectionId === 'skills') return cv.skills.length > 0;
  if (sectionId === 'languages') return cv.languages.length > 0;
  if (sectionId === 'achievements') return cv.achievements.length > 0;
  if (sectionId === 'volunteers') return cv.volunteers.length > 0;
  if (sectionId === 'publications') return cv.publications.length > 0;
  if (sectionId === 'references') return cv.references.length > 0;
  return cv.customSections.some((section) => section.id === sectionId && Boolean(section.title.trim() || section.content.trim()));
}

export function getOrderedSections(cv: CVData): OrderedSection[] {
  return cv.sectionOrder
    .filter((sectionId, index, source) => source.indexOf(sectionId) === index)
    .filter((sectionId) => sectionHasContent(cv, sectionId))
    .map((sectionId) => {
      if (isCoreSectionId(sectionId)) {
        return {
          id: sectionId,
          title: getTranslation(cv.language || 'en', sectionId),
          type: sectionId,
        };
      }

      const custom = cv.customSections.find((section) => section.id === sectionId);
      return {
        id: sectionId,
        title: custom?.title || 'Custom Section',
        type: 'custom',
      };
    });
}

export function buildPlainTextCV(cv: CVData): string {
  const lines: string[] = [];
  const fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`.trim();
  if (fullName) lines.push(fullName);
  if (cv.personalInfo.headline) lines.push(cv.personalInfo.headline);

  const contact = [
    cv.personalInfo.email ? `Email: ${cv.personalInfo.email}` : '',
    cv.personalInfo.phone ? `Phone: ${cv.personalInfo.phone}` : '',
    cv.personalInfo.location ? `Location: ${cv.personalInfo.location}` : '',
    ...getPersonalLinks(cv.personalInfo).map((link) => `${link.label}: ${link.value}`),
  ].filter(Boolean);

  if (contact.length > 0) {
    lines.push('');
    lines.push(...contact);
  }

  getOrderedSections(cv).forEach((section) => {
    lines.push('');
    lines.push(section.title.toUpperCase());

    switch (section.type) {
      case 'summary':
        lines.push(cv.personalInfo.summary);
        break;
      case 'experiences':
        cv.experiences.forEach((exp) => {
          lines.push(`${exp.position}${exp.company ? ` at ${exp.company}` : ''}`);
          const range = formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy');
          if (range) lines.push(range);
          if (exp.location) lines.push(exp.location);
          exp.responsibilities.forEach((item) => item && lines.push(`- ${item}`));
          exp.achievements.forEach((item) => item && lines.push(`- Achievement: ${item}`));
          lines.push('');
        });
        break;
      case 'education':
        cv.education.forEach((edu) => {
          lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);
          if (edu.institution) lines.push(edu.institution);
          const range = formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy');
          if (range) lines.push(range);
          if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
          if (edu.description) lines.push(edu.description);
          lines.push('');
        });
        break;
      case 'projects':
        cv.projects.forEach((project) => {
          lines.push(`${project.name}${project.role ? ` (${project.role})` : ''}`);
          const range = formatDateRange(project.startDate, project.endDate, false, cv.language, 'MMM yyyy');
          if (range) lines.push(range);
          if (project.description) lines.push(project.description);
          if (project.url) lines.push(project.url);
          if (project.technologies.length > 0) lines.push(`Technologies: ${project.technologies.join(', ')}`);
          if (project.impact) lines.push(`Impact: ${project.impact}`);
          lines.push('');
        });
        break;
      case 'skills': {
        const grouped = cv.skills.reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);
        Object.entries(grouped).forEach(([category, skills]) => lines.push(`${category}: ${skills.join(', ')}`));
        break;
      }
      case 'certifications':
        cv.certifications.forEach((cert) => {
          lines.push(`${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}`);
          if (cert.date) lines.push(`Issued: ${cert.date}`);
          if (cert.expiryDate) lines.push(`Expires: ${cert.expiryDate}`);
          if (cert.credentialId) lines.push(`Credential ID: ${cert.credentialId}`);
          if (cert.url) lines.push(cert.url);
          lines.push('');
        });
        break;
      case 'achievements':
        cv.achievements.forEach((achievement) => {
          lines.push(achievement.title);
          if (achievement.date) lines.push(achievement.date);
          if (achievement.description) lines.push(achievement.description);
          lines.push('');
        });
        break;
      case 'volunteers':
        cv.volunteers.forEach((volunteer) => {
          lines.push(`${volunteer.role}${volunteer.organization ? ` - ${volunteer.organization}` : ''}`);
          const range = formatDateRange(volunteer.startDate, volunteer.endDate, volunteer.current, cv.language, 'MMM yyyy');
          if (range) lines.push(range);
          if (volunteer.description) lines.push(volunteer.description);
          lines.push('');
        });
        break;
      case 'publications':
        cv.publications.forEach((publication) => {
          lines.push(`${publication.title}${publication.publisher ? ` - ${publication.publisher}` : ''}`);
          if (publication.date) lines.push(publication.date);
          if (publication.description) lines.push(publication.description);
          if (publication.url) lines.push(publication.url);
          lines.push('');
        });
        break;
      case 'languages':
        cv.languages.forEach((language) => lines.push(`${language.language}: ${language.proficiency}`));
        break;
      case 'references':
        cv.references.forEach((reference) => {
          lines.push(reference.name);
          if (reference.relationship) lines.push(reference.relationship);
          if (reference.position || reference.company) lines.push(`${reference.position}${reference.company ? ` at ${reference.company}` : ''}`);
          if (reference.email) lines.push(reference.email);
          if (reference.phone) lines.push(reference.phone);
          lines.push('');
        });
        break;
      case 'custom': {
        const custom = cv.customSections.find((item) => item.id === section.id);
        if (custom?.content) lines.push(custom.content);
        break;
      }
    }
  });

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
