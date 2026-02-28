import { CVData } from '../../types/cv';
import { ModernTemplate } from './modern-template';

interface TemplateProps {
  cv: CVData;
}

export function ExecutiveTemplate({ cv }: TemplateProps) {
  return <ModernTemplate cv={cv} />;
}
