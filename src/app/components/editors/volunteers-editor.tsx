import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Volunteer } from '../../types/cv';

export function VolunteersEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { volunteers } = currentCV;

  const addVolunteer = () => {
    const newItem: Volunteer = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
    };
    updateCV({ volunteers: [...volunteers, newItem] });
  };

  const removeVolunteer = (id: string) => {
    updateCV({ volunteers: volunteers.filter(v => v.id !== id) });
  };

  const updateVolunteer = (id: string, field: keyof Volunteer, value: any) => {
    updateCV({
      volunteers: volunteers.map(v =>
        v.id === id ? { ...v, [field]: value } : v
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Volunteer Experience</h2>
          <p className="text-gray-600">Add your volunteer and community work</p>
        </div>
        <Button onClick={addVolunteer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Volunteer
        </Button>
      </div>

      {volunteers.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No volunteer experience added yet</p>
          <Button onClick={addVolunteer} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Volunteer Experience
          </Button>
        </Card>
      )}

      {volunteers.map((item, idx) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Volunteer #{idx + 1}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeVolunteer(item.id)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Organization *</Label>
                <Input
                  value={item.organization}
                  onChange={(e) => updateVolunteer(item.id, 'organization', e.target.value)}
                  placeholder="Red Cross"
                />
              </div>
              <div>
                <Label>Role *</Label>
                <Input
                  value={item.role}
                  onChange={(e) => updateVolunteer(item.id, 'role', e.target.value)}
                  placeholder="Volunteer Coordinator"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) => updateVolunteer(item.id, 'description', e.target.value)}
                placeholder="Describe your volunteer work..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="month" value={item.startDate} onChange={(e) => updateVolunteer(item.id, 'startDate', e.target.value)} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="month" value={item.endDate} onChange={(e) => updateVolunteer(item.id, 'endDate', e.target.value)} disabled={item.current} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-vol-${item.id}`}
                checked={item.current}
                onCheckedChange={(checked) => updateVolunteer(item.id, 'current', checked)}
              />
              <label htmlFor={`current-vol-${item.id}`} className="text-sm">Currently volunteering here</label>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
