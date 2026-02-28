import { useState } from 'react';
import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, X } from 'lucide-react';
import { PhotoCropDialog } from '../photo-crop-dialog';
import { QuickTips } from '../quick-tips';

export function PersonalInfoEditor() {
  const { currentCV, updateCV } = useCV();
  const [showPhotoCrop, setShowPhotoCrop] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  if (!currentCV) return null;

  const { personalInfo } = currentCV;

  const handleChange = (field: string, value: string) => {
    updateCV({
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setShowPhotoCrop(true);
    }
  };

  const handlePhotoSave = (croppedImage: string) => {
    updateCV({
      personalInfo: {
        ...personalInfo,
        photo: croppedImage,
      },
    });
    setShowPhotoCrop(false);
    setPhotoFile(null);
  };

  const handleRemovePhoto = () => {
    updateCV({
      personalInfo: {
        ...personalInfo,
        photo: undefined,
      },
    });
  };

  const handleOtherLinkAdd = () => {
    updateCV({
      personalInfo: {
        ...personalInfo,
        otherLinks: [...(personalInfo.otherLinks || []), { label: '', url: '' }],
      },
    });
  };

  const handleOtherLinkRemove = (index: number) => {
    const links = [...(personalInfo.otherLinks || [])];
    links.splice(index, 1);
    updateCV({
      personalInfo: {
        ...personalInfo,
        otherLinks: links,
      },
    });
  };

  const handleOtherLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    const links = [...(personalInfo.otherLinks || [])];
    links[index][field] = value;
    updateCV({
      personalInfo: {
        ...personalInfo,
        otherLinks: links,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl mb-2">Personal Information</h2>
        <p className="text-gray-600">Basic information that will appear on your CV</p>
      </div>

      <QuickTips section="personal" />

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Upload a professional headshot (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          {personalInfo.photo ? (
            <div className="flex items-center gap-4">
              <img
                src={personalInfo.photo}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <Button variant="outline" size="sm" onClick={handleRemovePhoto} className="gap-2">
                  <X className="h-4 w-4" />
                  Remove Photo
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" className="gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </span>
                </Button>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headline">Professional Headline *</Label>
            <Input
              id="headline"
              value={personalInfo.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="Senior Software Engineer"
            />
          </div>

          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={personalInfo.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="A brief summary of your professional background, key skills, and career objectives..."
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="New York, NY, USA"
            />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Links</CardTitle>
          <CardDescription>Add links to your professional profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={personalInfo.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={personalInfo.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={personalInfo.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <Label htmlFor="portfolio">Portfolio</Label>
            <Input
              id="portfolio"
              value={personalInfo.portfolio || ''}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>

          {/* Other Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Other Links</Label>
              <Button size="sm" variant="outline" onClick={handleOtherLinkAdd}>
                Add Link
              </Button>
            </div>
            {personalInfo.otherLinks?.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  placeholder="Label (e.g., Behance)"
                  value={link.label}
                  onChange={(e) => handleOtherLinkChange(idx, 'label', e.target.value)}
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleOtherLinkChange(idx, 'url', e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOtherLinkRemove(idx)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showPhotoCrop && photoFile && (
        <PhotoCropDialog
          imageFile={photoFile}
          onSave={handlePhotoSave}
          onClose={() => {
            setShowPhotoCrop(false);
            setPhotoFile(null);
          }}
        />
      )}
    </div>
  );
}