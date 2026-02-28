import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Reference } from '../../types/cv';

export function ReferencesEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { references } = currentCV;

  const addReference = () => {
    const newItem: Reference = {
      id: Date.now().toString(),
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
    };
    updateCV({ references: [...references, newItem] });
  };

  const removeReference = (id: string) => {
    updateCV({ references: references.filter(r => r.id !== id) });
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    updateCV({
      references: references.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">References</h2>
          <p className="text-gray-600">Add professional references</p>
        </div>
        <Button onClick={addReference} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Reference
        </Button>
      </div>

      {references.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No references added yet</p>
          <Button onClick={addReference} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add a Reference
          </Button>
        </Card>
      )}

      {references.map((item, idx) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reference #{idx + 1}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removeReference(item.id)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateReference(item.id, 'name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label>Relationship</Label>
                <Input
                  value={item.relationship || ''}
                  onChange={(e) => updateReference(item.id, 'relationship', e.target.value)}
                  placeholder="Former Manager"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Position</Label>
                <Input
                  value={item.position}
                  onChange={(e) => updateReference(item.id, 'position', e.target.value)}
                  placeholder="Engineering Director"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={item.company}
                  onChange={(e) => updateReference(item.id, 'company', e.target.value)}
                  placeholder="Google"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={item.email}
                  onChange={(e) => updateReference(item.id, 'email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={item.phone}
                  onChange={(e) => updateReference(item.id, 'phone', e.target.value)}
                  placeholder="+1 555 123 4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
