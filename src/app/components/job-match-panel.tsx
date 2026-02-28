import { useState } from 'react';
import { useCV } from '../context/cv-context';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Target, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function JobMatchPanel() {
  const { jobDescription, setJobDescription, analyzeATS } = useCV();
  const [title, setTitle] = useState(jobDescription?.title || '');
  const [company, setCompany] = useState(jobDescription?.company || '');
  const [description, setDescription] = useState(jobDescription?.description || '');

  const handleParse = () => {
    // Mock keyword extraction - in a real app, this would use NLP
    const keywords = description
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4)
      .filter((word, idx, arr) => arr.indexOf(word) === idx)
      .slice(0, 20);

    const requirements = description
      .split('\n')
      .filter(line => line.trim().length > 10)
      .slice(0, 5);

    setJobDescription({
      title,
      company,
      description,
      requirements,
      keywords,
    });

    analyzeATS();
    toast.success('Job description analyzed successfully!');
  };

  const handleClear = () => {
    setTitle('');
    setCompany('');
    setDescription('');
    setJobDescription(null);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">Job Description Matching</h2>
        <p className="text-gray-600">
          Paste a job description to match your CV against it
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Job Details
          </CardTitle>
          <CardDescription>
            Enter the job posting you're applying for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div>
            <Label>Job Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={12}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleParse} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Analyze Match
            </Button>
            {jobDescription && (
              <Button onClick={handleClear} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {jobDescription && (
        <>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Extracted Keywords</CardTitle>
              <CardDescription className="text-blue-700">
                Key terms identified from the job description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobDescription.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-blue-300 rounded-full text-sm text-blue-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Key Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {jobDescription.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-purple-800">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-800">
                <li>• Check the ATS tab to see missing keywords</li>
                <li>• Update your skills section to include relevant technologies</li>
                <li>• Tailor your professional summary to match the role</li>
                <li>• Add specific achievements that align with requirements</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
