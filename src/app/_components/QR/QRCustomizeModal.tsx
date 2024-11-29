// components/qr/QRCustomizeModal.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCustomizationOptions } from './types/types';
import { QRCodeSVG } from 'qrcode.react';

interface QRCustomizeModalProps {
  options: QRCustomizationOptions;
  onOptionsChange: (key: keyof QRCustomizationOptions, value: any) => void;
  qrValue: string;
  baseConfig: {
    size: number;
    logoUrl?: string;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
}

const QRCustomizeModal: React.FC<QRCustomizeModalProps> = ({
  options,
  onOptionsChange,
  qrValue,
  baseConfig,
}) => {
  const logoSize = Math.floor(options.size * 0.2); // Use options.size instead of baseConfig.size

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Settings size={16} />
          Customize QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Customize QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-8">
          {/* Original QR Code Preview */}
          <div className="w-64 flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Original</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <QRCodeSVG
                value={qrValue}
                size={baseConfig.size}
                level={baseConfig.errorCorrectionLevel}
                includeMargin={true}
                {...(baseConfig.logoUrl && {
                  imageSettings: {
                    src: baseConfig.logoUrl,
                    height: Math.floor(baseConfig.size * 0.2),
                    width: Math.floor(baseConfig.size * 0.2),
                    excavate: true,
                  }
                })}
              />
            </div>
          </div>

          {/* Customized QR Code Preview */}
          <div className="w-64 flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Customized</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="relative">
                <QRCodeSVG
                  value={qrValue}
                  size={options.size}
                  level={options.errorCorrection}
                  bgColor={options.backgroundColor}
                  fgColor={options.foregroundColor}
                  includeMargin={true}
                  {...(options.logoUrl && {
                    imageSettings: {
                      src: options.logoUrl,
                      height: logoSize,
                      width: logoSize,
                      excavate: true,
                    }
                  })}
                />
                {options.frameStyle !== 'none' && options.frameLabel && (
                  <div
                    className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-1
                      ${options.frameStyle === 'circle' ? 'rounded-full' : 'rounded'}
                      border-2`}
                    style={{
                      borderColor: options.labelColor,
                      color: options.labelColor,
                      backgroundColor: options.backgroundColor
                    }}
                  >
                    {options.frameLabel}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Select 
                  value={options.size.toString()} 
                  onValueChange={(val) => onOptionsChange('size', parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="200">Small (200px)</SelectItem>
                    <SelectItem value="256">Medium (256px)</SelectItem>
                    <SelectItem value="400">Large (400px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Error Correction</Label>
                <Select 
                  value={options.errorCorrection}
                  onValueChange={(val) => onOptionsChange('errorCorrection', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select error correction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dot Style</Label>
                <Select 
                  value={options.dotStyle}
                  onValueChange={(val) => onOptionsChange('dotStyle', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dot style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frame Style</Label>
                <Select 
                  value={options.frameStyle}
                  onValueChange={(val) => onOptionsChange('frameStyle', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frame style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input 
                  type="text"
                  value={options.logoUrl}
                  onChange={(e) => onOptionsChange('logoUrl', e.target.value)}
                  placeholder="Enter logo URL"
                />
              </div>

              <div className="space-y-2">
                <Label>Frame Label</Label>
                <Input 
                  type="text"
                  value={options.frameLabel}
                  onChange={(e) => onOptionsChange('frameLabel', e.target.value)}
                  placeholder="Enter frame label"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Colors</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Foreground</Label>
                    <Input 
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) => onOptionsChange('foregroundColor', e.target.value)}
                      className="h-10 w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Background</Label>
                    <Input 
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => onOptionsChange('backgroundColor', e.target.value)}
                      className="h-10 w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input 
                      type="color"
                      value={options.labelColor}
                      onChange={(e) => onOptionsChange('labelColor', e.target.value)}
                      className="h-10 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCustomizeModal;