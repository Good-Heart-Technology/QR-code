import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

const URLQRForm = () => {
  const [url, setUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = () => {
    setShowQR(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Input
              type="url"
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={url}
                type="url"
              />
            </div>
          )}

          {/* URL Preview */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link className="w-4" />
              <span className="truncate">{url}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default URLQRForm;