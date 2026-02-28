import { useState } from 'react';
import { useCV } from '../context/cv-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { extractKeywords } from '../utils/content-helpers';

interface ImportTextDialogProps {
  onClose: () => void;
}

export function ImportTextDialog({ onClose }: ImportTextDialogProps) {
  const { updateCV } = useCV();
  const [text, setText] = useState('');

  const handleImport = () => {
    if (!text.trim()) {
      toast.error('Please paste some text to import');
      return;
    }

    // Simple text parsing - in a real app, this would be more sophisticated
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Try to extract name (usually first line)
    const firstLine = lines[0] || '';
    const nameParts = firstLine.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';

    // Extract phone
    const phoneMatch = text.match(/[\d\s\-\+\(\)]{10,}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    // Extract keywords as potential skills
    const keywords = extractKeywords(text);
    const skills = keywords.slice(0, 10).map((keyword, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: keyword,
      category: 'Technical Skills',
      level: 'intermediate' as const,
    }));

    updateCV({
      personalInfo: {
        firstName,
        lastName,
        email,
        phone,
        headline: '',
        summary: '',
        location: '',
        otherLinks: [],
      },
      skills,
    });

    toast.success('Text imported! Please review and edit the extracted information.');
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import from Text</DialogTitle>
          <DialogDescription>
            Paste your existing CV or LinkedIn profile. We'll extract basic information.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your CV text here..."
          rows={15}
          className="font-mono text-sm"
        />

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The parser will extract basic information like name, email, and phone.
            You'll need to manually add experience, education, and other sections.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>
            Import & Parse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
