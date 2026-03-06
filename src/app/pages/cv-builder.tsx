import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Panel as ResizablePanel, PanelGroup as ResizablePanelGroup, PanelResizeHandle as ResizableHandle } from 'react-resizable-panels';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  MoreHorizontal,
  Redo2,
  Settings,
  Undo2,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '../components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { CVPreview } from '../components/cv-preview';
import { ExportDialog } from '../components/export-dialog';
import { HelpDialog } from '../components/help-dialog';
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
import { useCV } from '../context/cv-context';

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
  | 'custom';

interface BuilderSection {
  id: BuilderSectionId;
  label: string;
  description: string;
  icon: any;
}

const editorComponents: Record<BuilderSectionId, any> = {
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
};

const builderSectionGroups: Array<{ label: string; items: BuilderSection[] }> = [
  {
    label: 'Start Here',
    items: [
      {
        id: 'personal',
        label: 'Profile',
        description: 'Add your name, contact details, role and summary.',
        icon: User,
      },
    ],
  },
  {
    label: 'Career',
    items: [
      {
        id: 'experience',
        label: 'Experience',
        description: 'List your roles, achievements and current positions.',
        icon: Briefcase,
      },
      {
        id: 'projects',
        label: 'Projects',
        description: 'Show portfolio work, products and important links.',
        icon: FileText,
      },
    ],
  },
  {
    label: 'Qualifications',
    items: [
      {
        id: 'education',
        label: 'Education',
        description: 'Capture schools, degrees and academic details.',
        icon: GraduationCap,
      },
      {
        id: 'certifications',
        label: 'Certificates',
        description: 'Add certifications, licenses and short courses.',
        icon: FileText,
      },
      {
        id: 'skills',
        label: 'Skills',
        description: 'Highlight tools, strengths and technical coverage.',
        icon: MoreHorizontal,
      },
    ],
  },
  {
    label: 'Extras',
    items: [
      {
        id: 'languages',
        label: 'Languages',
        description: 'Show spoken languages and proficiency levels.',
        icon: MoreHorizontal,
      },
      {
        id: 'achievements',
        label: 'Awards',
        description: 'Surface recognitions, awards and standout wins.',
        icon: MoreHorizontal,
      },
      {
        id: 'volunteers',
        label: 'Volunteer',
        description: 'Include community work and volunteer experience.',
        icon: MoreHorizontal,
      },
      {
        id: 'publications',
        label: 'Publications',
        description: 'Add articles, papers, talks or written work.',
        icon: FileText,
      },
      {
        id: 'references',
        label: 'References',
        description: 'List professional references and availability notes.',
        icon: FileText,
      },
      {
        id: 'custom',
        label: 'Custom',
        description: 'Create tailored sections for the target role.',
        icon: FileText,
      },
    ],
  },
];

const builderSections = builderSectionGroups.flatMap((group) => group.items);

