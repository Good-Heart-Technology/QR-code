import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QRConfig, CornerDotType, GradientType } from "../types/qrTypes";
import { useState } from "react";

interface CornersDotOptionsProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
}

export const CornersDotOptions = ({
  config,
  onConfigChange,
}: CornersDotOptionsProps) => {
  const [colorType, setColorType] = useState<"single" | "gradient">(
    config.cornersDotOptions.gradient ? "gradient" : "single"
  );
  const [gradientType, setGradientType] = useState<GradientType>(
    config.cornersDotOptions.gradient?.type || "linear"
  );

  const handleCornersDotOptionsChange = (updates: Partial<typeof config.cornersDotOptions>) => {
    onConfigChange({
      cornersDotOptions: {
        ...config.cornersDotOptions,
        ...updates
      }
    });
  };

  const handleColorTypeChange = (value: "single" | "gradient") => {
    setColorType(value);
    
    if (value === "single") {
      handleCornersDotOptionsChange({
        type: config.cornersDotOptions.type || 'dot',
        color: config.cornersDotOptions.gradient?.colorStops[0].color || '#000000',
        gradient: undefined
      });
    } else {
      const currentColor = config.cornersDotOptions.color || '#000000';
      handleCornersDotOptionsChange({
        type: config.cornersDotOptions.type || 'dot',
        gradient: {
          type: gradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: currentColor },
            { offset: 1, color: currentColor }
          ]
        }
      });
    }
  };

  const handleGradientTypeChange = (value: GradientType) => {
    setGradientType(value);
    if (config.cornersDotOptions.gradient) {
      handleCornersDotOptionsChange({
        gradient: {
          ...config.cornersDotOptions.gradient,
          type: value
        }
      });
    }
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!config.cornersDotOptions.gradient) return;
    
    const newColorStops = [...config.cornersDotOptions.gradient.colorStops];
    newColorStops[index] = { ...newColorStops[index], color };

    handleCornersDotOptionsChange({
      gradient: {
        ...config.cornersDotOptions.gradient,
        colorStops: newColorStops
      }
    });
  };

  const handleClearColor = () => {
    if (colorType === "single") {
      handleCornersDotOptionsChange({ color: '#000000' });
    } else {
      handleCornersDotOptionsChange({
        gradient: {
          ...config.cornersDotOptions.gradient!,
          colorStops: [
            { offset: 0, color: '#000000' },
            { offset: 1, color: '#000000' }
          ]
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Corners Dot Style</Label>
        <Select
          value={config.cornersDotOptions.type}
          onValueChange={(value: CornerDotType) => handleCornersDotOptionsChange({ type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['none', 'square', 'dot'] as CornerDotType[]).map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color Type</Label>
        <RadioGroup
          value={colorType}
          onValueChange={handleColorTypeChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="corners-dot-single" />
            <Label htmlFor="corners-dot-single">Single color</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradient" id="corners-dot-gradient" />
            <Label htmlFor="corners-dot-gradient">Color gradient</Label>
          </div>
        </RadioGroup>
      </div>

      {colorType === "single" ? (
        <div className="space-y-2">
          <Label>Corners Dot Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={config.cornersDotOptions.color}
              onChange={(e) => handleCornersDotOptionsChange({ color: e.target.value })}
              className="w-full"
            />
            <Button 
              variant="secondary" 
              onClick={handleClearColor}
              className="whitespace-nowrap"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gradient Type</Label>
            <RadioGroup
              value={gradientType}
              onValueChange={handleGradientTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="linear" id="corners-dot-linear" />
                <Label htmlFor="corners-dot-linear">Linear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="radial" id="corners-dot-radial" />
                <Label htmlFor="corners-dot-radial">Radial</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Start Color</Label>
            <Input
              type="color"
              value={config.cornersDotOptions.gradient?.colorStops[0].color}
              onChange={(e) => handleGradientColorChange(0, e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Color</Label>
            <Input
              type="color"
              value={config.cornersDotOptions.gradient?.colorStops[1].color}
              onChange={(e) => handleGradientColorChange(1, e.target.value)}
            />
          </div>

          {gradientType === "linear" && (
            <div className="space-y-2">
              <Label>Rotation (degrees)</Label>
              <Input
                type="number"
                value={config.cornersDotOptions.gradient?.rotation || 0}
                onChange={(e) => handleCornersDotOptionsChange({
                  gradient: {
                    ...config.cornersDotOptions.gradient!,
                    rotation: Number(e.target.value)
                  }
                })}
                min={0}
                max={360}
              />
            </div>
          )}

          <Button 
            variant="secondary" 
            onClick={handleClearColor}
            className="whitespace-nowrap"
          >
            Clear Colors
          </Button>
        </div>
      )}
    </div>
  );
};