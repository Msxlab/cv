import { useState } from 'react';
import { useCV } from '../context/cv-context';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FileText, Download, Copy, FileJson } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface ExportDialogProps {
  onClose: () => void;
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const { currentCV } = useCV();
  const [exporting, setExporting] = useState(false);

  if (!currentCV) return null;

  const generateFileName = () => {
    const name = `${currentCV.personalInfo.firstName}-${currentCV.personalInfo.lastName}`.toLowerCase();
    const role = currentCV.personalInfo.headline.replace(/\s+/g, '-').toLowerCase();
    return `${name}-${role}-resume`.replace(/[^a-z0-9-]/g, '');
  };

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const element = document.getElementById('cv-preview');
      if (!element) throw new Error('CV preview not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${generateFileName()}.pdf`);

      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(currentCV, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generateFileName()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('JSON exported successfully!');
  };

  const exportToText = () => {
    const { personalInfo, experiences, education, skills, projects } = currentCV;
    
    let text = `${personalInfo.firstName} ${personalInfo.lastName}\n`;
    text += `${personalInfo.headline}\n\n`;
    
    if (personalInfo.summary) {
      text += `PROFESSIONAL SUMMARY\n${personalInfo.summary}\n\n`;
    }

    text += `CONTACT\n`;
    text += `Email: ${personalInfo.email}\n`;
    text += `Phone: ${personalInfo.phone}\n`;
    if (personalInfo.location) text += `Location: ${personalInfo.location}\n`;
    text += '\n';

    if (experiences.length > 0) {
      text += `EXPERIENCE\n`;
      experiences.forEach(exp => {
        text += `\n${exp.position} at ${exp.company}\n`;
        text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        exp.responsibilities.forEach(r => {
          if (r) text += `• ${r}\n`;
        });
      });
      text += '\n';
    }

    if (education.length > 0) {
      text += `EDUCATION\n`;
      education.forEach(edu => {
        text += `\n${edu.degree} in ${edu.field}\n`;
        text += `${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n`;
      });
      text += '\n';
    }

    if (skills.length > 0) {
      text += `SKILLS\n`;
      const grouped = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);
      
      Object.entries(grouped).forEach(([category, skillNames]) => {
        text += `${category}: ${skillNames.join(', ')}\n`;
      });
      text += '\n';
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generateFileName()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Text file exported successfully!');
  };

  const copyToClipboard = async () => {
    const { personalInfo, experiences, education, skills } = currentCV;
    
    let text = `${personalInfo.firstName} ${personalInfo.lastName} | ${personalInfo.headline}\n`;
    text += `${personalInfo.email} | ${personalInfo.phone}\n\n`;
    
    if (personalInfo.summary) {
      text += `${personalInfo.summary}\n\n`;
    }

    if (experiences.length > 0) {
      text += `EXPERIENCE\n`;
      experiences.forEach(exp => {
        text += `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
        exp.responsibilities.forEach(r => {
          if (r) text += `• ${r}\n`;
        });
        text += '\n';
      });
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success('CV copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export CV</DialogTitle>
          <DialogDescription>
            Choose how you want to export your CV
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
              <Button className="w-full" disabled={exporting}>
                {exporting ? 'Exporting...' : 'Download PDF'}
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
              <Button variant="outline" className="w-full">
                Download TXT
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
              <Button variant="outline" className="w-full">
                Download JSON
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
              <Button variant="outline" className="w-full">
                Copy CV
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
