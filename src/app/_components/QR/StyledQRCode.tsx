import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCustomizationOptions } from './types/types';

interface StyledQRCodeProps {
  value: string;
  options: QRCustomizationOptions;
  logoSize?: number;
}

const StyledQRCode: React.FC<StyledQRCodeProps> = ({ value, options, logoSize = 0 }) => {
  // Create a ref to hold the QR code SVG element
  const qrRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (qrRef.current) {
      const svg = qrRef.current;
      const paths = svg.querySelectorAll('path');
      const rects = svg.querySelectorAll('rect');

      // Apply styles based on dotStyle
      const elements = [...paths, ...rects];
      elements.forEach((el) => {
        if (el.getAttribute('fill') === options.foregroundColor) {
          switch (options.dotStyle) {
            case 'dots':
              el.setAttribute('rx', '50%');
              el.setAttribute('ry', '50%');
              break;
            case 'rounded':
              el.setAttribute('rx', '25%');
              el.setAttribute('ry', '25%');
              break;
            default:
              el.setAttribute('rx', '0');
              el.setAttribute('ry', '0');
          }
        }
      });
    }
  }, [options.dotStyle, options.foregroundColor]);

  // Prepare image settings only if both logoUrl and logoSize are provided
  const imageSettings = options.logoUrl && logoSize > 0
    ? {
        src: options.logoUrl,
        height: logoSize,
        width: logoSize,
        excavate: true,
      }
    : undefined;

  return (
    <div className="relative inline-block">
      <div
        className={`relative ${options.frameStyle !== 'none' ? 'p-4' : ''}`}
        style={{
          border: options.frameStyle !== 'none' ? `2px solid ${options.foregroundColor}` : 'none',
          borderRadius:
            options.frameStyle === 'circle'
              ? '50%'
              : options.frameStyle === 'square'
              ? '8px'
              : '0',
          background: options.backgroundColor,
        }}
      >
        <QRCodeSVG
          ref={qrRef}
          value={value}
          size={options.size}
          level={options.errorCorrection}
          bgColor={options.backgroundColor}
          fgColor={options.foregroundColor}
          includeMargin={false}
          imageSettings={imageSettings}
        />
      </div>

      {options.frameStyle !== 'none' && options.frameLabel && (
        <div
          className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1 ${
            options.frameStyle === 'circle' ? 'rounded-full' : 'rounded'
          } border-2 text-sm whitespace-nowrap`}
          style={{
            borderColor: options.labelColor,
            color: options.labelColor,
            backgroundColor: options.backgroundColor,
          }}
        >
          {options.frameLabel}
        </div>
      )}
    </div>
  );
};

export default StyledQRCode;
