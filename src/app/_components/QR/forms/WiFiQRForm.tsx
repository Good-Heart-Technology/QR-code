import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QRCodeGenerator from '../QRCodeGenerator';

interface WiFiFormData {
  ssid: string;
  encryption: string;
  password: string;
}

const WiFiQRForm = () => {
  const [formData, setFormData] = useState<WiFiFormData>({
    ssid: '',
    encryption: 'WPA',
    password: ''
  });
  const [showQR, setShowQR] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEncryptionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      encryption: value
    }));
  };

  const handleSubmit = () => {
    setShowQR(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Network Name */}
          <div className="space-y-2">
            <label htmlFor="ssid" className="text-sm font-medium">
              Network Name (SSID)
            </label>
            <Input
              id="ssid"
              name="ssid"
              value={formData.ssid}
              onChange={handleInputChange}
              placeholder="Enter network name"
            />
          </div>

          {/* Security Type */}
          <div className="space-y-2">
            <label htmlFor="encryption" className="text-sm font-medium">
              Security Type
            </label>
            <Select
              value={formData.encryption}
              onValueChange={handleEncryptionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select security type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password Field */}
          {formData.encryption !== 'nopass' && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter network password"
              />
            </div>
          )}

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && formData.ssid && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={{
                  ssid: formData.ssid,
                  encryption: formData.encryption,
                  password: formData.password
                }}
                type="wifi"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WiFiQRForm;