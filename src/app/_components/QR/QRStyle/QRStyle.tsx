'use client'

import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainOptions } from './_components/MainOptions';
import { DotsOptions } from './_components/DotsOptions';
import { CornersSquareOptions } from './_components/CornersSquareOptions';
import { CornersDotOptions } from './_components/CornersDotOptions';
import { BackgroundOptions } from './_components/BackgroundOptions';
import { QRConfig, GradientType } from './types/qrTypes';
import { STORAGE_KEYS, DEFAULT_CONFIG } from '../../../../utils/constants/qr-constant';
import { loadFromStorage, saveToStorage, exportConfigAsJson } from '../../../../utils/qr-utils';

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
            colorStops: config.dotsOptions.gradient?.colorStops || DEFAULT_CONFIG.dotsOptions.gradient?.colorStops
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
    setConfig(prev => ({ ...prev, ...updates }));
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <MainOptions 
          config={config}
          onConfigChange={handleConfigChange}
        />

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
              <DotsOptions
                config={config}
                colorType={colorType}
                gradientType={gradientType}
                onDotsOptionsChange={handleDotsOptionsChange}
                onColorTypeChange={setColorType}
                onGradientTypeChange={setGradientType}
                onGradientColorChange={handleGradientColorChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="corners-square">
            <AccordionTrigger className="bg-muted px-4">Corners Square Options</AccordionTrigger>
            <AccordionContent className="p-4">
              <CornersSquareOptions
                config={config}
                onConfigChange={handleConfigChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="corners-dot">
            <AccordionTrigger className="bg-muted px-4">Corners Dot Options</AccordionTrigger>
            <AccordionContent className="p-4">
              <CornersDotOptions
                config={config}
                onConfigChange={handleConfigChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="background">
            <AccordionTrigger className="bg-muted px-4">Background Options</AccordionTrigger>
            <AccordionContent className="p-4">
              <BackgroundOptions
                config={config}
                onConfigChange={handleConfigChange}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card className="p-4">
          <Button onClick={() => exportConfigAsJson(config)}>
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