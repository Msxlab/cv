import { BookOpen, Keyboard, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BrandLockup } from './brand-logo';

interface HelpDialogProps {
  onClose: () => void;
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-auto">
        <DialogHeader>
          <div className="mb-3 border-b border-slate-200 pb-3">
            <BrandLockup size="md" />
          </div>
          <DialogTitle>Help & About</DialogTitle>
          <DialogDescription>
            Cyber Warriors - PonyCot · Browser-only · never uploaded. Save a backup (.json) to keep editing later.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="getting-started"><BookOpen className="mr-2 h-4 w-4" />Guide</TabsTrigger>
            <TabsTrigger value="shortcuts"><Keyboard className="mr-2 h-4 w-4" />Shortcuts</TabsTrigger>
            <TabsTrigger value="privacy"><Shield className="mr-2 h-4 w-4" />Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Core workflow</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p><strong>1. Build a CV in this tab.</strong> Survives a refresh. Not a tab close.</p>
                <p><strong>2. Choose a template.</strong> Use Design to compare templates, accents, fonts and layout.</p>
                <p><strong>3. Reorder sections.</strong> Section order is used by templates, PDF, DOCX and editable backups.</p>
                <p><strong>4. Download a PDF or Word DOCX file.</strong> Use these files to apply with your CV.</p>
                <p><strong>5. Download an editable backup (.json).</strong> Drop this file back in later to keep editing.</p>
                <p><strong>6. Clear all session data.</strong> Without a backup file, this CV cannot be recovered after you continue.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Keyboard shortcuts</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span>Undo last change</span><kbd className="rounded border bg-slate-100 px-2 py-1">Ctrl+Z</kbd></div>
                <div className="flex justify-between"><span>Redo last change</span><kbd className="rounded border bg-slate-100 px-2 py-1">Ctrl+Y</kbd></div>
                <div className="flex justify-between"><span>Open export</span><kbd className="rounded border bg-slate-100 px-2 py-1">Ctrl+S</kbd></div>
                <div className="flex justify-between"><span>Toggle preview</span><kbd className="rounded border bg-slate-100 px-2 py-1">Ctrl+P</kbd></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Privacy and data</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p><strong>Browser-only · never uploaded.</strong> CV content stays in this tab. Nothing is sent to a server.</p>
                <p><strong>No accounts.</strong> No login, no database, no cloud sync, no payments, no analytics.</p>
                <p><strong>Editable backups.</strong> .json files are downloaded to your device. Drop one back in to keep editing.</p>
                <p><strong>Local fonts.</strong> The app uses your system fonts and does not request external font services.</p>
                <p><strong>Tab close means the session can be gone.</strong> Survives a refresh. Not a tab close.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
