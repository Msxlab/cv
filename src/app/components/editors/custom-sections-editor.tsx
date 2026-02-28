import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { CustomSection } from '../../types/cv';

export function CustomSectionsEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { customSections } = currentCV;

  const addSection = () => {
    const newItem: CustomSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
    };
    updateCV({ customSections: [...customSections, newItem] });
  };

  const removeSection = (id: string) => {
    updateCV({ customSections: customSections.filter(s => s.id !== id) });
  };

  const updateSection = (id: string, field: keyof CustomSection, value: string) => {
    updateCV({
      customSections: customSections.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Custom Sections</h2>
          <p className="text-gray-600">Add any additional sections to your CV</p>
        </div>
        <Button onClick={addSection} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      {customSections.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No custom sections added yet</p>
          <p className="text-gray-400 text-sm mb-4">Use this to add hobbies, interests, or any other section</p>
          <Button onClick={addSection} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Custom Section
          </Button>
        </Card>
      )}

      {customSections.map((item, idx) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Custom Section #{idx + 1}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeSection(item.id)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Section Title *</Label>
              <Input
                value={item.title}
                onChange={(e) => updateSection(item.id, 'title', e.target.value)}
                placeholder="Hobbies & Interests"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={item.content}
                onChange={(e) => updateSection(item.id, 'content', e.target.value)}
                placeholder="Describe the content for this section..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
