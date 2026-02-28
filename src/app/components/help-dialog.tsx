import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Keyboard, Lightbulb, Shield, BookOpen } from 'lucide-react';

interface HelpDialogProps {
  onClose: () => void;
}

export function HelpDialog({ onClose }: HelpDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Help & Guide</DialogTitle>
          <DialogDescription>
            Everything you need to know about using the Advanced CV Builder
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="getting-started">
              <BookOpen className="h-4 w-4 mr-2" />
              Guide
            </TabsTrigger>
            <TabsTrigger value="shortcuts">
              <Keyboard className="h-4 w-4 mr-2" />
              Shortcuts
            </TabsTrigger>
            <TabsTrigger value="tips">
              <Lightbulb className="h-4 w-4 mr-2" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Create Your CV</h3>
                  <p className="text-sm text-gray-600">
                    Start by clicking "Create New CV" from the dashboard. Give your CV a descriptive name
                    like "Software Engineer Resume" or "Marketing Manager CV".
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Fill in Your Information</h3>
                  <p className="text-sm text-gray-600">
                    Navigate through the tabs to add your personal information, work experience, education,
                    skills, and more. The CV preview updates in real-time as you type.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Optimize for ATS</h3>
                  <p className="text-sm text-gray-600">
                    Visit the ATS tab to check how well your CV will perform with Applicant Tracking Systems.
                    Use the Job Match feature to tailor your CV to specific job descriptions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Review Suggestions</h3>
                  <p className="text-sm text-gray-600">
                    Check the Suggestions tab for AI-powered recommendations to improve your CV content,
                    structure, and overall quality.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Export Your CV</h3>
                  <p className="text-sm text-gray-600">
                    When you're done, click the Export button to download your CV as PDF, plain text, or JSON.
                    Remember to save your work as nothing is stored on servers!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>Work faster with these shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Undo last change</span>
                    <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+Z</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Redo last change</span>
                    <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+Y</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Save/Export</span>
                    <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+S</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toggle preview</span>
                    <kbd className="px-2 py-1 bg-gray-100 border rounded text-sm">Ctrl+P</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>✨ Use Action Verbs:</strong> Start each bullet point with strong action verbs
                  like "Led", "Developed", "Achieved", "Improved".
                </div>
                <div>
                  <strong>📊 Quantify Everything:</strong> Include numbers and percentages wherever possible.
                  "Increased sales by 40%" is better than "Increased sales".
                </div>
                <div>
                  <strong>🎯 Tailor to the Job:</strong> Use the Job Match feature to align your CV with
                  specific job descriptions. Include relevant keywords.
                </div>
                <div>
                  <strong>📝 Keep it Concise:</strong> Aim for 1-2 pages max. Focus on recent and relevant
                  experience.
                </div>
                <div>
                  <strong>🔍 Proofread:</strong> Check for spelling and grammar errors. Read your CV out loud
                  to catch awkward phrasing.
                </div>
                <div>
                  <strong>🎨 Stay Professional:</strong> Use a clean, professional template. Avoid excessive
                  colors or graphics for most industries.
                </div>
                <div>
                  <strong>💼 Multiple Versions:</strong> Create different CV versions for different roles
                  or industries. Duplicate and customize as needed.
                </div>
                <div>
                  <strong>🔗 Include Links:</strong> Add links to your LinkedIn, GitHub, portfolio, or
                  published work where relevant.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">🔒 Your Data is Private</h3>
                  <p className="text-gray-600">
                    All your CV data is stored locally in your browser's session storage. Nothing is
                    sent to any server. We cannot see, access, or store your personal information.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">💾 Data Persistence</h3>
                  <p className="text-gray-600">
                    Your data persists only during your current session. When you close the browser tab
                    or clear your session, all data will be permanently deleted.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">📥 Export to Save</h3>
                  <p className="text-gray-600">
                    Always export your CV before closing the application. We recommend exporting as both
                    PDF (for applications) and JSON (as a backup that you can re-import later).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">🌐 Client-Side Processing</h3>
                  <p className="text-gray-600">
                    All CV generation, analysis, and export operations happen entirely in your browser.
                    Your data never leaves your device.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">⚠️ Important Reminders</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>This tool is not meant for storing sensitive personal data long-term</li>
                    <li>Always export your work before closing the browser</li>
                    <li>Use incognito/private mode for extra privacy if needed</li>
                    <li>No analytics or tracking is performed on your CV content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
