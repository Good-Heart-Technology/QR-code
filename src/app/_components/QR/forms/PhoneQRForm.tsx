import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QRCodeGenerator from '../QRCodeGenerator';

interface PhoneFormData {
  number: string;
}

const PhoneQRForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (number: string) => {
    // Basic validation for international phone number format
    const phoneRegex = /^\+?[\d\s-]+$/;
    if (!phoneRegex.test(number)) {
      setError('Please enter a valid phone number');
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers, plus sign, spaces, and hyphens
    if (value === '' || /^[\d\s+-]*$/.test(value)) {
      setPhoneNumber(value);
      setError('');
      setShowQR(false);
    }
  };

  const handleSubmit = () => {
    if (validatePhoneNumber(phoneNumber)) {
      setShowQR(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="+8801983938900"
              className="flex-1"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && !error && phoneNumber && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={{
                  number: phoneNumber
                }}
                type="phone"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneQRForm;