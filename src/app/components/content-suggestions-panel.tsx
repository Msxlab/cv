import { useEffect, useState } from 'react';
import { useCV } from '../context/cv-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lightbulb, AlertCircle, Info, CheckCircle2, Sparkles } from 'lucide-react';
import { ContentSuggestion } from '../types/cv';

export function ContentSuggestionsPanel() {
  const { currentCV } = useCV();
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);

  useEffect(() => {
    if (!currentCV) return;

    const newSuggestions: ContentSuggestion[] = [];

    // Check personal info
    if (!currentCV.personalInfo.summary) {
      newSuggestions.push({
        type: 'warning',
        section: 'Personal Info',
        message: 'Add a professional summary to introduce yourself',
        suggestion: 'Write 2-3 sentences highlighting your experience and key strengths',
      });
    }

    if (!currentCV.personalInfo.linkedin && !currentCV.personalInfo.github) {
      newSuggestions.push({
        type: 'info',
        section: 'Personal Info',
        message: 'Consider adding professional profile links',
        suggestion: 'LinkedIn and GitHub profiles can strengthen your application',
      });
    }

    // Check experience
    if (currentCV.experiences.length === 0) {
      newSuggestions.push({
        type: 'warning',
        section: 'Experience',
        message: 'No work experience added',
        suggestion: 'Add your professional work history with achievements',
      });
    }

    currentCV.experiences.forEach((exp, idx) => {
      if (exp.responsibilities.length === 0) {
        newSuggestions.push({
          type: 'warning',
          section: 'Experience',
          message: `Experience #${idx + 1} has no responsibilities`,
          suggestion: 'Add 3-5 bullet points describing your role and achievements',
        });
      }

      if (exp.responsibilities.some(r => r.length < 20)) {
        newSuggestions.push({
          type: 'improvement',
          section: 'Experience',
          message: `Experience #${idx + 1} has weak bullet points`,
          suggestion: 'Use strong action verbs and quantify achievements (e.g., "Increased sales by 40%")',
        });
      }
    });

    // Check skills
    if (currentCV.skills.length < 5) {
      newSuggestions.push({
        type: 'warning',
        section: 'Skills',
        message: 'Add more skills to strengthen your profile',
        suggestion: 'Include technical skills, tools, and soft skills relevant to your target role',
      });
    }

    // Check projects
    if (currentCV.projects.length === 0 && currentCV.experiences.length < 2) {
      newSuggestions.push({
        type: 'info',
        section: 'Projects',
        message: 'Consider adding projects to showcase your work',
        suggestion: 'Include side projects, open-source contributions, or significant work projects',
      });
    }

    // Check education
    if (currentCV.education.length === 0) {
      newSuggestions.push({
        type: 'warning',
        section: 'Education',
        message: 'No education added',
        suggestion: 'Add your academic background',
      });
    }

    // Check certifications
    if (currentCV.certifications.length === 0) {
      newSuggestions.push({
        type: 'info',
        section: 'Certifications',
        message: 'Certifications can boost your credibility',
        suggestion: 'Add relevant professional certifications if you have any',
      });
    }

    // Content quality suggestions
    if (currentCV.personalInfo.summary && currentCV.personalInfo.summary.length < 100) {
      newSuggestions.push({
        type: 'improvement',
        section: 'Personal Info',
        message: 'Professional summary is too short',
        suggestion: 'Expand to 2-3 sentences highlighting your expertise and value proposition',
      });
    }

    setSuggestions(newSuggestions);
  }, [currentCV]);

  if (!currentCV) return null;

  const getIcon = (type: ContentSuggestion['type']) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'improvement':
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-purple-600" />;
    }
  };

  const getCardClass = (type: ContentSuggestion['type']) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'improvement':
        return 'border-blue-200 bg-blue-50';
      case 'info':
        return 'border-purple-200 bg-purple-50';
    }
  };

  const warnings = suggestions.filter(s => s.type === 'warning');
  const improvements = suggestions.filter(s => s.type === 'improvement');
  const infos = suggestions.filter(s => s.type === 'info');

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">Content Suggestions</h2>
        <p className="text-gray-600">
          AI-powered recommendations to improve your CV
        </p>
      </div>

      {suggestions.length === 0 ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl mb-2 text-green-800">Looking Good!</h3>
            <p className="text-green-700">
              No major issues found. Your CV meets basic quality standards.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {warnings.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-5 w-5" />
                  Warnings ({warnings.length})
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Important issues that should be addressed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {warnings.map((suggestion, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start gap-3">
                      {getIcon(suggestion.type)}
                      <div className="flex-1">
                        <p className="text-sm mb-1 text-orange-900">
                          <strong>{suggestion.section}:</strong> {suggestion.message}
                        </p>
                        {suggestion.suggestion && (
                          <p className="text-sm text-orange-700">
                            💡 {suggestion.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {improvements.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Sparkles className="h-5 w-5" />
                  Improvements ({improvements.length})
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Ways to make your CV stronger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {improvements.map((suggestion, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      {getIcon(suggestion.type)}
                      <div className="flex-1">
                        <p className="text-sm mb-1 text-blue-900">
                          <strong>{suggestion.section}:</strong> {suggestion.message}
                        </p>
                        {suggestion.suggestion && (
                          <p className="text-sm text-blue-700">
                            💡 {suggestion.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {infos.length > 0 && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Info className="h-5 w-5" />
                  Tips ({infos.length})
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Optional enhancements to consider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {infos.map((suggestion, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-start gap-3">
                      {getIcon(suggestion.type)}
                      <div className="flex-1">
                        <p className="text-sm mb-1 text-purple-900">
                          <strong>{suggestion.section}:</strong> {suggestion.message}
                        </p>
                        {suggestion.suggestion && (
                          <p className="text-sm text-purple-700">
                            💡 {suggestion.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
