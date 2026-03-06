import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '../../types/cv';
import { DatePickerField } from '../date-picker-field';

export function EducationEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { education } = currentCV;

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    updateCV({ education: [...education, newEdu] });
  };

  const removeEducation = (id: string) => {
    updateCV({ education: education.filter(edu => edu.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    updateCV({
      education: education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Education</h2>
          <p className="text-gray-600">Add your academic background</p>
        </div>
        <Button onClick={addEducation} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {education.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No education added yet</p>
          <Button onClick={addEducation} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        </Card>
      )}

      {education.map((edu, idx) => (
        <Card key={edu.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Education #{idx + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Institution *</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="University of California"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Degree *</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <Label>Field of Study *</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                placeholder="Berkeley, CA"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <DatePickerField
                  value={edu.startDate}
                  onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <DatePickerField
                  value={edu.endDate}
                  onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                  disabled={edu.current}
                />
              </div>
              <div>
                <Label>GPA (optional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${edu.id}`}
                checked={edu.current}
                onCheckedChange={(checked) =>
                  updateEducation(edu.id, 'current', checked)
                }
              />
              <label htmlFor={`current-${edu.id}`} className="text-sm">
                Currently studying here
              </label>
            </div>

            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={edu.description || ''}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                placeholder="Relevant coursework, achievements, honors..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
