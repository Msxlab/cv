import { useNavigate } from 'react-router';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Copy, FileJson, FileText, MoreVertical, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useCV } from '../context/cv-context';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { Notice } from '../components/ui/notice';
import { ConfirmActionDialog } from '../components/confirm-action-dialog';
import { BackupImportDialog } from '../components/backup-import-dialog';
import { CVTemplateRenderer } from '../components/cv-preview';
import { BrandLockup } from '../components/brand-logo';

type PendingAction = 'start-new' | 'clear-all' | null;

export function Dashboard() {
  const navigate = useNavigate();
  const {
    cvs,
    currentCV,
    startNewCV,
    selectCV,
    deleteCV,
    duplicateCV,
    clearAllData,
    hasMeaningfulContent,
  } = useCV();
  const [showBackupImport, setShowBackupImport] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [newCVName, setNewCVName] = useState('My Resume');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const currentSessionHasContent = cvs.some((cv) => hasMeaningfulContent(cv));

  const runStartNewCV = () => {
    const cv = startNewCV(newCVName);
    selectCV(cv.id);
    setShowStartDialog(false);
    navigate('/builder');
    toast.success('New CV started in this tab.');
  };

  const requestStartNewCV = () => {
    if (currentSessionHasContent) {
      setPendingAction('start-new');
      return;
    }
    setShowStartDialog(true);
  };

  const handleSelectCV = (id: string) => {
    selectCV(id);
    navigate('/builder');
  };

  const confirmPendingAction = () => {
    if (pendingAction === 'start-new') {
      setPendingAction(null);
      setShowStartDialog(true);
      return;
    }

    if (pendingAction === 'clear-all') {
      clearAllData();
      toast.success('All session data cleared.');
      setPendingAction(null);
      navigate('/');
    }
  };

  const pendingDescription =
    pendingAction === 'start-new'
      ? 'This clears the current session before creating a fresh CV. Save a backup (.json) first if you want to keep the current CV.'
      : 'This permanently removes every CV in this tab, including photos and drafts. Without a backup file, this CV cannot be recovered after you continue.';

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <BrandLockup size="lg" />
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:self-auto">
            <ShieldCheck className="h-3.5 w-3.5" />
            Browser-only · never uploaded
          </span>
        </div>
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your CV workspace</h1>
          <p className="max-w-xl text-slate-600">
            Build a CV in this tab. Nothing is uploaded. Save a backup file to come back later.
          </p>
        </header>

        <Notice tone="privacy" className="mb-6">
          <p>
            <strong>Survives a refresh. Not a tab close.</strong> Download an editable backup (.json) to keep this CV
            and drop it back in here later to keep editing.
          </p>
        </Notice>

        <div className="mb-8 flex flex-wrap gap-3">
          <Button onClick={requestStartNewCV} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create new CV
          </Button>
          <Button variant="outline" size="lg" onClick={() => setShowBackupImport(true)} className="gap-2">
            <FileJson className="h-4 w-4" />
            Restore from .json backup
          </Button>
        </div>

        {cvs.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Your CVs in this tab
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cvs.map((cv) => (
                <Card
                  key={cv.id}
                  className={`group overflow-hidden transition-shadow hover:shadow-lg ${
                    currentCV?.id === cv.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectCV(cv.id)}
                    className="block w-full bg-slate-50 text-left"
                    aria-label={`Open ${cv.name} in editor`}
                  >
                    <div className="relative h-48 overflow-hidden border-b border-slate-200">
                      <div
                        className="origin-top-left"
                        style={{ transform: 'scale(0.22)', width: '210mm', transformOrigin: 'top left' }}
                        aria-hidden="true"
                      >
                        <CVTemplateRenderer cv={cv} />
                      </div>
                      {!hasMeaningfulContent(cv) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 text-xs text-slate-500">
                          Empty CV - click to start
                        </div>
                      )}
                    </div>
                  </button>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between gap-2 text-base">
                      <span className="truncate">{cv.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Open menu for ${cv.name}`}
                            className="h-8 w-8 flex-shrink-0"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleSelectCV(cv.id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              duplicateCV(cv.id);
                              toast.success('CV duplicated in this tab.');
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700"
                            onSelect={() => setPendingDeleteId(cv.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>
                    <CardDescription>
                      {cv.personalInfo.firstName && cv.personalInfo.lastName
                        ? `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`
                        : 'No name added yet'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Template</span>
                      <span className="capitalize text-slate-700">{cv.template}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated</span>
                      <span className="text-slate-700">{format(new Date(cv.updatedAt), 'MMM d')}</span>
                    </div>
                    <Button size="sm" onClick={() => handleSelectCV(cv.id)} className="mt-3 w-full">
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          <Card className="mb-12 p-10 text-center">
            <FileText className="mx-auto mb-4 h-14 w-14 text-slate-300" />
            <h3 className="mb-1 text-xl font-semibold">No CVs yet in this tab</h3>
            <p className="mb-5 text-slate-600">Create a new CV or restore from a .json backup.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={requestStartNewCV} className="gap-2">
                <Plus className="h-4 w-4" />
                Create new CV
              </Button>
              <Button variant="outline" onClick={() => setShowBackupImport(true)} className="gap-2">
                <FileJson className="h-4 w-4" />
                Restore from .json backup
              </Button>
            </div>
          </Card>
        )}

        <section className="mt-12 border-t border-slate-200 pt-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Danger zone</h2>
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-700">
              <strong className="text-red-800">Clear all session data.</strong>{' '}
              <span className="text-slate-600">
                Removes every CV in this tab. Without a backup file, this CV cannot be recovered after you continue.
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setPendingAction('clear-all')}
              className="gap-2 border-red-200 text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Clear all session data
            </Button>
          </div>
        </section>
      </div>

      <BackupImportDialog open={showBackupImport} onClose={() => setShowBackupImport(false)} />

      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create new CV</DialogTitle>
            <DialogDescription>
              Build it in this tab. Save a backup (.json) when you want to come back to it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="new-cv-name">CV name</label>
            <Input
              id="new-cv-name"
              value={newCVName}
              onChange={(event) => setNewCVName(event.target.value)}
              placeholder="My Resume"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDialog(false)}>Cancel</Button>
            <Button onClick={runStartNewCV}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={pendingAction !== null}
        title={pendingAction === 'start-new' ? 'Clear current CV first?' : 'Clear all session data?'}
        description={pendingDescription}
        confirmLabel={pendingAction === 'start-new' ? 'Continue' : 'Clear all session data'}
        destructive={pendingAction === 'clear-all'}
        onConfirm={confirmPendingAction}
        onClose={() => setPendingAction(null)}
      />

      <ConfirmActionDialog
        open={pendingDeleteId !== null}
        title="Delete this CV?"
        description="Removes this CV from this tab. Save a backup first if you want to keep it."
        confirmLabel="Delete CV"
        destructive
        onConfirm={() => {
          if (pendingDeleteId) {
            deleteCV(pendingDeleteId);
            toast.success('CV deleted.');
          }
          setPendingDeleteId(null);
        }}
        onClose={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
