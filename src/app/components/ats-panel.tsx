import { useEffect } from 'react';
import { useCV } from '../context/cv-context';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { AlertCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export function ATSPanel() {
  const { currentCV, atsAnalysis, analyzeATS } = useCV();

  useEffect(() => {
    if (currentCV) {
      analyzeATS();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCV]);

  if (!currentCV) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">ATS Optimization</h2>
        <p className="text-gray-600">
          Ensure your CV passes Applicant Tracking Systems
        </p>
      </div>

      {atsAnalysis ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Overall compatibility with ATS systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{atsAnalysis.score}/100</span>
                  <span className={`text-xl ${getScoreColor(atsAnalysis.score)}`}>
                    {getScoreLabel(atsAnalysis.score)}
                  </span>
                </div>
                <Progress value={atsAnalysis.score} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {atsAnalysis.warnings.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {atsAnalysis.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-yellow-800">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {atsAnalysis.missingKeywords.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Missing Keywords</CardTitle>
                <CardDescription className="text-orange-700">
                  Keywords from the job description not found in your CV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {atsAnalysis.missingKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-orange-300 rounded-full text-sm text-orange-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {atsAnalysis.suggestions.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Sparkles className="h-5 w-5" />
                  Suggestions for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {atsAnalysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-blue-800">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {atsAnalysis.strengths.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {atsAnalysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-green-800">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-4">
              Analyze your CV for ATS compatibility
            </p>
            <Button onClick={analyzeATS}>Run ATS Analysis</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