export function CVBuilder() {
  const navigate = useNavigate();
  const { currentCV, undo, redo, canUndo, canRedo } = useCV();
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<BuilderSectionId>('personal');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
  }, [undo, redo, setShowExportDialog, setShowPreview]);

  if (!currentCV) return null;

  const activeSectionIndex = builderSections.findIndex((section) => section.id === activeTab);
  const safeActiveSectionIndex = activeSectionIndex >= 0 ? activeSectionIndex : 0;
  const activeSection = builderSections[safeActiveSectionIndex];
  const ActiveEditor = editorComponents[activeSection.id];
  const previousSection = safeActiveSectionIndex > 0 ? builderSections[safeActiveSectionIndex - 1] : null;
  const nextSection = safeActiveSectionIndex < builderSections.length - 1 ? builderSections[safeActiveSectionIndex + 1] : null;
  const progressValue = ((safeActiveSectionIndex + 1) / builderSections.length) * 100;

  const selectSection = (sectionId: BuilderSectionId) => {
    setShowSettings(false);
    setActiveTab(sectionId);
  };

  const goToPreviousSection = () => {
    if (previousSection) {
      selectSection(previousSection.id);
    }
  };

  const goToNextSection = () => {
    if (nextSection) {
      selectSection(nextSection.id);
    }
  };

  return (
    <SidebarProvider defaultOpen className="h-screen min-h-0 bg-slate-100 text-slate-900">
      <Sidebar variant="inset" className="border-slate-200/80">
        <SidebarHeader className="gap-4 border-b border-slate-200/70 bg-white/90 px-3 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/')} className="size-9 shrink-0 rounded-xl">
              <Home className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{currentCV.name}</p>
              <p className="text-xs text-slate-500">Guided CV builder with live preview</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="min-h-0 bg-white/70">
          <ScrollArea className="h-full min-h-0">
            <div className="space-y-2 p-2">
              {builderSectionGroups.map((group) => (
                <SidebarGroup key={group.label}>
                  <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((section) => (
                        <SidebarMenuItem key={section.id}>
                          <SidebarMenuButton
                            isActive={!showSettings && section.id === activeTab}
                            onClick={() => selectSection(section.id)}
                            className="h-auto items-start gap-3 rounded-2xl px-3 py-3 text-left data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                          >
                            <section.icon className="mt-0.5 h-4 w-4 shrink-0" />
                            <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                              <span className="truncate text-sm font-medium">{section.label}</span>
                              <span className="line-clamp-2 text-xs text-slate-500">{section.description}</span>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              {String(builderSections.findIndex((item) => item.id === section.id) + 1).padStart(2, '0')}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="gap-2 bg-white/90 p-3">
          <Button
            variant={showSettings ? 'default' : 'outline'}
            onClick={() => setShowSettings((prev) => !prev)}
            className="w-full justify-start gap-2 rounded-xl"
          >
            <Settings className="h-4 w-4" />
            {showSettings ? 'Back to sections' : 'Settings'}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(true)}
              className="justify-start gap-2 rounded-xl"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHelpDialog(true)}
              className="justify-start gap-2 rounded-xl"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="h-full min-h-0 overflow-hidden bg-slate-100">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Main Content */}
          <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={showPreview ? 46 : 100} minSize={32}>
              <div className="flex h-full min-h-0 flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="border-b border-slate-200/70 bg-white/85 px-4 py-3 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <SidebarTrigger className="-ml-1 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900" />
                      <div className="hidden h-6 w-px bg-slate-200 md:block" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{showSettings ? 'Visual Settings' : activeSection.label}</p>
                          {!showSettings && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
                              Step {safeActiveSectionIndex + 1} / {builderSections.length}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-xs text-slate-500">
                          {showSettings
                            ? 'Adjust layout, fonts and color treatments without leaving the builder.'
                            : activeSection.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={undo}
                            disabled={!canUndo}
                            className="rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={redo}
                            disabled={!canRedo}
                            className="rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Redo2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPreview((prev) => !prev)}
                            className={`rounded-xl ${showPreview ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{showPreview ? 'Hide Preview (Ctrl+P)' : 'Show Preview (Ctrl+P)'}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSettings((prev) => !prev)}
                            className={`rounded-xl ${showSettings ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{showSettings ? 'Back to sections' : 'Open Settings'}</TooltipContent>
                      </Tooltip>

                      <Button
                        onClick={() => setShowExportDialog(true)}
                        className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Download className="h-4 w-4" />
                        Export / Print
                      </Button>
                    </div>
                  </div>
                </div>

                {showSettings ? (
                  <ScrollArea className="min-h-0 flex-1">
                    <div className="p-6">
                      <div className="mx-auto max-w-5xl">
                        <SettingsPanel />
                      </div>
                    </div>
                  </ScrollArea>
                ) : (
                  <ScrollArea className="min-h-0 flex-1">
                    <div className="p-6">
                      <div className="mx-auto flex max-w-6xl flex-col gap-6">
                        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-sm">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-2">
                              <p className="text-xs font-medium uppercase tracking-[0.12em] text-blue-600">Guided step</p>
                              <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{activeSection.label}</h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{activeSection.description}</p>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm">
                              <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">Live preview</p>
                              <p className="mt-1 font-medium text-slate-900">{showPreview ? 'Visible on the right' : 'Hidden for focus mode'}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPreview((prev) => !prev)}
                                className="-ml-2 mt-1 h-8 px-2 text-xs text-slate-600"
                              >
                                {showPreview ? 'Hide preview' : 'Show preview'}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <ActiveEditor />

                        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{nextSection ? `Next: ${nextSection.label}` : 'Final step complete'}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {nextSection ? nextSection.description : 'When the preview looks right, export or print your CV.'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              onClick={goToPreviousSection}
                              disabled={!previousSection}
                              className="gap-2 rounded-xl"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>

                            {nextSection ? (
                              <Button
                                onClick={goToNextSection}
                                className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                              >
                                Next
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => setShowExportDialog(true)}
                                className="gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                              >
                                <Download className="h-4 w-4" />
                                Export / Print
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </div>
            </ResizablePanel>

            {/* Preview Panel */}
            {showPreview && (
              <>
                <ResizableHandle className="w-1 bg-slate-200 transition-colors hover:bg-blue-400" />
                <ResizablePanel defaultSize={54} minSize={30}>
                  <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-200/80">
                    <div className="border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Live Preview</p>
                          <p className="text-xs text-slate-500">Your CV updates while you edit content, settings and layout.</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                          Hide
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="min-h-0 flex-1">
                      <CVPreview />
                    </ScrollArea>
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Export Dialog */}
        {showExportDialog && (
          <ExportDialog onClose={() => setShowExportDialog(false)} />
        )}

        {/* Help Dialog */}
        {showHelpDialog && (
          <HelpDialog onClose={() => setShowHelpDialog(false)} />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}