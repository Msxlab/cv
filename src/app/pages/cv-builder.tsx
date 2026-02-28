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

export function CVBuilder() {
  const navigate = useNavigate();
  const { currentCV, undo, redo, canUndo, canRedo } = useCV();
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h2 className="text-lg">{currentCV.name}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelpDialog(true)}
            title="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowExportDialog(true)} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={30}>
            <div className="h-full overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="bg-white border-b px-4 sticky top-0 z-10">
                  <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="personal" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Personal
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="gap-2">
                      Experience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="gap-2">
                      Education
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="gap-2">
                      Skills
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="gap-2">
                      Projects
                    </TabsTrigger>
                    <TabsTrigger value="certifications" className="gap-2">
                      Certificates
                    </TabsTrigger>
                    <TabsTrigger value="languages" className="gap-2">
                      Languages
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="gap-2">
                      Awards
                    </TabsTrigger>
                    <TabsTrigger value="volunteers" className="gap-2">
                      Volunteer
                    </TabsTrigger>
                    <TabsTrigger value="publications" className="gap-2">
                      Publications
                    </TabsTrigger>
                    <TabsTrigger value="references" className="gap-2">
                      References
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="gap-2">
                      Custom
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <TabsContent value="personal" className="mt-0">
                    <PersonalInfoEditor />
                  </TabsContent>
                  <TabsContent value="experience" className="mt-0">
                    <ExperienceEditor />
                  </TabsContent>
                  <TabsContent value="education" className="mt-0">
                    <EducationEditor />
                  </TabsContent>
                  <TabsContent value="skills" className="mt-0">
                    <SkillsEditor />
                  </TabsContent>
                  <TabsContent value="projects" className="mt-0">
                    <ProjectsEditor />
                  </TabsContent>
                  <TabsContent value="certifications" className="mt-0">
                    <CertificationsEditor />
                  </TabsContent>
                  <TabsContent value="languages" className="mt-0">
                    <LanguagesEditor />
                  </TabsContent>
                  <TabsContent value="achievements" className="mt-0">
                    <AchievementsEditor />
                  </TabsContent>
                  <TabsContent value="volunteers" className="mt-0">
                    <VolunteersEditor />
                  </TabsContent>
                  <TabsContent value="publications" className="mt-0">
                    <PublicationsEditor />
                  </TabsContent>
                  <TabsContent value="references" className="mt-0">
                    <ReferencesEditor />
                  </TabsContent>
                  <TabsContent value="custom" className="mt-0">
                    <CustomSectionsEditor />
                  </TabsContent>
                  <TabsContent value="settings" className="mt-0">
                    <SettingsPanel />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </ResizablePanel>

          {/* Preview Panel */}
          {showPreview && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full bg-gray-100 overflow-auto">
                  <CVPreview />
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