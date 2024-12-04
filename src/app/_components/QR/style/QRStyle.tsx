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

type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerSquareType = 'square' | 'extra-rounded' | 'dot';
type CornerDotType = 'square' | 'dot';
type GradientType = 'linear' | 'radial';

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

const DEFAULT_CONFIG: QRConfig = {
  width: 300,
  height: 300,
  margin: 0,
  data: "https://qr-code-styling.com",
  dotsOptions: {
    type: "extra-rounded" as DotType,
    color: "#6b2e6e"
  },
  cornersSquareOptions: {
    type: "extra-rounded" as CornerSquareType,
    color: "#000000"
  },
  cornersDotOptions: {
    type: "dot" as CornerDotType,
    color: "#000000"
  },
  backgroundOptions: {
    color: "#ffffff"
  }
};

export const QRStyle = () => {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [qrCode, setQrCode] = useState<any>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<string>("png");
  const [colorType, setColorType] = useState<"single" | "gradient">("single");

  useEffect(() => {
    const savedConfig = localStorage.getItem('qr-style-config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }

    const qr = new QRCodeStyling(config);
    setQrCode(qr);
    
    if (qrRef.current) {
      qr.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode) {
      qrCode.update(config);
      localStorage.setItem('qr-style-config', JSON.stringify(config));
    }
  }, [config, qrCode]);

  const handleDownload = () => {
    if (qrCode) {
      qrCode.download({
        extension: downloadFormat.toLowerCase()
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
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
                value={config?.data ?? ''}
                onChange={(e) => setConfig(prev => ({ ...prev, data: e.target.value }))}
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
                  onClick={() => setConfig(prev => ({ ...prev, image: undefined }))}
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
                  value={config?.width ?? 0}
                  onChange={(e) => setConfig(prev => ({ ...prev, width: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  type="number"
                  value={config?.height ?? 0}
                  onChange={(e) => setConfig(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  type="number"
                  value={config.margin}
                  onChange={(e) => setConfig(prev => ({ ...prev, margin: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="dots">
            <AccordionTrigger className="bg-muted px-4">Dots Options</AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dots Style</Label>
                  <Select
                        value={config.dotsOptions.type}
                        onValueChange={(value: DotType) => setConfig(prev => ({
                            ...prev,
                            dotsOptions: { ...prev.dotsOptions, type: value }
                        }))}
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

                <div className="space-y-2">
                  <Label>Dots Color</Label>
                  <Input
                    type="color"
                    value={config.dotsOptions.color}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      dotsOptions: { ...prev.dotsOptions, color: e.target.value }
                    }))}
                  />
                </div>
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

          <AccordionItem value="image">
            <AccordionTrigger className="bg-muted px-4">Image Options</AccordionTrigger>
            <AccordionContent className="p-4">
              {/* Image Options Content */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="qr">
            <AccordionTrigger className="bg-muted px-4">QR Options</AccordionTrigger>
            <AccordionContent className="p-4">
              {/* QR Options Content */}
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