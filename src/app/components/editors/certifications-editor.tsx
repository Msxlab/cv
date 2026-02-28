import { useCV } from '../../context/cv-context';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Certification } from '../../types/cv';

export function CertificationsEditor() {
  const { currentCV, updateCV } = useCV();

  if (!currentCV) return null;

  const { certifications } = currentCV;

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
    };
    updateCV({ certifications: [...certifications, newCert] });
  };

  const removeCertification = (id: string) => {
    updateCV({ certifications: certifications.filter(c => c.id !== id) });
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    updateCV({
      certifications: certifications.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Certifications</h2>
          <p className="text-gray-600">Add your professional certifications</p>
        </div>
        <Button onClick={addCertification} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No certifications added yet</p>
          <Button onClick={addCertification} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Certification
          </Button>
        </Card>
      )}

      {certifications.map((cert, idx) => (
        <Card key={cert.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Certification #{idx + 1}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Certification Name *</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <Label>Issuing Organization *</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Issue Date</Label>
                <Input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
              <div>
                <Label>Expiry Date (optional)</Label>
                <Input
                  type="month"
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Credential ID (optional)</Label>
                <Input
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="ABC123"
                />
              </div>
            </div>

            <div>
              <Label>Credential URL (optional)</Label>
              <Input
                value={cert.url || ''}
                onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                placeholder="https://verify.certificate.com"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
