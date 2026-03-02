import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCV } from '../context/cv-context';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Panel as ResizablePanel, PanelGroup as ResizablePanelGroup, PanelResizeHandle as ResizableHandle } from 'react-resizable-panels';
import {
  Home,
  Download,
  Undo2,
  Redo2,
  Eye,
  Settings,
  FileText,
  HelpCircle,
  User,
  Briefcase,
  GraduationCap,
  MoreHorizontal
} from 'lucide-react';
import { CVPreview } from '../components/cv-preview';
import { PersonalInfoEditor } from '../components/editors/personal-info-editor';
import { ExperienceEditor } from '../components/editors/experience-editor';
import { EducationEditor } from '../components/editors/education-editor';
import { SkillsEditor } from '../components/editors/skills-editor';
import { ProjectsEditor } from '../components/editors/projects-editor';
import { CertificationsEditor } from '../components/editors/certifications-editor';
import { LanguagesEditor } from '../components/editors/languages-editor';
import { AchievementsEditor } from '../components/editors/achievements-editor';
import { VolunteersEditor } from '../components/editors/volunteers-editor';
import { PublicationsEditor } from '../components/editors/publications-editor';
import { ReferencesEditor } from '../components/editors/references-editor';
import { CustomSectionsEditor } from '../components/editors/custom-sections-editor';
import { SettingsPanel } from '../components/settings-panel';
import { ExportDialog } from '../components/export-dialog';
import { HelpDialog } from '../components/help-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

export function CVBuilder() {
  const navigate = useNavigate();
  const { currentCV, undo, redo, canUndo, canRedo } = useCV();
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-gray-100">
                  <Home className="h-5 w-5 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="h-6 w-px bg-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800">{currentCV.name}</h2>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="hover:bg-gray-100"
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
                  className="hover:bg-gray-100"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-6 w-px bg-gray-300 mx-1" />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`hover:bg-gray-100 ${showPreview ? 'text-blue-600 bg-blue-50' : ''}`}
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
                  onClick={() => setShowSettings(!showSettings)}
                  className={`hover:bg-gray-100 ${showSettings ? 'text-blue-600 bg-blue-50' : ''}`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelpDialog(true)}
                  className="hover:bg-gray-100 text-gray-500"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            onClick={() => setShowExportDialog(true)} 
            className="gap-2 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Download className="h-4 w-4" />
            Export / Print
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={30}>
            {showSettings ? (
              <div className="h-full overflow-auto p-6 bg-white">
                <SettingsPanel />
              </div>
            ) : (
              <div className="h-full flex flex-col bg-white">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="border-b px-4 bg-gray-50/50">
                    <TabsList className="w-full justify-start overflow-x-auto h-auto py-2 bg-transparent">
                      <div className="flex space-x-2">
                        {/* Personal Group */}
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 flex items-center gap-1">
                            <User className="h-3 w-3" /> Personal
                          </div>
                          <div className="flex space-x-1">
                            <TabsTrigger value="personal" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Info & Summary</TabsTrigger>
                          </div>
                        </div>
                        
                        <div className="w-px h-10 bg-gray-200 self-center mx-2" />
                        
                        {/* Work Group */}
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> Work
                          </div>
                          <div className="flex space-x-1">
                            <TabsTrigger value="experience" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Experience</TabsTrigger>
                            <TabsTrigger value="projects" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Projects</TabsTrigger>
                          </div>
                        </div>
                        
                        <div className="w-px h-10 bg-gray-200 self-center mx-2" />
                        
                        {/* Education Group */}
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" /> Education
                          </div>
                          <div className="flex space-x-1">
                            <TabsTrigger value="education" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Education</TabsTrigger>
                            <TabsTrigger value="certifications" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Certificates</TabsTrigger>
                            <TabsTrigger value="skills" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Skills</TabsTrigger>
                          </div>
                        </div>
                        
                        <div className="w-px h-10 bg-gray-200 self-center mx-2" />
                        
                        {/* Other Group */}
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 flex items-center gap-1">
                            <MoreHorizontal className="h-3 w-3" /> Other
                          </div>
                          <div className="flex space-x-1 overflow-x-auto pb-1">
                            <TabsTrigger value="languages" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Languages</TabsTrigger>
                            <TabsTrigger value="achievements" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Awards</TabsTrigger>
                            <TabsTrigger value="volunteers" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Volunteer</TabsTrigger>
                            <TabsTrigger value="publications" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Publications</TabsTrigger>
                            <TabsTrigger value="references" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">References</TabsTrigger>
                            <TabsTrigger value="custom" className="text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Custom</TabsTrigger>
                          </div>
                        </div>
                      </div>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-auto p-6">
                    <TabsContent value="personal" className="mt-0"><PersonalInfoEditor /></TabsContent>
                    <TabsContent value="experience" className="mt-0"><ExperienceEditor /></TabsContent>
                    <TabsContent value="education" className="mt-0"><EducationEditor /></TabsContent>
                    <TabsContent value="skills" className="mt-0"><SkillsEditor /></TabsContent>
                    <TabsContent value="projects" className="mt-0"><ProjectsEditor /></TabsContent>
                    <TabsContent value="certifications" className="mt-0"><CertificationsEditor /></TabsContent>
                    <TabsContent value="languages" className="mt-0"><LanguagesEditor /></TabsContent>
                    <TabsContent value="achievements" className="mt-0"><AchievementsEditor /></TabsContent>
                    <TabsContent value="volunteers" className="mt-0"><VolunteersEditor /></TabsContent>
                    <TabsContent value="publications" className="mt-0"><PublicationsEditor /></TabsContent>
                    <TabsContent value="references" className="mt-0"><ReferencesEditor /></TabsContent>
                    <TabsContent value="custom" className="mt-0"><CustomSectionsEditor /></TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </ResizablePanel>

          {/* Preview Panel */}
          {showPreview && (
            <>
              <ResizableHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors" />
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full bg-gray-200 overflow-auto flex flex-col">
                  <div className="bg-white border-b px-4 py-2 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <span className="text-sm font-medium text-gray-600">Live Preview</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="h-8 text-gray-500 hover:text-gray-900">
                      Hide
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <CVPreview />
                  </div>
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
    </div>
  );
}