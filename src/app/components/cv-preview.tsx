import { useCV } from '../context/cv-context';
import { ModernTemplate } from './templates/modern-template';
import { ClassicTemplate } from './templates/classic-template';
import { ExecutiveTemplate } from './templates/executive-template';
import { TechnicalTemplate } from './templates/technical-template';
import { CreativeTemplate } from './templates/creative-template';
import { MinimalistTemplate } from './templates/minimalist-template';
import { ElegantTemplate } from './templates/elegant-template';
import { CompactTemplate } from './templates/compact-template';
import { AcademicTemplate } from './templates/academic-template';
import { InfographicTemplate } from './templates/infographic-template';
import { BoldTemplate } from './templates/bold-template';
import { TwoToneTemplate } from './templates/twotone-template';
import { TimelineTemplate } from './templates/timeline-template';
import { MetroTemplate } from './templates/metro-template';
import { NewspaperTemplate } from './templates/newspaper-template';
import { GradientTemplate } from './templates/gradient-template';
import { SwissTemplate } from './templates/swiss-template';

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
      case 'creative':
        return <CreativeTemplate cv={currentCV} />;
      case 'minimalist':
        return <MinimalistTemplate cv={currentCV} />;
      case 'elegant':
        return <ElegantTemplate cv={currentCV} />;
      case 'compact':
        return <CompactTemplate cv={currentCV} />;
      case 'academic':
        return <AcademicTemplate cv={currentCV} />;
      case 'infographic':
        return <InfographicTemplate cv={currentCV} />;
      case 'bold':
        return <BoldTemplate cv={currentCV} />;
      case 'twotone':
        return <TwoToneTemplate cv={currentCV} />;
      case 'timeline':
        return <TimelineTemplate cv={currentCV} />;
      case 'metro':
        return <MetroTemplate cv={currentCV} />;
      case 'newspaper':
        return <NewspaperTemplate cv={currentCV} />;
      case 'gradient':
        return <GradientTemplate cv={currentCV} />;
      case 'swiss':
        return <SwissTemplate cv={currentCV} />;
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
