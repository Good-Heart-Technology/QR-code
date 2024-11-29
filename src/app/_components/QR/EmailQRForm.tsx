import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import QRCodeGenerator from './QRCodeGenerator';

interface EmailFormData {
  address: string;
  subject: string;
  body: string;
}

const EmailQRForm = () => {
  const [formData, setFormData] = useState<EmailFormData>({
    address: '',
    subject: '',
    body: ''
  });
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'address' && value) {
      validateEmail(value);
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (validateEmail(formData.address)) {
      setShowQR(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="address"
              name="address"
              type="email"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="email@example.com"
              className="flex-1"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Email subject"
              className="flex-1"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Message Body
            </label>
            <Textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Type your message here"
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && !error && formData.address && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={{
                  address: formData.address,
                  subject: formData.subject,
                  body: formData.body
                }}
                type="email"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailQRForm;