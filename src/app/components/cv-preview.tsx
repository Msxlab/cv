import { useCV } from '../context/cv-context';
import { ModernTemplate } from './templates/modern-template';
import { ClassicTemplate } from './templates/classic-template';
import { ExecutiveTemplate } from './templates/executive-template';
import { TechnicalTemplate } from './templates/technical-template';

export function CVPreview() {
  const { currentCV } = useCV();

  if (!currentCV) return null;

  const renderTemplate = () => {
    switch (currentCV.template) {
      case 'modern':
        return <ModernTemplate cv={currentCV} />;
      case 'classic':
        return <ClassicTemplate cv={currentCV} />;
      case 'executive':
        return <ExecutiveTemplate cv={currentCV} />;
      case 'technical':
        return <TechnicalTemplate cv={currentCV} />;
      default:
        return <ModernTemplate cv={currentCV} />;
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div id="cv-preview" className="bg-white shadow-2xl">
        {renderTemplate()}
      </div>
    </div>
  );
}
