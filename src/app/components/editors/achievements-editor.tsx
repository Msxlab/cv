import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Achievement } from '../../types/cv';
import { DatePickerField } from '../date-picker-field';

export function AchievementsEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { achievements } = currentCV;

  const addAchievement = () => {
    const newItem: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
    };
    updateCV({ achievements: [...achievements, newItem] });
  };

  const removeAchievement = (id: string) => {
    updateCV({ achievements: achievements.filter(a => a.id !== id) });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    updateCV({
      achievements: achievements.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Achievements & Awards</h2>
          <p className="text-gray-600">Add your notable achievements and awards</p>
        </div>
        <Button onClick={addAchievement} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Achievement
        </Button>
      </div>

      {achievements.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No achievements added yet</p>
          <Button onClick={addAchievement} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Achievement
          </Button>
        </Card>
      )}

      {achievements.map((item, idx) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Achievement #{idx + 1}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeAchievement(item.id)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label>Title *</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateAchievement(item.id, 'title', e.target.value)}
                  placeholder="Best Employee Award"
                />
              </div>
              <div>
                <Label>Date</Label>
                <DatePickerField
                  value={item.date}
                  onChange={(value) => updateAchievement(item.id, 'date', value)}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) => updateAchievement(item.id, 'description', e.target.value)}
                placeholder="Brief description of the achievement..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
