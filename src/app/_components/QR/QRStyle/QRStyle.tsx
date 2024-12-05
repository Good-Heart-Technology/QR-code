'use client'

import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

// Type definitions
type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerSquareType = 'square' | 'extra-rounded' | 'dot';
type CornerDotType = 'square' | 'dot';
type GradientType = 'linear' | 'radial';

// Storage keys
const STORAGE_KEYS = {
  CONFIG: 'qr-style-config',
  COLOR_TYPE: 'qr-color-type',
  GRADIENT_TYPE: 'qr-gradient-type',
  DOWNLOAD_FORMAT: 'qr-download-format',
  ACCORDION_STATE: 'qr-accordion-state'
};

// Interface definitions
interface QRConfig {
  width: number;
  height: number;
  margin: number;
  data: string;
  image?: string;
  dotsOptions: {
    type: DotType;
    color: string;
    gradient?: {
      type: GradientType;
      rotation: number;
      colorStops: Array<{ offset: number; color: string }>;
    };
  };
  cornersSquareOptions: {
    type: CornerSquareType;
    color: string;
  };
  cornersDotOptions: {
    type: CornerDotType;
    color: string;
  };
  backgroundOptions: {
    color: string;
  };
}

// Default configurations
const DEFAULT_GRADIENT = {
  type: 'linear' as GradientType,
  rotation: 0,
  colorStops: [
    { offset: 0, color: '#FF8C00' },
    { offset: 1, color: '#90EE90' }
  ]
};

const DEFAULT_CONFIG: QRConfig = {
  width: 300,
  height: 300,
  margin: 0,
  data: "https://qr-code-styling.com",
  dotsOptions: {
    type: "extra-rounded",
    color: "#6b2e6e",
    gradient: DEFAULT_GRADIENT
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#000000"
  },
  cornersDotOptions: {
    type: "dot",
    color: "#000000"
  },
  backgroundOptions: {
    color: "#ffffff"
  }
};

