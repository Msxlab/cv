import { CVData } from '../../types/cv';
import { ModernTemplate } from './modern-template';

interface TemplateProps {
  cv: CVData;
}

export function ClassicTemplate({ cv }: TemplateProps) {
  // For now, use modern template with minor adjustments
  // In a full implementation, this would have a more traditional layout
  return <ModernTemplate cv={cv} />;
}
