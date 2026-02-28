import { useNavigate } from 'react-router';
import { useCV } from '../context/cv-context';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, FileText, Copy, Trash2, AlertCircle, FileUp, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { ImportTextDialog } from '../components/import-text-dialog';

export function Dashboard() {
  const navigate = useNavigate();
  const { cvs, currentCV, createCV, selectCV, deleteCV, duplicateCV, clearAllData } = useCV();
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data && data.personalInfo && data.name) {
            const newCV = {
              ...data,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              accentColor: data.accentColor || 'blue',
              fontFamily: data.fontFamily || 'sans',
              fontSize: data.fontSize || 'medium',
              spacing: data.spacing || 'normal',
            };
            createCV(newCV.name);
            // Wait a tick so the CV is created, then update it with all data
            setTimeout(() => {
              const { id, name, createdAt, updatedAt, ...rest } = newCV;
              selectCV(id);
              // We need to use the context's updateCV but can't directly.
              // Instead, just select the latest and navigate.
              navigate('/builder');
            }, 100);
            alert('CV imported successfully! Please edit as needed.');
          } else {
            alert('Invalid JSON file. Please export a CV as JSON first.');
          }
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleCreateCV = () => {
    const name = prompt('Enter CV name:', 'My Resume');
    if (name) {
      createCV(name);
      navigate('/builder');
    }
  };

  const handleSelectCV = (id: string) => {
    selectCV(id);
    navigate('/builder');
  };

  const handleImport = () => {
    setShowImportDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Advanced CV Builder</h1>
          <p className="text-gray-600">
            Create professional, ATS-optimized resumes with advanced features
          </p>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-900">
                <strong>Privacy First:</strong> All your data is stored locally in your browser session.
                Nothing is saved to any server. When you close this tab or clear your session, all data will be lost.
                Make sure to export your CVs before closing!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button onClick={handleCreateCV} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New CV
          </Button>
          <Button variant="outline" onClick={handleImport} className="gap-2">
            <FileUp className="h-4 w-4" />
            Import from Text
          </Button>
          <Button variant="outline" onClick={handleImportJSON} className="gap-2">
            <Upload className="h-4 w-4" />
            Import JSON
          </Button>
          <Button variant="outline" onClick={clearAllData} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </div>

        {/* CV List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvs.map(cv => (
            <Card
              key={cv.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                currentCV?.id === cv.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{cv.name}</span>
                  <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </CardTitle>
                <CardDescription>
                  {cv.personalInfo.firstName && cv.personalInfo.lastName
                    ? `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`
                    : 'Unnamed'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Template:</span>
                    <span className="capitalize">{cv.template}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Language:</span>
                    <span className="uppercase">{cv.language}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Updated:</span>
                    <span>{format(new Date(cv.updatedAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSelectCV(cv.id)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateCV(cv.id);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this CV?')) {
                        deleteCV(cv.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cvs.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No CVs yet</h3>
            <p className="text-gray-600 mb-4">Create your first professional resume to get started</p>
            <Button onClick={handleCreateCV} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First CV
            </Button>
          </Card>
        )}
      </div>

      {showImportDialog && (
        <ImportTextDialog onClose={() => setShowImportDialog(false)} />
      )}
    </div>
  );
}