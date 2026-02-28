import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { LanguageSkill } from '../../types/cv';

export function LanguagesEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { languages } = currentCV;

  const addLanguage = () => {
    const newLang: LanguageSkill = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'intermediate',
    };
    updateCV({ languages: [...languages, newLang] });
  };

  const removeLanguage = (id: string) => {
    updateCV({ languages: languages.filter(l => l.id !== id) });
  };

  const updateLanguage = (id: string, field: keyof LanguageSkill, value: any) => {
    updateCV({
      languages: languages.map(l =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Languages</h2>
          <p className="text-gray-600">Add languages you speak</p>
        </div>
        <Button onClick={addLanguage} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </div>

      {languages.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No languages added yet</p>
          <Button onClick={addLanguage} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Language
          </Button>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 space-y-3">
          {languages.map((lang) => (
            <div key={lang.id} className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  placeholder="Language name"
                />
              </div>
              <div className="w-48">
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="native">Native</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
