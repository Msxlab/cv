import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { useCV } from '../context/cv-context';
import { CORE_SECTION_IDS } from '../utils/cv-schema';
import { getTranslation } from '../utils/localization';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function SectionOrderPanel() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const customIds = new Set(currentCV.customSections.map((section) => section.id));
  const validIds = new Set<string>([...CORE_SECTION_IDS, ...customIds]);
  const orderedIds = [
    ...currentCV.sectionOrder.filter((id, index, source) => validIds.has(id) && source.indexOf(id) === index),
    ...CORE_SECTION_IDS.filter((id) => !currentCV.sectionOrder.includes(id)),
    ...currentCV.customSections.map((section) => section.id).filter((id) => !currentCV.sectionOrder.includes(id)),
  ];

  const getLabel = (id: string) => {
    const custom = currentCV.customSections.find((section) => section.id === id);
    if (custom) return custom.title || 'Untitled custom section';
    return getTranslation(currentCV.language, id) || id;
  };

  const move = (id: string, direction: -1 | 1) => {
    const currentIndex = orderedIds.indexOf(id);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= orderedIds.length) return;

    const nextOrder = [...orderedIds];
    const [item] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, item);
    updateCV({ sectionOrder: nextOrder });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">Section Order</h2>
        <p className="text-gray-600">
          Reorder the CV sections used by templates, PDF, DOCX, and editable backups.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Section Order</CardTitle>
          <CardDescription>
            Custom sections are added automatically and preserved when you export/import an editable JSON backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {orderedIds.map((id, index) => (
            <div key={id} className="flex items-center gap-3 rounded-lg border bg-white p-3">
              <GripVertical className="h-4 w-4 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{getLabel(id)}</p>
                <p className="text-xs text-slate-500">{customIds.has(id) ? 'Custom section' : 'Standard section'}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => move(id, -1)} disabled={index === 0} aria-label={`Move ${getLabel(id)} up`}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => move(id, 1)} disabled={index === orderedIds.length - 1} aria-label={`Move ${getLabel(id)} down`}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
