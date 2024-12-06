import React, { useEffect, useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download } from 'lucide-react';
import { QRCodeGeneratorProps, QRCustomizationOptions } from './types/types';
import { formatQRData } from '@/utils/qr-formatter';

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  type = 'text',
  showLogo = false,
  size = 256,
  logoPath = '',
  errorCorrectionLevel = 'H' 
}) => {
  const [qrValue, setQrValue] = useState<string>('');
  const qrRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [downloadHeightSize, setDownloadHeightSize] = useState(size);
  const [downloadWidthSize, setDownloadWidthSize] = useState(size);
  const [downloadFormat, setDownloadFormat] = useState<'svg' | 'png' | 'jpeg' | 'webp'>('png');
  
  const [customization, setCustomization] = useState<QRCustomizationOptions>({
    size: 300,
    errorCorrection: errorCorrectionLevel,
    dotStyle: 'square',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logoUrl: showLogo ? logoPath : '',
    frameStyle: 'none',
    frameLabel: '',
    labelColor: '#000000'
  });

  // Update customization when props change
  useEffect(() => {
    setCustomization(prev => ({
      ...prev,
      size,
      errorCorrection: errorCorrectionLevel,
      logoUrl: showLogo ? logoPath : ''
    }));
  }, [size, errorCorrectionLevel, showLogo, logoPath]);

  // Format QR data when data or type changes
  useEffect(() => {
    try {
      const formattedValue = formatQRData(data, type);
      setQrValue(formattedValue);
    } catch (error) {
      console.error('Error formatting QR data:', error);
      setQrValue('');
    }
  }, [data, type]);

  // Initialize QR code instance
  useEffect(() => {
    if (!qrValue) return;
 
    try {
      // Get stored configuration if exists
      const storedConfig = localStorage.getItem('qr-style-config');
      let styleConfig = {};
      let errorLevel = 'H';
      
      if (storedConfig) {
        try {
          const parsedConfig = JSON.parse(storedConfig);
          errorLevel = parsedConfig.errorCorrectionLevel || 'H';
          styleConfig = {
            dotsOptions: parsedConfig.dotsOptions,
            cornersSquareOptions: parsedConfig.cornersSquareOptions,
            cornersDotOptions: parsedConfig.cornersDotOptions,
            backgroundOptions: parsedConfig.backgroundOptions,
          };
        } catch (error) {
          console.error('Error parsing QR config:', error);
        }
      }
 
      // Create QR code configuration
      const qrConfig: any = {
        width: customization.size,
        height: customization.size,
        data: qrValue,
        margin: 10,
        errorCorrectionLevel: errorLevel,
        ...styleConfig,
      };
      
      // Add image configuration only if logo is present
      if (customization.logoUrl) {
        qrConfig.image = customization.logoUrl;
        qrConfig.imageOptions = {
          hideBackgroundDots: true,
          imageSize: 0.2,
          margin: 5,
        };
      }
 
      // Create new QR code instance
      qrRef.current = new QRCodeStyling(qrConfig);
 
      // Clear and append to container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrRef.current.append(containerRef.current);
      }
    } catch (error) {
      console.error('Error initializing QR code:', error);
    }
  }, [qrValue, customization.size, customization.logoUrl]);

  // Update QR code when customization changes
  useEffect(() => {
    if (!qrRef.current || !qrValue) return;

    try {
      const updateConfig: any = {
        width: customization.size,
        height: customization.size,
        data: qrValue,
      };

      // Add image configuration only if logo is present
      if (customization.logoUrl) {
        updateConfig.image = customization.logoUrl;
        updateConfig.imageOptions = {
          hideBackgroundDots: true,
          imageSize: 0.2,
          margin: 5,
        };
      }

      qrRef.current.update(updateConfig);
    } catch (error) {
      console.error('Error updating QR code:', error);
    }
  }, [customization, qrValue]);

  // Cleanup QR instance on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    
    try {
      const extension = downloadFormat === 'jpeg' ? 'jpg' : downloadFormat;
      const filename = `qr-code.${extension}`;
      
      // Update QR size for download
      await qrRef.current.update({
        width: downloadWidthSize,
        height: downloadHeightSize
      });
      
      // Download the file
      await qrRef.current.download({
        name: filename,
        extension: downloadFormat
      });
      
      // Reset QR size to original
      await qrRef.current.update({
        width: customization.size,
        height: customization.size
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  if (!qrValue) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block mb-16">
        <div 
          ref={containerRef} 
          className="qr-code-container"
          data-testid="qr-code-container"
        />
        {customization.frameStyle !== 'none' && customization.frameLabel && (
          <div
            className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-1
              ${customization.frameStyle === 'circle' ? 'rounded-full' : 'rounded'}
              border-2`}
            style={{
              borderColor: customization.labelColor,
              color: customization.labelColor,
              backgroundColor: customization.backgroundColor
            }}
          >
            {customization.frameLabel}
          </div>
        )}
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download QR Code</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="size" className="text-right">
                Height Size (px)
              </label>
              <Input
                id="size"
                type="number"
                value={downloadHeightSize}
                onChange={(e) => setDownloadHeightSize(Number(e.target.value))}
                min={128}
                max={2048}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="size" className="text-right">
                Width Size (px)
              </label>
              <Input
                id="size"
                type="number"
                value={downloadWidthSize}
                onChange={(e) => setDownloadWidthSize(Number(e.target.value))}
                min={128}
                max={2048}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="format" className="text-right">
                Format
              </label>
              <Select
                value={downloadFormat}
                onValueChange={(value: 'svg' | 'png' | 'jpeg' | 'webp') => setDownloadFormat(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleDownload}>
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeGenerator;