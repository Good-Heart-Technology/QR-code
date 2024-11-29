// components/qr/QRCodeGenerator.tsx
import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeGeneratorProps, QRCustomizationOptions } from './types/types';
import { formatQRData } from '@/utils/qr-formatter';
import QRCustomizeModal from './QRCustomizeModal';

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  type = 'text',
  showLogo = true,
  size = 256,
  logoPath = '/fav.webp',
  errorCorrectionLevel = 'H' 
}) => {
  const [qrValue, setQrValue] = useState('');
  const [baseConfig] = useState({
    size,
    logoUrl: showLogo ? logoPath : '',
    errorCorrectionLevel,
  });
  
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

  const handleCustomizationChange = (key: keyof QRCustomizationOptions, value: QRCustomizationOptions[keyof QRCustomizationOptions]) => {
    setCustomization((prev: QRCustomizationOptions) => ({
      ...prev,
      [key]: value
    }));
  };

  if (!qrValue) return null;

  const logoSize = Math.floor(customization.size * 0.2);

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block mb-16">
        <QRCodeSVG
          value={qrValue}
          size={customization.size}
          level={customization.errorCorrection}
          bgColor={customization.backgroundColor}
          fgColor={customization.foregroundColor}
          includeMargin={true}
          {...(customization.logoUrl && {
            imageSettings: {
              src: customization.logoUrl,
              height: logoSize,
              width: logoSize,
              excavate: true,
            }
          })}
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
      
      <div className="mt-4">
        <QRCustomizeModal
          options={customization}
          onOptionsChange={handleCustomizationChange}
          qrValue={qrValue}
          baseConfig={baseConfig}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;