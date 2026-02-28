import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';

interface QuickTipsProps {
  section: string;
}

const tipsContent: Record<string, { icon: any; tips: string[] }> = {
  personal: {
    icon: Lightbulb,
    tips: [
      'Use a professional email address',
      'Keep your summary to 2-3 impactful sentences',
      'Include only relevant social links (LinkedIn, GitHub, Portfolio)',
      'Make sure your contact info is current and accurate',
    ],
  },
  experience: {
    icon: TrendingUp,
    tips: [
      'Start each bullet with a strong action verb',
      'Quantify achievements with numbers and percentages',
      'Focus on impact and results, not just responsibilities',
      'Use the STAR method: Situation, Task, Action, Result',
      'Keep bullets to 1-2 lines for readability',
    ],
  },
  education: {
    icon: Target,
    tips: [
      'List most recent education first',
      'Include GPA if it\'s strong (above 3.5)',
      'Add relevant coursework for recent graduates',
      'Mention academic honors or awards',
    ],
  },
  skills: {
    icon: Zap,
    tips: [
      'Group skills by category for better readability',
      'Be honest about your proficiency levels',
      'Include both hard and soft skills',
      'Match skills to job descriptions you\'re targeting',
      'Update regularly as you learn new technologies',
    ],
  },
  projects: {
    icon: Target,
    tips: [
      'Highlight the problem you solved',
      'List technologies and tools used',
      'Quantify impact when possible',
      'Include links to live demos or repositories',
      'Explain your specific role and contributions',
    ],
  },
  ats: {
    icon: Target,
    tips: [
      'Use standard section headings',
      'Include keywords from job descriptions',
      'Avoid images, tables, and complex formatting',
      'Use simple bullet points',
      'Save final CV as PDF',
    ],
  },
};

export function QuickTips({ section }: QuickTipsProps) {
  const content = tipsContent[section] || tipsContent.personal;
  const Icon = content.icon;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Icon className="h-5 w-5" />
          Quick Tips
        </CardTitle>
        <CardDescription className="text-blue-700">
          Best practices for this section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-blue-900">
          {content.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
