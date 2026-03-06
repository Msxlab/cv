import { useCV } from '../context/cv-context';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Language, AccentColor, FontSize, Spacing, TemplateName } from '../types/cv';
import { accentColorOptions, templateOptions, fontFamilies, fontSizes, spacings, loadGoogleFont, templateSupportsDoubleLayout } from '../utils/template-styles';
import { Check, Palette, Type, Maximize2, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

export function SettingsPanel() {
  const { currentCV, updateCV } = useCV();
  const [customColor, setCustomColor] = useState(
    currentCV?.accentColor?.startsWith('#') ? currentCV.accentColor : '#000000'
  );

  if (!currentCV) return null;

  const supportsDoubleLayout = templateSupportsDoubleLayout(currentCV.template);

  const handleTemplateChange = (template: TemplateName) => {
    updateCV({
      template,
      layout: templateSupportsDoubleLayout(template) ? currentCV.layout : 'single',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">CV Settings</h2>
        <p className="text-gray-600">Customize your CV appearance, colors, fonts, and style</p>
      </div>

      {/* Template Selector - Visual Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Template
          </CardTitle>
          <CardDescription>Choose a design template for your CV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {templateOptions.map((tmpl) => (
              <button
                key={tmpl.value}
                onClick={() => handleTemplateChange(tmpl.value)}
                className={`relative text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                  currentCV.template === tmpl.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {currentCV.template === tmpl.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <p className="font-semibold text-sm">{tmpl.label}</p>
                <p className="text-xs text-gray-500 mt-1">{tmpl.description}</p>
                <p className="text-[11px] text-gray-400 mt-2">
                  {tmpl.supportsDoubleLayout ? 'Single or two-column' : 'Built-in fixed layout'}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accent Color Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Accent Color
          </CardTitle>
          <CardDescription>Choose the primary color used throughout your CV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
              <Label htmlFor="custom-color" className="font-medium whitespace-nowrap">Custom Color:</Label>
              <input
                id="custom-color"
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  updateCV({ accentColor: e.target.value as AccentColor });
                }}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-sm text-gray-600 uppercase font-mono">{customColor}</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-2">
              {accentColorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setCustomColor(color.swatch);
                    updateCV({ accentColor: color.value as AccentColor });
                  }}
                  className={`group relative flex flex-col items-center gap-1`}
                  title={color.label}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      currentCV.accentColor === color.value
                        ? 'border-gray-900 scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105 hover:shadow-md'
                    }`}
                    style={{ backgroundColor: color.swatch }}
                  >
                    {currentCV.accentColor === color.value && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">{color.label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font Family Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Family ({Object.keys(fontFamilies).length} fonts)
          </CardTitle>
          <CardDescription>Choose the font style for your CV text</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {Object.entries(
              Object.entries(fontFamilies).reduce((acc, [key, font]) => {
                if (!acc[font.category]) acc[font.category] = [];
                acc[font.category].push({ key, ...font });
                return acc;
              }, {} as Record<string, Array<{ key: string; label: string; css: string; google?: string; category: string }>>)
            ).map(([category, fonts]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{category}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {fonts.map((font) => {
                    if (font.google) loadGoogleFont(font.key);
                    return (
                      <button
                        key={font.key}
                        onClick={() => updateCV({ fontFamily: font.key })}
                        className={`p-2 rounded-lg border-2 text-left transition-all ${
                          currentCV.fontFamily === font.key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{font.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate" style={{ fontFamily: font.css }}>
                          Abc 123
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Font Size & Spacing
          </CardTitle>
          <CardDescription>Control the text size and section spacing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block">Font Size</Label>
            <div className="flex gap-2">
              {(Object.entries(fontSizes) as [FontSize, typeof fontSizes[FontSize]][]).map(([key, size]) => (
                <Button
                  key={key}
                  variant={currentCV.fontSize === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCV({ fontSize: key })}
                  className="flex-1"
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Section Spacing</Label>
            <div className="flex gap-2">
              {(Object.entries(spacings) as [Spacing, typeof spacings[Spacing]][]).map(([key, space]) => (
                <Button
                  key={key}
                  variant={currentCV.spacing === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCV({ spacing: key })}
                  className="flex-1"
                >
                  {space.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout & Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Layout & Photo</CardTitle>
          <CardDescription>Configure layout structure and photo visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Layout</Label>
            <Select
              value={supportsDoubleLayout ? currentCV.layout : 'single'}
              onValueChange={(value) => updateCV({ layout: value as 'single' | 'double' })}
            >
              <SelectTrigger disabled={!supportsDoubleLayout}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Column</SelectItem>
                {supportsDoubleLayout && <SelectItem value="double">Two Columns</SelectItem>}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              {supportsDoubleLayout
                ? 'This template supports both single and two-column layouts.'
                : 'This template uses its own fixed structure. Switch to Modern, Classic, or Executive for a two-column option.'}
            </p>
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

      {/* Language */}
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

      {/* CV Name */}
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
