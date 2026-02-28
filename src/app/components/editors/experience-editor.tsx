import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Experience } from '../../types/cv';
import { QuickTips } from '../quick-tips';

export function ExperienceEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { experiences } = currentCV;

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: [''],
      achievements: [],
      metrics: [],
    };
    updateCV({ experiences: [...experiences, newExp] });
  };

  const removeExperience = (id: string) => {
    updateCV({ experiences: experiences.filter(exp => exp.id !== id) });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    updateCV({
      experiences: experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addResponsibility = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    if (exp) {
      updateExperience(id, 'responsibilities', [...exp.responsibilities, '']);
    }
  };

  const updateResponsibility = (id: string, index: number, value: string) => {
    const exp = experiences.find(e => e.id === id);
    if (exp) {
      const updated = [...exp.responsibilities];
      updated[index] = value;
      updateExperience(id, 'responsibilities', updated);
    }
  };

  const removeResponsibility = (id: string, index: number) => {
    const exp = experiences.find(e => e.id === id);
    if (exp) {
      const updated = exp.responsibilities.filter((_, i) => i !== index);
      updateExperience(id, 'responsibilities', updated);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Work Experience</h2>
          <p className="text-gray-600">Add your professional work history</p>
        </div>
        <Button onClick={addExperience} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <QuickTips section="experience" />

      {experiences.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <Button onClick={addExperience} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Experience
          </Button>
        </Card>
      )}

      {experiences.map((exp, idx) => (
        <Card key={exp.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Experience #{idx + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExperience(exp.id)}
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
                <Label>Position *</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Tech Company Inc."
                />
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.current}
                onCheckedChange={(checked) =>
                  updateExperience(exp.id, 'current', checked)
                }
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm">
                I currently work here
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Responsibilities & Achievements</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addResponsibility(exp.id)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Bullet
                </Button>
              </div>
              {exp.responsibilities.map((resp, respIdx) => (
                <div key={respIdx} className="flex gap-2 mb-2">
                  <Textarea
                    value={resp}
                    onChange={(e) => updateResponsibility(exp.id, respIdx, e.target.value)}
                    placeholder="• Led development of..."
                    rows={2}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeResponsibility(exp.id, respIdx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}