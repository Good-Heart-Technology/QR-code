import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QRCodeGenerator from '../QRCodeGenerator';

interface LocationFormData {
  latitude: string;
  longitude: string;
}

const LocationQRForm = () => {
  const [formData, setFormData] = useState<LocationFormData>({
    latitude: '',
    longitude: ''
  });
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState('');

  const validateCoordinates = () => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numbers for coordinates');
      return false;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90 degrees');
      return false;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180 degrees');
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only numbers, decimal point, and minus sign
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setError('');
    }
  };

  const handleSubmit = () => {
    if (validateCoordinates()) {
      setShowQR(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Latitude Input */}
            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium">
                Latitude
              </label>
              <Input
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Enter latitude (-90 to 90)"
                className="flex-1"
              />
            </div>

            {/* Longitude Input */}
            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium">
                Longitude
              </label>
              <Input
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Enter longitude (-180 to 180)"
                className="flex-1"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && !error && formData.latitude && formData.longitude && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={{
                  latitude: formData.latitude,
                  longitude: formData.longitude
                }}
                type="location"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationQRForm;