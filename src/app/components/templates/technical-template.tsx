import { CVData } from '../../types/cv';
import { ModernTemplate } from './modern-template';

interface TemplateProps {
  cv: CVData;
}

export function TechnicalTemplate({ cv }: TemplateProps) {
  return <ModernTemplate cv={cv} />;
}
