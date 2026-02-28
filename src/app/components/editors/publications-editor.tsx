import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Publication } from '../../types/cv';

export function PublicationsEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { publications } = currentCV;

  const addPublication = () => {
    const newItem: Publication = {
      id: Date.now().toString(),
      title: '',
      publisher: '',
      date: '',
      url: '',
    };
    updateCV({ publications: [...publications, newItem] });
  };

  const removePublication = (id: string) => {
    updateCV({ publications: publications.filter(p => p.id !== id) });
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    updateCV({
      publications: publications.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Publications</h2>
          <p className="text-gray-600">Add your published papers, articles, and books</p>
        </div>
        <Button onClick={addPublication} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Publication
        </Button>
      </div>

      {publications.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No publications added yet</p>
          <Button onClick={addPublication} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Publication
          </Button>
        </Card>
      )}

      {publications.map((item, idx) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Publication #{idx + 1}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => removePublication(item.id)} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={item.title}
                onChange={(e) => updatePublication(item.id, 'title', e.target.value)}
                placeholder="Machine Learning in Healthcare: A Comprehensive Review"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Publisher / Journal *</Label>
                <Input
                  value={item.publisher}
                  onChange={(e) => updatePublication(item.id, 'publisher', e.target.value)}
                  placeholder="Nature, IEEE, Medium"
                />
              </div>
              <div>
                <Label>Publication Date</Label>
                <Input
                  type="month"
                  value={item.date}
                  onChange={(e) => updatePublication(item.id, 'date', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>URL (optional)</Label>
              <Input
                value={item.url || ''}
                onChange={(e) => updatePublication(item.id, 'url', e.target.value)}
                placeholder="https://doi.org/..."
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
