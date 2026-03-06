import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2, X } from 'lucide-react';
import { Project } from '../../types/cv';
import { DatePickerField } from '../date-picker-field';

export function ProjectsEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { projects } = currentCV;

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      role: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
    };
    updateCV({ projects: [...projects, newProject] });
  };

  const removeProject = (id: string) => {
    updateCV({ projects: projects.filter(p => p.id !== id) });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    updateCV({
      projects: projects.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const addTechnology = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      updateProject(id, 'technologies', [...project.technologies, '']);
    }
  };

  const updateTechnology = (id: string, index: number, value: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      const updated = [...project.technologies];
      updated[index] = value;
      updateProject(id, 'technologies', updated);
    }
  };

  const removeTechnology = (id: string, index: number) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      updateProject(id, 'technologies', project.technologies.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Projects</h2>
          <p className="text-gray-600">Showcase your work and side projects</p>
        </div>
        <Button onClick={addProject} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No projects added yet</p>
          <Button onClick={addProject} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Project
          </Button>
        </Card>
      )}

      {projects.map((project, idx) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project #{idx + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                />
              </div>
              <div>
                <Label>Your Role</Label>
                <Input
                  value={project.role}
                  onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                  placeholder="Lead Developer"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Brief description of the project..."
                rows={4}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Technologies</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addTechnology(project.id)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-blue-50 rounded-md px-2 py-1">
                    <Input
                      value={tech}
                      onChange={(e) => updateTechnology(project.id, idx, e.target.value)}
                      placeholder="React"
                      className="w-32 h-7 text-sm"
                    />
                    <button
                      onClick={() => removeTechnology(project.id, idx)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Impact/Results (optional)</Label>
              <Textarea
                value={project.impact || ''}
                onChange={(e) => updateProject(project.id, 'impact', e.target.value)}
                placeholder="Increased efficiency by 40%, reduced costs by 30%..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label>URL (optional)</Label>
                <Input
                  value={project.url || ''}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="https://project.com"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <DatePickerField
                  value={project.startDate}
                  onChange={(value) => updateProject(project.id, 'startDate', value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <DatePickerField
                  value={project.endDate}
                  onChange={(value) => updateProject(project.id, 'endDate', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
