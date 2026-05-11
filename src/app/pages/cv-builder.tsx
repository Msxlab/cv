import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Panel as ResizablePanel, PanelGroup as ResizablePanelGroup, PanelResizeHandle as ResizableHandle } from 'react-resizable-panels';
import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  FileJson,
  GraduationCap,
  HandHeart,
  HelpCircle,
  Home,
  Languages,
  Layers,
  ListOrdered,
  MoreHorizontal,
  Paintbrush,
  Plus,
  Redo2,
  ShieldCheck,
  Trash2,
  Undo2,
  User,
  Wrench,
} from 'lucide-react';
import { useCV } from '../context/cv-context';
import { useIsMobile } from '../components/ui/use-mobile';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { Notice } from '../components/ui/notice';
import { CVPreview } from '../components/cv-preview';
import { ExportDialog } from '../components/export-dialog';
import { HelpDialog } from '../components/help-dialog';
import { ConfirmActionDialog } from '../components/confirm-action-dialog';
import { BackupImportDialog } from '../components/backup-import-dialog';
import { SessionStatus } from '../components/session-status';
import { SectionOrderPanel } from '../components/section-order-panel';
import { AchievementsEditor } from '../components/editors/achievements-editor';
import { CertificationsEditor } from '../components/editors/certifications-editor';
import { CustomSectionsEditor } from '../components/editors/custom-sections-editor';
import { EducationEditor } from '../components/editors/education-editor';
import { ExperienceEditor } from '../components/editors/experience-editor';
import { LanguagesEditor } from '../components/editors/languages-editor';
import { PersonalInfoEditor } from '../components/editors/personal-info-editor';
import { ProjectsEditor } from '../components/editors/projects-editor';
import { PublicationsEditor } from '../components/editors/publications-editor';
import { ReferencesEditor } from '../components/editors/references-editor';
import { SkillsEditor } from '../components/editors/skills-editor';
import { VolunteersEditor } from '../components/editors/volunteers-editor';
import { SettingsPanel } from '../components/settings-panel';
import { BrandMark } from '../components/brand-logo';

type BuilderSectionId =
  | 'personal'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'skills'
  | 'languages'
  | 'achievements'
  | 'volunteers'
  | 'publications'
  | 'references'
  | 'custom'
  | 'sectionOrder';

interface BuilderSection {
  id: BuilderSectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'main' | 'more';
}

const builderSections: BuilderSection[] = [
  { id: 'personal', label: 'Profile', icon: User, group: 'main' },
  { id: 'experience', label: 'Experience', icon: Briefcase, group: 'main' },
  { id: 'education', label: 'Education', icon: GraduationCap, group: 'main' },
  { id: 'skills', label: 'Skills', icon: Wrench, group: 'main' },
  { id: 'projects', label: 'Projects', icon: Layers, group: 'main' },
  { id: 'certifications', label: 'Certifications', icon: FileText, group: 'more' },
  { id: 'languages', label: 'Languages', icon: Languages, group: 'more' },
  { id: 'achievements', label: 'Awards', icon: Award, group: 'more' },
  { id: 'volunteers', label: 'Volunteer', icon: HandHeart, group: 'more' },
  { id: 'publications', label: 'Publications', icon: FileText, group: 'more' },
  { id: 'references', label: 'References', icon: User, group: 'more' },
  { id: 'custom', label: 'Custom', icon: Plus, group: 'more' },
  { id: 'sectionOrder', label: 'Reorder sections', icon: ListOrdered, group: 'more' },
];

const editorComponents: Record<BuilderSectionId, React.ComponentType> = {
  personal: PersonalInfoEditor,
  experience: ExperienceEditor,
  projects: ProjectsEditor,
  education: EducationEditor,
  certifications: CertificationsEditor,
  skills: SkillsEditor,
  languages: LanguagesEditor,
  achievements: AchievementsEditor,
  volunteers: VolunteersEditor,
  publications: PublicationsEditor,
  references: ReferencesEditor,
  custom: CustomSectionsEditor,
  sectionOrder: SectionOrderPanel,
};

type MobileTab = 'edit' | 'preview' | 'design';

