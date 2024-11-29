import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import QRCodeGenerator from '../QRCodeGenerator';

const TextQRForm = () => {
  const [text, setText] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    //setShowQR(false);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      setShowQR(true);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Text Content */}
          <div className="space-y-2">
            <label htmlFor="textContent" className="text-sm font-medium">
              Text Content
            </label>
            <Textarea
              id="textContent"
              value={text}
              onChange={handleInputChange}
              placeholder="Enter your text here..."
              rows={6}
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
          {showQR && text.trim() && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={text}
                type="text"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextQRForm;