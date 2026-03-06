import { useState } from 'react';
import { useCV } from '../context/cv-context';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, Download, Copy, FileJson, Image } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { formatDateRange, getDisplayUrl, getPersonalLinks, normalizeUrl } from '../utils/content-helpers';

interface ExportDialogProps {
  onClose: () => void;
}

type ExportType = 'pdf' | 'png' | 'word' | 'text' | 'json' | 'clipboard';

export function ExportDialog({ onClose }: ExportDialogProps) {
  const { currentCV } = useCV();
  const [activeExport, setActiveExport] = useState<ExportType | null>(null);

  if (!currentCV) return null;

  const generateFileName = () => {
    const name = `${currentCV.personalInfo.firstName}-${currentCV.personalInfo.lastName}`.toLowerCase();
    const role = (currentCV.personalInfo.headline || 'cv').replace(/\s+/g, '-').toLowerCase();
    return `${name}-${role}-resume`.replace(/[^a-z0-9-]/g, '');
  };

  const downloadBlob = (blob: Blob, extension: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generateFileName()}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewElement = () => document.getElementById('cv-preview');

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const buildPlainText = () => {
    const {
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      certifications,
      achievements,
      volunteers,
      publications,
      references,
      languages,
      customSections,
    } = currentCV;

    const lines: string[] = [];
    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    lines.push(fullName);
    if (personalInfo.headline) lines.push(personalInfo.headline);
    lines.push('');

    const contactLines = [
      personalInfo.email ? `Email: ${personalInfo.email}` : null,
      personalInfo.phone ? `Phone: ${personalInfo.phone}` : null,
      personalInfo.location ? `Location: ${personalInfo.location}` : null,
      ...getPersonalLinks(personalInfo).map((link) => `${link.label}: ${link.value}`),
    ].filter(Boolean) as string[];

    if (contactLines.length > 0) {
      lines.push('CONTACT');
      lines.push(...contactLines);
      lines.push('');
    }

    if (personalInfo.summary) {
      lines.push('PROFESSIONAL SUMMARY');
      lines.push(personalInfo.summary);
      lines.push('');
    }

    if (experiences.length > 0) {
      lines.push('EXPERIENCE');
      experiences.forEach((exp) => {
        lines.push(`${exp.position} at ${exp.company}`);
        const range = formatDateRange(exp.startDate, exp.endDate, exp.current, currentCV.language, 'MMM yyyy');
        if (range) lines.push(range);
        if (exp.location) lines.push(exp.location);
        exp.responsibilities.forEach((item) => item && lines.push(`- ${item}`));
        exp.achievements.forEach((item) => item && lines.push(`- ${item}`));
        lines.push('');
      });
    }

    if (education.length > 0) {
      lines.push('EDUCATION');
      education.forEach((edu) => {
        lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);
        lines.push(edu.institution);
        const range = formatDateRange(edu.startDate, edu.endDate, edu.current, currentCV.language, 'yyyy');
        if (range) lines.push(range);
        if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
        if (edu.description) lines.push(edu.description);
        lines.push('');
      });
    }

    if (projects.length > 0) {
      lines.push('PROJECTS');
      projects.forEach((project) => {
        lines.push(`${project.name}${project.role ? ` (${project.role})` : ''}`);
        lines.push(project.description);
        if (project.url) lines.push(project.url);
        if (project.technologies.length > 0) lines.push(`Technologies: ${project.technologies.join(', ')}`);
        if (project.impact) lines.push(`Impact: ${project.impact}`);
        lines.push('');
      });
    }

    if (skills.length > 0) {
      lines.push('SKILLS');
      const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);
      Object.entries(grouped).forEach(([category, skillNames]) => {
        lines.push(`${category}: ${skillNames.join(', ')}`);
      });
      lines.push('');
    }

    if (certifications.length > 0) {
      lines.push('CERTIFICATIONS');
      certifications.forEach((cert) => {
        lines.push(`${cert.name} — ${cert.issuer}`);
        if (cert.date) lines.push(cert.date);
        if (cert.url) lines.push(cert.url);
        lines.push('');
      });
    }

    if (achievements.length > 0) {
      lines.push('ACHIEVEMENTS');
      achievements.forEach((achievement) => {
        lines.push(achievement.title);
        if (achievement.date) lines.push(achievement.date);
        if (achievement.description) lines.push(achievement.description);
        lines.push('');
      });
    }

    if (volunteers.length > 0) {
      lines.push('VOLUNTEER EXPERIENCE');
      volunteers.forEach((volunteer) => {
        lines.push(`${volunteer.role} — ${volunteer.organization}`);
        const range = formatDateRange(volunteer.startDate, volunteer.endDate, volunteer.current, currentCV.language, 'MMM yyyy');
        if (range) lines.push(range);
        if (volunteer.description) lines.push(volunteer.description);
        lines.push('');
      });
    }

    if (publications.length > 0) {
      lines.push('PUBLICATIONS');
      publications.forEach((publication) => {
        lines.push(`${publication.title} — ${publication.publisher}`);
        if (publication.date) lines.push(publication.date);
        if (publication.description) lines.push(publication.description);
        if (publication.url) lines.push(publication.url);
        lines.push('');
      });
    }

    if (languages.length > 0) {
      lines.push('LANGUAGES');
      languages.forEach((language) => {
        lines.push(`${language.language}: ${language.proficiency}`);
      });
      lines.push('');
    }

    if (references.length > 0) {
      lines.push('REFERENCES');
      references.forEach((reference) => {
        lines.push(`${reference.name} — ${reference.position} at ${reference.company}`);
        lines.push(reference.email);
        if (reference.phone) lines.push(reference.phone);
        lines.push('');
      });
    }

    customSections?.forEach((section) => {
      if (!section.title || !section.content) return;
      lines.push(section.title.toUpperCase());
      lines.push(section.content);
      lines.push('');
    });

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const buildWordHtml = () => {
    const {
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      certifications,
      achievements,
      volunteers,
      publications,
      references,
      languages,
      customSections,
    } = currentCV;

    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    const section = (title: string, content: string) =>
      content ? `<section style="margin-top:18px;"><h2 style="font-size:16px;margin:0 0 8px;border-bottom:1px solid #d1d5db;padding-bottom:4px;">${escapeHtml(title)}</h2>${content}</section>` : '';

    const contactHtml = [
      personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : '',
      personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : '',
      personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : '',
      ...getPersonalLinks(personalInfo).map((link) => `<a href="${escapeHtml(normalizeUrl(link.value))}" style="color:#2563eb;text-decoration:none;">${escapeHtml(link.display || getDisplayUrl(link.value))}</a>`),
    ].filter(Boolean).join(' <span style="color:#9ca3af;">|</span> ');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(generateFileName())}</title>
        </head>
        <body style="font-family:Arial, Helvetica, sans-serif;color:#111827;line-height:1.5;margin:32px;">
          <header style="margin-bottom:20px;">
            <h1 style="font-size:28px;margin:0;">${escapeHtml(`${personalInfo.firstName} ${personalInfo.lastName}`.trim())}</h1>
            ${personalInfo.headline ? `<p style="font-size:16px;color:#4b5563;margin:6px 0 0;">${escapeHtml(personalInfo.headline)}</p>` : ''}
            ${contactHtml ? `<p style="font-size:12px;color:#4b5563;margin:10px 0 0;">${contactHtml}</p>` : ''}
          </header>
          ${personalInfo.summary ? section('Professional Summary', `<p style="margin:0;">${escapeHtml(personalInfo.summary)}</p>`) : ''}
          ${section(
            'Experience',
            experiences
              .map((exp) => {
                const range = formatDateRange(exp.startDate, exp.endDate, exp.current, currentCV.language, 'MMM yyyy');
                const bullets = [...exp.responsibilities, ...exp.achievements]
                  .filter(Boolean)
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join('');
                return `
                  <article style="margin-bottom:14px;">
                    <div style="display:flex;justify-content:space-between;gap:12px;">
                      <div>
                        <strong>${escapeHtml(exp.position)}</strong>
                        <div style="color:#4b5563;">${escapeHtml(exp.company)}${exp.location ? ` • ${escapeHtml(exp.location)}` : ''}</div>
                      </div>
                      ${range ? `<div style="white-space:nowrap;color:#6b7280;">${escapeHtml(range)}</div>` : ''}
                    </div>
                    ${bullets ? `<ul style="margin:8px 0 0 18px;padding:0;">${bullets}</ul>` : ''}
                  </article>`;
              })
              .join('')
          )}
          ${section(
            'Education',
            education
              .map((edu) => {
                const range = formatDateRange(edu.startDate, edu.endDate, edu.current, currentCV.language, 'yyyy');
                return `
                  <article style="margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;gap:12px;">
                      <div>
                        <strong>${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ''}</strong>
                        <div style="color:#4b5563;">${escapeHtml(edu.institution)}</div>
                        ${edu.gpa ? `<div style="color:#6b7280;">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
                        ${edu.description ? `<div>${escapeHtml(edu.description)}</div>` : ''}
                      </div>
                      ${range ? `<div style="white-space:nowrap;color:#6b7280;">${escapeHtml(range)}</div>` : ''}
                    </div>
                  </article>`;
              })
              .join('')
          )}
          ${section(
            'Projects',
            projects
              .map((project) => `
                <article style="margin-bottom:12px;">
                  <strong>${escapeHtml(project.name)}</strong>${project.role ? ` <span style="color:#4b5563;">(${escapeHtml(project.role)})</span>` : ''}
                  <div>${escapeHtml(project.description)}</div>
                  ${project.url ? `<div><a href="${escapeHtml(normalizeUrl(project.url))}" style="color:#2563eb;text-decoration:none;">${escapeHtml(getDisplayUrl(project.url))}</a></div>` : ''}
                  ${project.technologies.length > 0 ? `<div style="color:#4b5563;">Technologies: ${escapeHtml(project.technologies.join(', '))}</div>` : ''}
                  ${project.impact ? `<div style="color:#4b5563;">Impact: ${escapeHtml(project.impact)}</div>` : ''}
                </article>`
              )
              .join('')
          )}
          ${section(
            'Skills',
            Object.entries(groupedSkills)
              .map(([category, items]) => `<p style="margin:0 0 6px;"><strong>${escapeHtml(category)}:</strong> ${escapeHtml(items.join(', '))}</p>`)
              .join('')
          )}
          ${section(
            'Certifications',
            certifications
              .map((cert) => `
                <article style="margin-bottom:10px;">
                  <strong>${escapeHtml(cert.name)}</strong>
                  <div style="color:#4b5563;">${escapeHtml(cert.issuer)}${cert.date ? ` • ${escapeHtml(cert.date)}` : ''}</div>
                  ${cert.url ? `<div><a href="${escapeHtml(normalizeUrl(cert.url))}" style="color:#2563eb;text-decoration:none;">View credential</a></div>` : ''}
                </article>`
              )
              .join('')
          )}
          ${section(
            'Achievements',
            achievements
              .map((achievement) => `<p style="margin:0 0 8px;"><strong>${escapeHtml(achievement.title)}</strong>${achievement.date ? ` <span style="color:#6b7280;">(${escapeHtml(achievement.date)})</span>` : ''}${achievement.description ? `<br />${escapeHtml(achievement.description)}` : ''}</p>`)
              .join('')
          )}
          ${section(
            'Volunteer Experience',
            volunteers
              .map((volunteer) => `
                <article style="margin-bottom:10px;">
                  <strong>${escapeHtml(volunteer.role)}</strong>
                  <div style="color:#4b5563;">${escapeHtml(volunteer.organization)}</div>
                  <div style="color:#6b7280;">${escapeHtml(formatDateRange(volunteer.startDate, volunteer.endDate, volunteer.current, currentCV.language, 'MMM yyyy'))}</div>
                  ${volunteer.description ? `<div>${escapeHtml(volunteer.description)}</div>` : ''}
                </article>`
              )
              .join('')
          )}
          ${section(
            'Publications',
            publications
              .map((publication) => `
                <article style="margin-bottom:10px;">
                  <strong>${escapeHtml(publication.title)}</strong>
                  <div style="color:#4b5563;">${escapeHtml(publication.publisher)}${publication.date ? ` • ${escapeHtml(publication.date)}` : ''}</div>
                  ${publication.description ? `<div>${escapeHtml(publication.description)}</div>` : ''}
                  ${publication.url ? `<div><a href="${escapeHtml(normalizeUrl(publication.url))}" style="color:#2563eb;text-decoration:none;">${escapeHtml(getDisplayUrl(publication.url))}</a></div>` : ''}
                </article>`
              )
              .join('')
          )}
          ${section(
            'Languages',
            languages.map((language) => `<p style="margin:0 0 6px;"><strong>${escapeHtml(language.language)}:</strong> ${escapeHtml(language.proficiency)}</p>`).join('')
          )}
          ${section(
            'References',
            references
              .map((reference) => `<p style="margin:0 0 8px;"><strong>${escapeHtml(reference.name)}</strong><br />${escapeHtml(reference.position)} — ${escapeHtml(reference.company)}<br />${escapeHtml(reference.email)}${reference.phone ? `<br />${escapeHtml(reference.phone)}` : ''}</p>`)
              .join('')
          )}
          ${(customSections || [])
            .filter((sectionItem) => sectionItem.title && sectionItem.content)
            .map((sectionItem) => section(sectionItem.title, `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(sectionItem.content)}</p>`))
            .join('')}
        </body>
      </html>`;

    return html;
  };

  const handlePrint = useReactToPrint({
    content: () => document.getElementById('cv-preview'),
    documentTitle: generateFileName(),
    onAfterPrint: () => {
      setActiveExport(null);
      toast.success('PDF exported successfully!');
    },
    onPrintError: (error) => {
      setActiveExport(null);
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    },
    removeAfterPrint: true,
  });

  const exportToPDF = () => {
    const element = getPreviewElement();
    if (!element) {
      toast.error('CV preview not found. Please make sure the preview is visible.');
      return;
    }
    setActiveExport('pdf');
    handlePrint();
  };

  const exportToPNG = async () => {
    const element = getPreviewElement();
    if (!element) {
      toast.error('CV preview not found. Please make sure the preview is visible.');
      return;
    }

    setActiveExport('png');
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG export failed');

      downloadBlob(blob, 'png');
      toast.success('PNG exported successfully!');
    } catch (error) {
      console.error('PNG export error:', error);
      toast.error('Failed to export PNG');
    } finally {
      setActiveExport(null);
    }
  };

  const exportToWord = () => {
    setActiveExport('word');
    try {
      const blob = new Blob(['\ufeff', buildWordHtml()], {
        type: 'application/msword;charset=utf-8',
      });
      downloadBlob(blob, 'doc');
      toast.success('Word-friendly document exported successfully!');
    } catch (error) {
      console.error('Word export error:', error);
      toast.error('Failed to export Word document');
    } finally {
      setActiveExport(null);
    }
  };

  const exportToJSON = () => {
    setActiveExport('json');
    const dataStr = JSON.stringify(currentCV, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    downloadBlob(dataBlob, 'json');
    setActiveExport(null);
    toast.success('JSON exported successfully!');
  };

  const exportToText = () => {
    setActiveExport('text');
    const blob = new Blob([buildPlainText()], { type: 'text/plain' });
    downloadBlob(blob, 'txt');
    setActiveExport(null);
    toast.success('Text file exported successfully!');
  };

  const copyToClipboard = async () => {
    setActiveExport('clipboard');
    try {
      await navigator.clipboard.writeText(buildPlainText());
      toast.success('CV copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    } finally {
      setActiveExport(null);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export CV</DialogTitle>
          <DialogDescription>
            Choose the format that best fits your application workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={exportToPDF}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                PDF Export
              </CardTitle>
              <CardDescription>
                Professional PDF ready for applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled={activeExport !== null}>
                {activeExport === 'pdf' ? 'Exporting...' : 'Download PDF'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={exportToPNG}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-pink-600" />
                PNG Image
              </CardTitle>
              <CardDescription>
                High-resolution image for portfolios or sharing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={activeExport !== null}>
                {activeExport === 'png' ? 'Exporting...' : 'Download PNG'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={exportToWord}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Word-Friendly
              </CardTitle>
              <CardDescription>
                Opens in Microsoft Word as an editable document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={activeExport !== null}>
                {activeExport === 'word' ? 'Exporting...' : 'Download DOC'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={exportToText}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Plain Text
              </CardTitle>
              <CardDescription>
                ATS-safe plain text format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={activeExport !== null}>
                {activeExport === 'text' ? 'Exporting...' : 'Download TXT'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={exportToJSON}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-purple-600" />
                JSON Data
              </CardTitle>
              <CardDescription>
                Export as JSON for backup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={activeExport !== null}>
                {activeExport === 'json' ? 'Exporting...' : 'Download JSON'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={copyToClipboard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-orange-600" />
                Copy to Clipboard
              </CardTitle>
              <CardDescription>
                Quick copy for pasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={activeExport !== null}>
                {activeExport === 'clipboard' ? 'Copying...' : 'Copy CV'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Privacy Note:</strong> All exports are generated locally in your browser.
            No data is sent to any server.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