export function CVBuilder() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    currentCV,
    undo,
    redo,
    canUndo,
    canRedo,
    endSession,
    saveStatus,
    lastSavedAt,
    lastBackupExportedAt,
  } = useCV();
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<BuilderSectionId>('personal');
  const [showDesign, setShowDesign] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showBackupImport, setShowBackupImport] = useState(false);
  const [confirmEndSession, setConfirmEndSession] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');

  useEffect(() => {
    if (!currentCV) {
      navigate('/');
    }
  }, [currentCV, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
        if (e.key === 's') { e.preventDefault(); setShowExportDialog(true); }
        if (e.key === 'p') { e.preventDefault(); setShowPreview(prev => !prev); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  if (!currentCV) return null;

  const backupStale = !lastBackupExportedAt || lastBackupExportedAt < currentCV.updatedAt;

  const mainSections = builderSections.filter((s) => s.group === 'main');
  const moreSections = builderSections.filter((s) => s.group === 'more');

  const ActiveEditor = editorComponents[activeTab];
  const activeSection = builderSections.find((s) => s.id === activeTab) || builderSections[0];
  const activeIdx = Math.max(0, builderSections.findIndex((s) => s.id === activeTab));
  const previousSection = activeIdx > 0 ? builderSections[activeIdx - 1] : null;
  const nextSection = activeIdx < builderSections.length - 1 ? builderSections[activeIdx + 1] : null;

  const goToSection = (id: BuilderSectionId) => {
    setActiveTab(id);
    setShowDesign(false);
    if (isMobile) setMobileTab('edit');
  };

  const topBar = (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 bg-white/95 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/')} className="h-9 w-9 shrink-0 rounded-xl" aria-label="Back to dashboard">
          <Home className="h-4 w-4" />
        </Button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="hidden shrink-0 items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-slate-100 sm:flex"
          aria-label="Cyber Warriors - PonyCot home"
        >
          <BrandMark size={28} className="rounded-lg shadow-sm ring-1 ring-slate-900/5" />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 lg:inline">
            PonyCot
          </span>
        </button>
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{currentCV.name}</p>
          <p className="hidden text-xs text-slate-500 sm:block">{activeSection.label}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <SessionStatus
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          lastExportedAt={lastBackupExportedAt}
          backupStale={backupStale}
          compact
          className="hidden md:flex"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="rounded-xl" aria-label="Undo">
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="rounded-xl" aria-label="Redo">
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <Button
          variant={showDesign ? 'default' : 'outline'}
          onClick={() => {
            const next = !showDesign;
            setShowDesign(next);
            if (isMobile) setMobileTab(next ? 'design' : 'edit');
          }}
          className="gap-2 rounded-xl"
        >
          <Paintbrush className="h-4 w-4" /> Design
        </Button>

        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview((prev) => !prev)}
                className={`rounded-xl ${showPreview ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : ''}`}
                aria-label={showPreview ? 'Hide preview' : 'Show preview'}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{showPreview ? 'Hide preview (Ctrl+P)' : 'Show preview (Ctrl+P)'}</TooltipContent>
          </Tooltip>
        )}

        <Button
          onClick={() => setShowExportDialog(true)}
          className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem onSelect={() => setShowBackupImport(true)}>
              <FileJson className="mr-2 h-4 w-4" /> Restore from .json backup
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowHelpDialog(true)}>
              <HelpCircle className="mr-2 h-4 w-4" /> Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-red-700">Danger zone</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              onSelect={() => setConfirmEndSession(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear all session data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const editorContent = (
    <ScrollArea className="h-full min-h-0">
      <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
        {backupStale && (
          <Notice tone="warning" icon={ShieldCheck}>
            <p>
              <strong>Backup needed.</strong> Save a backup (.json) to keep this CV. Without one, this CV cannot be recovered after you close this tab.
            </p>
          </Notice>
        )}

        <ActiveEditor />

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-slate-900">
              {nextSection ? `Next: ${nextSection.label}` : 'You’re at the last section.'}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {nextSection ? 'Save a backup (.json) any time to keep this CV.' : 'When you’re ready, export or save a backup.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => previousSection && goToSection(previousSection.id)}
              disabled={!previousSection}
              className="gap-2 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            {nextSection ? (
              <Button
                onClick={() => goToSection(nextSection.id)}
                className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowExportDialog(true)}
                className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                <Download className="h-4 w-4" /> Export
              </Button>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  const designPanel = (
    <ScrollArea className="h-full min-h-0">
      <div className="p-4 sm:p-6">
        <SettingsPanel />
      </div>
    </ScrollArea>
  );

  const previewPanel = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-200/70">
      <div className="border-b border-slate-200 bg-white/90 px-4 py-2 text-xs text-slate-500">
        Live preview · updates as you edit
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <CVPreview />
      </ScrollArea>
    </div>
  );

  const sidebar = (
    <aside className="hidden md:flex w-60 flex-col border-r border-slate-200 bg-white/80">
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-3">
        <BrandMark size={26} className="rounded-md shadow-sm ring-1 ring-slate-900/5" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[11px] font-semibold text-slate-900">Cyber Warriors</p>
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-amber-700">PonyCot</p>
        </div>
      </div>
      <div className="border-b border-slate-200 p-3">
        <SessionStatus
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          lastExportedAt={lastBackupExportedAt}
          backupStale={backupStale}
          compact
        />
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-3 p-2">
          <ul className="space-y-1">
            {mainSections.map((section) => (
              <SidebarItem
                key={section.id}
                section={section}
                active={!showDesign && activeTab === section.id}
                onClick={() => goToSection(section.id)}
              />
            ))}
          </ul>
          <div>
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">More sections</p>
            <ul className="space-y-1">
              {moreSections.map((section) => (
                <SidebarItem
                  key={section.id}
                  section={section}
                  active={!showDesign && activeTab === section.id}
                  onClick={() => goToSection(section.id)}
                />
              ))}
            </ul>
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );

  if (isMobile) {
    return (
      <div className="flex h-screen min-h-0 flex-col bg-slate-100 text-slate-900">
        {topBar}
        <div className="min-h-0 flex-1 overflow-hidden">
          {mobileTab === 'edit' && (
            <div className="flex h-full min-h-0 flex-col">
              <div className="border-b border-slate-200 bg-white px-3 py-2">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as BuilderSectionId)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  aria-label="Section"
                >
                  <optgroup label="Main">
                    {mainSections.map((section) => (
                      <option key={section.id} value={section.id}>{section.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="More sections">
                    {moreSections.map((section) => (
                      <option key={section.id} value={section.id}>{section.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">{editorContent}</div>
            </div>
          )}
          {mobileTab === 'preview' && (
            <div className="h-full min-h-0 overflow-hidden">{previewPanel}</div>
          )}
          {mobileTab === 'design' && (
            <div className="h-full min-h-0 overflow-hidden">{designPanel}</div>
          )}
        </div>
        <Tabs value={mobileTab} onValueChange={(v) => { setMobileTab(v as MobileTab); if (v === 'design') setShowDesign(true); else setShowDesign(false); }} className="border-t border-slate-200 bg-white">
          <TabsList className="grid w-full grid-cols-4 rounded-none bg-white">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="export" onClick={(e) => { e.preventDefault(); setShowExportDialog(true); }}>
              Export
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {showExportDialog && <ExportDialog onClose={() => setShowExportDialog(false)} />}
        {showHelpDialog && <HelpDialog onClose={() => setShowHelpDialog(false)} />}
        <BackupImportDialog open={showBackupImport} onClose={() => setShowBackupImport(false)} />
        <ConfirmActionDialog
          open={confirmEndSession}
          title="Clear all session data?"
          description="This removes every CV in this tab. Without a backup file, this CV cannot be recovered after you continue."
          confirmLabel="Clear all session data"
          destructive
          onConfirm={() => {
            endSession();
            navigate('/');
          }}
          onClose={() => setConfirmEndSession(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-0 flex-col bg-slate-100 text-slate-900">
      {topBar}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {sidebar}
        <main className="flex min-h-0 flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
            <ResizablePanel defaultSize={showDesign || !showPreview ? 100 : 50} minSize={32}>
              <div className="flex h-full min-h-0 flex-col overflow-hidden">
                {showDesign ? designPanel : editorContent}
              </div>
            </ResizablePanel>
            {!showDesign && showPreview && (
              <>
                <ResizableHandle className="w-1 bg-slate-200 transition-colors hover:bg-blue-400" />
                <ResizablePanel defaultSize={50} minSize={30}>
                  {previewPanel}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </main>
      </div>

      {showExportDialog && <ExportDialog onClose={() => setShowExportDialog(false)} />}
      {showHelpDialog && <HelpDialog onClose={() => setShowHelpDialog(false)} />}
      <BackupImportDialog open={showBackupImport} onClose={() => setShowBackupImport(false)} />
      <ConfirmActionDialog
        open={confirmEndSession}
        title="Clear all session data?"
        description="This removes every CV in this tab. Without a backup file, this CV cannot be recovered after you continue."
        confirmLabel="Clear all session data"
        destructive
        onConfirm={() => {
          endSession();
          navigate('/');
        }}
        onClose={() => setConfirmEndSession(false)}
      />
    </div>
  );
}

function SidebarItem({
  section,
  active,
  onClick,
}: {
  section: BuilderSection;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = section.icon;
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
          active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{section.label}</span>
      </button>
    </li>
  );
}
