import { CVData } from '../types/cv';
import { formatDateRange, getPersonalLinks } from './content-helpers';
import { getOrderedSections } from './resume-render';

export async function buildDocxBlob(cv: CVData): Promise<Blob> {
  const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
  } = await import('docx');

  const bullet = (text: string) =>
    new Paragraph({
      children: [new TextRun(text)],
      bullet: { level: 0 },
      spacing: { after: 80 },
    });

  const heading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 260, after: 120 },
    });

  const para = (text: string, options: { bold?: boolean; italic?: boolean } = {}) =>
    new Paragraph({
      children: [new TextRun({ text, bold: options.bold, italics: options.italic })],
      spacing: { after: 100 },
    });

  const meta = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 20, color: '4B5563' })],
      spacing: { after: 80 },
    });

  const children = [];
  const name = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`.trim() || cv.name;
  const contacts = [
    cv.personalInfo.email,
    cv.personalInfo.phone,
    cv.personalInfo.location,
    ...getPersonalLinks(cv.personalInfo).map((link) => link.value),
  ].filter(Boolean);

  children.push(
    new Paragraph({
      text: name,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );

  if (cv.personalInfo.headline) {
    children.push(new Paragraph({ text: cv.personalInfo.headline, alignment: AlignmentType.CENTER, spacing: { after: 80 } }));
  }

  if (contacts.length > 0) {
    children.push(new Paragraph({ text: contacts.join(' | '), alignment: AlignmentType.CENTER, spacing: { after: 220 } }));
  }

  getOrderedSections(cv).forEach((section) => {
    children.push(heading(section.title));

    switch (section.type) {
      case 'summary':
        children.push(para(cv.personalInfo.summary));
        break;
      case 'experiences':
        cv.experiences.forEach((exp) => {
          children.push(para(`${exp.position}${exp.company ? ` at ${exp.company}` : ''}`, { bold: true }));
          const details = [formatDateRange(exp.startDate, exp.endDate, exp.current, cv.language, 'MMM yyyy'), exp.location].filter(Boolean);
          if (details.length > 0) children.push(meta(details.join(' | ')));
          exp.responsibilities.filter(Boolean).forEach((item) => children.push(bullet(item)));
          exp.achievements.filter(Boolean).forEach((item) => children.push(bullet(item)));
        });
        break;
      case 'education':
        cv.education.forEach((edu) => {
          children.push(para(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, { bold: true }));
          const details = [edu.institution, formatDateRange(edu.startDate, edu.endDate, edu.current, cv.language, 'yyyy'), edu.gpa ? `GPA: ${edu.gpa}` : ''].filter(Boolean);
          if (details.length > 0) children.push(meta(details.join(' | ')));
          if (edu.description) children.push(para(edu.description));
        });
        break;
      case 'projects':
        cv.projects.forEach((project) => {
          children.push(para(`${project.name}${project.role ? ` (${project.role})` : ''}`, { bold: true }));
          const range = formatDateRange(project.startDate, project.endDate, false, cv.language, 'MMM yyyy');
          if (range) children.push(meta(range));
          if (project.description) children.push(para(project.description));
          if (project.url) children.push(meta(project.url));
          if (project.technologies.length > 0) children.push(meta(`Technologies: ${project.technologies.join(', ')}`));
          if (project.impact) children.push(meta(`Impact: ${project.impact}`));
        });
        break;
      case 'skills': {
        const grouped = cv.skills.reduce((acc, skill) => {
          if (!acc[skill.category]) acc[skill.category] = [];
          acc[skill.category].push(skill.name);
          return acc;
        }, {} as Record<string, string[]>);
        Object.entries(grouped).forEach(([category, skills]) => children.push(para(`${category}: ${skills.join(', ')}`)));
        break;
      }
      case 'certifications':
        cv.certifications.forEach((cert) => {
          children.push(para(`${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}`, { bold: true }));
          const details = [cert.date ? `Issued: ${cert.date}` : '', cert.expiryDate ? `Expires: ${cert.expiryDate}` : '', cert.credentialId ? `Credential ID: ${cert.credentialId}` : '', cert.url].filter(Boolean);
          if (details.length > 0) children.push(meta(details.join(' | ')));
        });
        break;
      case 'languages':
        cv.languages.forEach((language) => children.push(para(`${language.language}: ${language.proficiency}`)));
        break;
      case 'achievements':
        cv.achievements.forEach((achievement) => {
          children.push(para(achievement.title, { bold: true }));
          if (achievement.date) children.push(meta(achievement.date));
          if (achievement.description) children.push(para(achievement.description));
        });
        break;
      case 'volunteers':
        cv.volunteers.forEach((volunteer) => {
          children.push(para(`${volunteer.role}${volunteer.organization ? ` - ${volunteer.organization}` : ''}`, { bold: true }));
          const range = formatDateRange(volunteer.startDate, volunteer.endDate, volunteer.current, cv.language, 'MMM yyyy');
          if (range) children.push(meta(range));
          if (volunteer.description) children.push(para(volunteer.description));
        });
        break;
      case 'publications':
        cv.publications.forEach((publication) => {
          children.push(para(`${publication.title}${publication.publisher ? ` - ${publication.publisher}` : ''}`, { bold: true }));
          if (publication.date) children.push(meta(publication.date));
          if (publication.description) children.push(para(publication.description));
          if (publication.url) children.push(meta(publication.url));
        });
        break;
      case 'references':
        cv.references.forEach((reference) => {
          children.push(para(reference.name, { bold: true }));
          const details = [
            reference.relationship,
            reference.position || reference.company ? `${reference.position}${reference.company ? ` at ${reference.company}` : ''}` : '',
            reference.email,
            reference.phone,
          ].filter(Boolean);
          if (details.length > 0) children.push(meta(details.join(' | ')));
        });
        break;
      case 'custom': {
        const custom = cv.customSections.find((item) => item.id === section.id);
        if (custom?.content) children.push(para(custom.content));
        break;
      }
    }
  });

  const doc = new Document({
    creator: 'Cyber Warriors - PonyCot',
    description: 'DOCX generated locally in the browser.',
    title: name,
    sections: [{ properties: {}, children }],
  });

  return Packer.toBlob(doc);
}
