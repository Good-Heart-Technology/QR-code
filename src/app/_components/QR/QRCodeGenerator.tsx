import React, { useEffect, useState, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
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
  
  const [customization, setCustomization] = useState<QRCustomizationOptions>({
    size:300,
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

      console.log(qrConfig);
 
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
    </div>
  );
};

export default QRCodeGenerator;