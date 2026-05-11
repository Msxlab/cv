import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { AlertTriangle, FileJson, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useCV } from '../context/cv-context';
import { ParsedBackupResult, parseEditableBackup } from '../utils/cv-schema';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ConfirmActionDialog } from './confirm-action-dialog';

interface BackupImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function BackupImportDialog({ open, onClose }: BackupImportDialogProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { currentCV, hasMeaningfulContent, importCVAsNew, replaceSessionWithCV } = useCV();
  const [parsed, setParsed] = useState<ParsedBackupResult | null>(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [confirmReplace, setConfirmReplace] = useState(false);

  const reset = () => {
    setParsed(null);
    setError('');
    setFileName('');
    setConfirmReplace(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError('');
    setParsed(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result;
        if (typeof raw !== 'string') throw new Error('Could not read that file as text.');
        setParsed(parseEditableBackup(raw, { allowLegacy: true }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Invalid editable backup file.');
      }
    };
    reader.onerror = () => setError('Could not read that file.');
    reader.readAsText(file);
  };

  const importAsNew = () => {
    if (!parsed) return;
    const cv = importCVAsNew(parsed.cv);
    toast.success('Editable backup imported as a new CV.');
    handleClose();
    navigate('/builder');
    return cv;
  };

  const replaceCurrentSession = () => {
    if (!parsed) return;
    replaceSessionWithCV(parsed.cv);
    toast.success('Current CV in this tab was replaced with the imported backup.');
    handleClose();
    navigate('/builder');
  };

  const exportedAt = parsed?.exportedAt ? format(new Date(parsed.exportedAt), 'MMM d, yyyy h:mm a') : 'Not provided';

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => (!value ? handleClose() : undefined)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Editable Backup</DialogTitle>
            <DialogDescription>
              Drop an editable backup (.json) you previously downloaded. The file is read in this tab only.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Choose Editable Backup JSON
            </Button>

            {fileName && (
              <p className="text-sm text-slate-600">
                Selected: <span className="font-medium">{fileName}</span>
              </p>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <strong>Import failed:</strong> {error}
              </div>
            )}

            {parsed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileJson className="h-5 w-5 text-purple-600" />
                    Backup Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div><span className="text-slate-500">CV name:</span> {parsed.cv.name}</div>
                  <div><span className="text-slate-500">Template:</span> {parsed.cv.template}</div>
                  <div><span className="text-slate-500">Exported:</span> {exportedAt}</div>
                  <div><span className="text-slate-500">Skills:</span> {parsed.cv.skills.length}</div>
                  <div><span className="text-slate-500">Experience items:</span> {parsed.cv.experiences.length}</div>
                  <div><span className="text-slate-500">Education items:</span> {parsed.cv.education.length}</div>
                  <div><span className="text-slate-500">Custom sections:</span> {parsed.cv.customSections.length}</div>
                  <div><span className="text-slate-500">Language:</span> {parsed.cv.language.toUpperCase()}</div>
                  {parsed.warnings.length > 0 && (
                    <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                      <div className="flex gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <p>{parsed.warnings.join(' ')}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <div className="flex flex-wrap gap-2">
              <Button disabled={!parsed} onClick={importAsNew}>
                Import as new CV
              </Button>
              <Button
                disabled={!parsed}
                variant={hasMeaningfulContent(currentCV) ? 'destructive' : 'outline'}
                onClick={() => {
                  if (hasMeaningfulContent(currentCV)) {
                    setConfirmReplace(true);
                  } else {
                    replaceCurrentSession();
                  }
                }}
              >
                Replace current CV
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={confirmReplace}
        title="Replace current CV in this tab?"
        description="This clears the current CV in this tab and loads the selected backup. Save a backup of your current CV first if you want to keep it."
        confirmLabel="Replace current CV"
        destructive
        onConfirm={replaceCurrentSession}
        onClose={() => setConfirmReplace(false)}
      />
    </>
  );
}
