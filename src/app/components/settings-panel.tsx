import { useCV } from '../context/cv-context';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Language } from '../types/cv';

export function SettingsPanel() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">CV Settings</h2>
        <p className="text-gray-600">Customize your CV appearance and language</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template & Layout</CardTitle>
          <CardDescription>Choose how your CV should look</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Template</Label>
            <Select
              value={currentCV.template}
              onValueChange={(value) => updateCV({ template: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Layout</Label>
            <Select
              value={currentCV.layout}
              onValueChange={(value) => updateCV({ layout: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Column</SelectItem>
                <SelectItem value="double">Two Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Profile Photo</Label>
              <p className="text-sm text-gray-500">Display photo in CV preview</p>
            </div>
            <Switch
              checked={currentCV.showPhoto}
              onCheckedChange={(checked) => updateCV({ showPhoto: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Localization</CardTitle>
          <CardDescription>Set the language for section headings</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label>CV Language</Label>
            <Select
              value={currentCV.language}
              onValueChange={(value) => updateCV({ language: value as Language })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="tr">Türkçe (Turkish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
                <SelectItem value="de">Deutsch (German)</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CV Name</CardTitle>
          <CardDescription>Identify this CV version</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={currentCV.name}
            onChange={(e) => updateCV({ name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="My Resume"
          />
        </CardContent>
      </Card>
    </div>
  );
}
