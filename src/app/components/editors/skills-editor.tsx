import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Skill, SkillLevel } from '../../types/cv';

export function SkillsEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { skills } = currentCV;

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: 'Technical Skills',
      level: 'intermediate',
    };
    updateCV({ skills: [...skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    updateCV({ skills: skills.filter(skill => skill.id !== id) });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    updateCV({
      skills: skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const categories = [
    'Technical Skills',
    'Soft Skills',
    'Tools & Technologies',
    'Programming Languages',
    'Frameworks',
    'Other',
  ];

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Skills</h2>
          <p className="text-gray-600">Add your professional and technical skills</p>
        </div>
        <Button onClick={addSkill} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No skills added yet</p>
          <Button onClick={addSkill} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Skill
          </Button>
        </Card>
      )}

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    placeholder="Skill name"
                  />
                </div>
                <div className="w-48">
                  <Select
                    value={skill.category}
                    onValueChange={(value) => updateSkill(skill.id, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-36">
                  <Select
                    value={skill.level}
                    onValueChange={(value) => updateSkill(skill.id, 'level', value as SkillLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeSkill(skill.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