// Helper functions
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const QRStyle = () => {
  // State initialization with localStorage
  const [config, setConfig] = useState<QRConfig>(() => 
    loadFromStorage(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG)
  );
  const [qrCode, setQrCode] = useState<any>(null);
  const [downloadFormat, setDownloadFormat] = useState<string>(() => 
    loadFromStorage(STORAGE_KEYS.DOWNLOAD_FORMAT, 'png')
  );
  const [colorType, setColorType] = useState<"single" | "gradient">(() => 
    loadFromStorage(STORAGE_KEYS.COLOR_TYPE, "gradient")
  );
  const [gradientType, setGradientType] = useState<GradientType>(() => 
    loadFromStorage(STORAGE_KEYS.GRADIENT_TYPE, "radial")
  );
  const [activeAccordion, setActiveAccordion] = useState<string>(() => 
    loadFromStorage(STORAGE_KEYS.ACCORDION_STATE, "")
  );

  const qrRef = useRef<HTMLDivElement>(null);

  // Initialize QR code on mount
  useEffect(() => {
    const qr = new QRCodeStyling(config);
    setQrCode(qr);
    
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qr.append(qrRef.current);
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update QR code when configuration changes
  useEffect(() => {
    if (qrCode) {
      const updatedConfig = {
        ...config,
        dotsOptions: {
          ...config.dotsOptions,
          gradient: colorType === "gradient" ? {
            type: gradientType,
            rotation: config.dotsOptions.gradient?.rotation || 0,
            colorStops: config.dotsOptions.gradient?.colorStops || DEFAULT_GRADIENT.colorStops
          } : undefined
        }
      };
      
      qrCode.update(updatedConfig);
      saveToStorage(STORAGE_KEYS.CONFIG, updatedConfig);
    }
  }, [config, colorType, gradientType]);

  // Save state changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COLOR_TYPE, colorType);
    saveToStorage(STORAGE_KEYS.GRADIENT_TYPE, gradientType);
    saveToStorage(STORAGE_KEYS.DOWNLOAD_FORMAT, downloadFormat);
    saveToStorage(STORAGE_KEYS.ACCORDION_STATE, activeAccordion);
  }, [colorType, gradientType, downloadFormat, activeAccordion]);

  const handleConfigChange = (updates: Partial<QRConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    saveToStorage(STORAGE_KEYS.CONFIG, newConfig);
  };

  const handleDotsOptionsChange = (updates: Partial<typeof config.dotsOptions>) => {
    handleConfigChange({
      dotsOptions: { ...config.dotsOptions, ...updates }
    });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!config.dotsOptions.gradient) return;
    
    const newColorStops = config.dotsOptions.gradient.colorStops.map((stop, i) => 
      i === index ? { ...stop, color } : stop
    );

    handleDotsOptionsChange({
      gradient: {
        ...config.dotsOptions.gradient,
        colorStops: newColorStops
      }
    });
  };

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({
        extension: downloadFormat.toLowerCase()
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      handleConfigChange({ image: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const exportConfig = () => {
    const configStr = JSON.stringify(config, null, 2);
    const blob = new Blob([configStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Main Options</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                value={config.data}
                onChange={(e) => handleConfigChange({ data: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image File</Label>
              <Input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {config.image && (
                <Button 
                  variant="outline"
                  onClick={() => handleConfigChange({ image: undefined })}
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Width</Label>
                <Input
                  type="number"
                  value={config.width}
                  onChange={(e) => handleConfigChange({ width: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  value={config.height}
                  onChange={(e) => handleConfigChange({ height: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  type="number"
                  value={config.margin}
                  onChange={(e) => handleConfigChange({ margin: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </Card>

        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={activeAccordion}
          onValueChange={setActiveAccordion}
        >
          <AccordionItem value="dots">
            <AccordionTrigger className="bg-muted px-4">Dots Options</AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dots Style</Label>
                  <Select
                    value={config.dotsOptions.type}
                    onValueChange={(value: DotType) => handleDotsOptionsChange({ type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'] as DotType[]).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Type</Label>
                  <RadioGroup
                    value={colorType}
                    onValueChange={(value: "single" | "gradient") => setColorType(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <Label htmlFor="single">Single color</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gradient" id="gradient" />
                      <Label htmlFor="gradient">Color gradient</Label>
                    </div>
                  </RadioGroup>
                </div>

                {colorType === "single" ? (
                  <div className="space-y-2">
                    <Label>Dots Color</Label>
                    <Input
                      type="color"
                      value={config.dotsOptions.color}
                      onChange={(e) => handleDotsOptionsChange({ color: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Gradient Type</Label>
                      <RadioGroup
                        value={gradientType}
                        onValueChange={(value: GradientType) => setGradientType(value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="linear" id="linear" />
                          <Label htmlFor="linear">Linear</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="radial" id="radial" />
                          <Label htmlFor="radial">Radial</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Start Color</Label>
                      <Input
                        type="color"
                        value={config.dotsOptions.gradient?.colorStops[0].color}
                        onChange={(e) => handleGradientColorChange(0, e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Color</Label>
                      <Input
                        type="color"
                        value={config.dotsOptions.gradient?.colorStops[1].color}
                        onChange={(e) => handleGradientColorChange(1, e.target.value)}
                      />
                    </div>

                    {gradientType === "linear" && (
                      <div className="space-y-2">
                        <Label>Rotation (degrees)</Label>
                        <Input
                          type="number"
                          value={config.dotsOptions.gradient?.rotation || 0}
                          onChange={(e) => handleDotsOptionsChange({
                            gradient: {
                              ...config.dotsOptions.gradient!,
                              rotation: Number(e.target.value)
                            }
                          })}
                          min={0}
                          max={360}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="corners-square">
            <AccordionTrigger className="bg-muted px-4">Corners Square Options</AccordionTrigger>
            <AccordionContent className="p-4">
              {/* Corners Square Options Content */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="corners-dot">
            <AccordionTrigger className="bg-muted px-4">Corners Dot Options</AccordionTrigger>
            <AccordionContent className="p-4">
              {/* Corners Dot Options Content */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="background">
            <AccordionTrigger className="bg-muted px-4">Background Options</AccordionTrigger>
            <AccordionContent className="p-4">
              {/* Background Options Content */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card className="p-4">
          <Button 
            onClick={() => {
              const configStr = JSON.stringify(config, null, 2);
              const blob = new Blob([configStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'qr-config.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export Options as JSON
          </Button>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <div ref={qrRef} className="flex justify-center" />
          <div className="mt-4 flex justify-end space-x-2">
            <Select
              value={downloadFormat}
              onValueChange={setDownloadFormat}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleDownload}>Download</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QRStyle;