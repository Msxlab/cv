import { useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { useCV } from '../context/cv-context';
import { createEditableBackup } from '../utils/cv-schema';
import { buildDocxBlob } from '../utils/docx-export';
import { CVTemplateRenderer } from './cv-preview';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Notice } from './ui/notice';

interface ExportDialogProps {
  onClose: () => void;
}

type ExportType = 'pdf' | 'docx' | 'json';

export function ExportDialog({ onClose }: ExportDialogProps) {
  const { currentCV, markExported, lastBackupExportedAt } = useCV();
  const [activeExport, setActiveExport] = useState<ExportType | null>(null);
  const [followUpVisible, setFollowUpVisible] = useState(false);

  if (!currentCV) return null;

  const generateFileName = () => {
    const fullName = `${currentCV.personalInfo.firstName}-${currentCV.personalInfo.lastName}`.toLowerCase();
    const role = (currentCV.personalInfo.headline || currentCV.name || 'cv').replace(/\s+/g, '-').toLowerCase();
    return `${fullName}-${role}-resume`.replace(/^-+|-+$/g, '').replace(/[^a-z0-9-]/g, '') || 'private-session-resume';
  };

  const getPreviewElement = () => document.getElementById('cv-preview') || document.getElementById('cv-export-preview');
  const needsBackup = !lastBackupExportedAt || lastBackupExportedAt < currentCV.updatedAt;

  const exportWarnings = [
    !currentCV.personalInfo.firstName && !currentCV.personalInfo.lastName ? 'Name is empty.' : '',
    !currentCV.personalInfo.email && !currentCV.personalInfo.phone ? 'No email or phone.' : '',
    !currentCV.personalInfo.summary ? 'Summary is empty.' : '',
  ].filter(Boolean);

  const downloadBlob = (blob: Blob, extension: string, kind: Parameters<typeof markExported>[0], suffix = '') => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generateFileName()}${suffix}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    markExported(kind);
  };

  const offerBackup = (format: string) => {
    if (needsBackup) {
      setFollowUpVisible(true);
      toast.success(`${format} saved. Download an editable backup too if you want to keep editing later.`);
      return;
    }

    toast.success(`${format} saved.`);
  };

  const handlePrint = useReactToPrint({
    content: getPreviewElement,
    documentTitle: generateFileName(),
    onAfterPrint: () => {
      markExported('pdf');
      setActiveExport(null);
      offerBackup('PDF');
    },
    onPrintError: () => {
      setActiveExport(null);
      toast.error('Could not generate the PDF. Try again or switch templates.');
    },
    removeAfterPrint: true,
  });

  const exportToPDF = () => {
    if (activeExport) return;
    if (!getPreviewElement()) {
      toast.error('Preview is not ready yet. Try again in a moment.');
      return;
    }
    setActiveExport('pdf');
    handlePrint();
  };

  const exportToDOCX = async () => {
    if (activeExport) return;
    setActiveExport('docx');
    try {
      const blob = await buildDocxBlob(currentCV);
      downloadBlob(blob, 'docx', 'docx');
      offerBackup('DOCX');
    } catch (error) {
      console.error('DOCX export error:', error);
      toast.error('Could not generate the Word file. Try again or switch templates.');
    } finally {
      setActiveExport(null);
    }
  };

  const exportToJSON = () => {
    if (activeExport) return;
    setActiveExport('json');
    try {
      const backup = createEditableBackup(currentCV);
      const dataBlob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      downloadBlob(dataBlob, 'json', 'backup', '-editable-backup');
      toast.success('Backup saved. Drop this file back in later to keep editing.');
      setFollowUpVisible(false);
    } catch (error) {
      console.error('JSON export error:', error);
      toast.error('Could not generate the backup. Try again.');
    } finally {
      setActiveExport(null);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export your CV</DialogTitle>
          <DialogDescription>
            Download PDF or Word files for applications, and save an editable backup to keep editing later.
          </DialogDescription>
        </DialogHeader>

        {exportWarnings.length > 0 && (
          <Notice tone="warning">
            <strong>Before export:</strong> {exportWarnings.join(' ')}
          </Notice>
        )}

        {followUpVisible && (
          <Notice tone="warning">
            <div className="space-y-3">
              <div>
                <strong>Save an editable backup too?</strong>
                <p className="mt-1 text-sm text-amber-900/90">Drop this file back in later to keep editing. Without it, this CV cannot be recovered after you continue.</p>
              </div>
              <Button onClick={exportToJSON} disabled={activeExport !== null} className="gap-2">
                <FileJson className="h-4 w-4" />
                Download editable backup
              </Button>
            </div>
          </Notice>
        )}

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Apply with this</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={exportToPDF}
              disabled={activeExport !== null}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md disabled:opacity-60"
            >
              <Download className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Download PDF</p>
                <p className="mt-0.5 text-xs text-slate-500">Best for sending with job applications.</p>
                <p className="mt-2 text-xs font-medium text-blue-600">{activeExport === 'pdf' ? 'Saving...' : 'PDF'}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={exportToDOCX}
              disabled={activeExport !== null}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-md disabled:opacity-60"
            >
              <FileText className="mt-0.5 h-5 w-5 text-indigo-600" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Download Word (.docx)</p>
                <p className="mt-0.5 text-xs text-slate-500">Editable Word document generated locally.</p>
                <p className="mt-2 text-xs font-medium text-indigo-600">{activeExport === 'docx' ? 'Saving...' : 'DOCX'}</p>
              </div>
            </button>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Save for later</h3>
          <button
            type="button"
            onClick={exportToJSON}
            disabled={activeExport !== null}
            className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition hover:shadow-md disabled:opacity-60 ${
              needsBackup ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'
            }`}
          >
            <FileJson className="mt-0.5 h-5 w-5 text-emerald-700" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">
                Download editable backup (.json)
                {needsBackup ? (
                  <span className="ml-2 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                    Recommended
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-xs text-slate-700">Drop this file back in later to keep editing.</p>
              <p className="mt-2 text-xs font-medium text-emerald-700">{activeExport === 'json' ? 'Saving...' : 'Editable JSON backup'}</p>
            </div>
          </button>
        </section>

        <Notice tone="privacy" className="text-xs">
          Browser-only · never uploaded. Files are generated in this tab.
        </Notice>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>

        <div
          id="cv-export-preview"
          className="fixed top-0 -left-[10000px] bg-white pointer-events-none"
          aria-hidden="true"
        >
          <CVTemplateRenderer cv={currentCV} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
