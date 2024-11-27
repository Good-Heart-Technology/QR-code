import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QRCodeGenerator from './QRCodeGenerator';

interface VCardFormData {
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

const VCardQRForm = () => {
  const [formData, setFormData] = useState<VCardFormData>({
    firstName: '',
    lastName: '',
    organization: '',
    jobTitle: '',
    email: '',
    phone: '',
    website: '',
    address: ''
  });
  const [showQR, setShowQR] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setShowQR(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label htmlFor="organization" className="text-sm font-medium">
              Organization
            </label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="Organization"
            />
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="text-sm font-medium">
              Job Title
            </label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Job Title"
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Website
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
            />
          </div>

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && Object.values(formData).some(value => value !== '') && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={{
                  ...formData,
                  note: `${formData.organization ? `ORG:${formData.organization}\n` : ''}${
                    formData.jobTitle ? `TITLE:${formData.jobTitle}\n` : ''
                  }${formData.website ? `URL:${formData.website}\n` : ''}`
                }}
                type="vcard"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VCardQRForm;