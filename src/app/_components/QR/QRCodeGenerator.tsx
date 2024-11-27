import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

type QRDataTypes = 'url' | 'vcard' | 'calendar' | 'wifi' | 'location' | 'phone' | 'email' | 'text';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface QRCodeGeneratorProps {
  data: any;
  type?: QRDataTypes;
  showLogo?: boolean;
  size?: number;
  logoPath?: string;
  errorCorrectionLevel?: ErrorCorrectionLevel;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  type = 'text',
  showLogo = true,
  size = 256,
  logoPath = '/fav.webp',
  errorCorrectionLevel = 'H' 
}) => {
  const [qrLogoSize, setQrLogoSize] = useState(0);
  const [qrValue, setQrValue] = useState('');

  // Calculate logo size
  useEffect(() => {
    const logoSize = Math.floor(size * 0.2); // Logo takes up 20% of QR code
    setQrLogoSize(logoSize);
  }, [size]);

  // Format data based on type
  useEffect(() => {
    switch (type) {
      case 'url':
        setQrValue(data);
        break;
      case 'vcard':
        // Format: MECARD:N:Last,First;TEL:1234567890;EMAIL:email@example.com;ADR:Street,City,State,ZIP;NOTE:Note;;
        const vcard = `MECARD:N:${data.lastName},${data.firstName};` +
                     `${data.tel ? `TEL:${data.tel};` : ''}` +
                     `${data.email ? `EMAIL:${data.email};` : ''}` +
                     `${data.address ? `ADR:${data.address};` : ''}` +
                     `${data.note ? `NOTE:${data.note};` : ''};`;
        setQrValue(vcard);
        break;
      case 'calendar':
        // Format: BEGIN:VEVENT\nSUMMARY:Event\nDTSTART:20240101T100000Z\nDTEND:20240101T110000Z\nEND:VEVENT
        const event = `BEGIN:VEVENT\n` +
                     `SUMMARY:${data.summary}\n` +
                     `DTSTART:${data.startDate}\n` +
                     `DTEND:${data.endDate}\n` +
                     `${data.location ? `LOCATION:${data.location}\n` : ''}` +
                     `${data.description ? `DESCRIPTION:${data.description}\n` : ''}` +
                     `END:VEVENT`;
        setQrValue(event);
        break;
      case 'wifi':
        // Format: WIFI:T:WPA;S:NetworkName;P:Password;;
        const wifi = `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
        setQrValue(wifi);
        break;
      case 'location':
        // Format: geo:latitude,longitude
        const location = `geo:${data.latitude},${data.longitude}`;
        setQrValue(location);
        break;
      case 'phone':
        // Format: tel:+1234567890
        const phone = `tel:${data.number}`;
        setQrValue(phone);
        break;
      case 'email':
        // Format: mailto:email@example.com?subject=Subject&body=Body
        const email = `mailto:${data.address}` +
                     `${data.subject ? `?subject=${encodeURIComponent(data.subject)}` : ''}` +
                     `${data.body ? `&body=${encodeURIComponent(data.body)}` : ''}`;
        setQrValue(email);
        break;
      case 'text':
        setQrValue(data.toString());
        break;
      default:
        setQrValue(data.toString());
    }
  }, [data, type]);

  if (!qrValue) return null;

  return (
    <div className="flex justify-center">
      <div className="relative inline-block">
        <QRCodeSVG
          value={qrValue}
          size={size}
          level={errorCorrectionLevel}
          includeMargin={true}
          {...(showLogo && {
            imageSettings: {
              src: logoPath,
              height: qrLogoSize,
              width: qrLogoSize,
              excavate: true,
            }
          })}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;