import React, { useEffect, useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRCodeGeneratorProps, QRCustomizationOptions } from './types/types';
import { formatQRData } from '@/utils/qr-formatter';

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  type = 'text',
  showLogo = true,
  size = 256,
  logoPath = '/fav.webp',
  errorCorrectionLevel = 'H' 
}) => {
  const [qrValue, setQrValue] = useState('');
  const qrRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [customization, setCustomization] = useState<QRCustomizationOptions>({
    size: size,
    errorCorrection: errorCorrectionLevel,
    dotStyle: 'square',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logoUrl: showLogo ? logoPath : '',
    frameStyle: 'none',
    frameLabel: '',
    labelColor: '#000000'
  });

  useEffect(() => {
    const formattedValue = formatQRData(data, type);
    setQrValue(formattedValue);
  }, [data, type]);

  useEffect(() => {
    if (!qrValue) return;

    // Get stored configuration if exists
    const storedConfig = localStorage.getItem('qr-style-config');
    let styleConfig = {};
    
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
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

    // Create new QR code instance
    qrRef.current = new QRCodeStyling({
      width: customization.size,
      height: customization.size,
      data: qrValue,
      margin: 10,
      ...styleConfig,
      image: customization.logoUrl || undefined,
      imageOptions: customization.logoUrl ? {
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 5,
      } : undefined,
    });

    // Clear and append to container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qrRef.current.append(containerRef.current);
    }
  }, [qrValue, customization.size, customization.logoUrl]);

  // Update QR code when customization changes
  useEffect(() => {
    if (!qrRef.current) return;

    qrRef.current.update({
      width: customization.size,
      height: customization.size,
      data: qrValue,
      image: customization.logoUrl || undefined,
      imageOptions: customization.logoUrl ? {
        hideBackgroundDots: true,
        imageSize: 0.2,
        margin: 5,
      } : undefined,
    });
  }, [customization, qrValue]);

  if (!qrValue) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block mb-16">
        <div ref={containerRef} className="qr-code-container" />
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
    </div>
  );
};

export default QRCodeGenerator;