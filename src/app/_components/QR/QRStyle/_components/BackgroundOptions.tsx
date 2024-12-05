import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { QRConfig, GradientType } from "../types/qrTypes";
import { useState } from "react";

interface BackgroundOptionsProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
}

export const BackgroundOptions = ({
  config,
  onConfigChange,
}: BackgroundOptionsProps) => {
  const [colorType, setColorType] = useState<"single" | "gradient">(
    config.backgroundOptions.gradient ? "gradient" : "single"
  );
  const [gradientType, setGradientType] = useState<GradientType>(
    config.backgroundOptions.gradient?.type || "linear"
  );

  const handleBackgroundOptionsChange = (updates: Partial<typeof config.backgroundOptions>) => {
    onConfigChange({
      backgroundOptions: {
        ...config.backgroundOptions,
        ...updates
      }
    });
  };

  const handleColorTypeChange = (value: "single" | "gradient") => {
    setColorType(value);
    if (value === "single") {
      // Remove gradient when switching to single color
      const { gradient, ...rest } = config.backgroundOptions;
      handleBackgroundOptionsChange(rest);
    } else {
      // Add default gradient when switching to gradient
      handleBackgroundOptionsChange({
        gradient: {
          type: gradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: config.backgroundOptions.color },
            { offset: 1, color: "#ffffff" }
          ]
        }
      });
    }
  };

  const handleGradientTypeChange = (value: GradientType) => {
    setGradientType(value);
    if (config.backgroundOptions.gradient) {
      handleBackgroundOptionsChange({
        gradient: {
          ...config.backgroundOptions.gradient,
          type: value
        }
      });
    }
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!config.backgroundOptions.gradient) return;
    
    const newColorStops = [...config.backgroundOptions.gradient.colorStops];
    newColorStops[index] = { ...newColorStops[index], color };

    handleBackgroundOptionsChange({
      gradient: {
        ...config.backgroundOptions.gradient,
        colorStops: newColorStops
      }
    });
  };

  const handleClearColor = () => {
    if (colorType === "single") {
      handleBackgroundOptionsChange({ color: '#ffffff' });
    } else {
      handleBackgroundOptionsChange({
        gradient: {
          ...config.backgroundOptions.gradient!,
          colorStops: [
            { offset: 0, color: '#ffffff' },
            { offset: 1, color: '#ffffff' }
          ]
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Color Type</Label>
        <RadioGroup
          value={colorType}
          onValueChange={handleColorTypeChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="background-single" />
            <Label htmlFor="background-single">Single color</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradient" id="background-gradient" />
            <Label htmlFor="background-gradient">Color gradient</Label>
          </div>
        </RadioGroup>
      </div>

      {colorType === "single" ? (
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={config.backgroundOptions.color}
              onChange={(e) => handleBackgroundOptionsChange({ color: e.target.value })}
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
                <RadioGroupItem value="linear" id="background-linear" />
                <Label htmlFor="background-linear">Linear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="radial" id="background-radial" />
                <Label htmlFor="background-radial">Radial</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Start Color</Label>
            <Input
              type="color"
              value={config.backgroundOptions.gradient?.colorStops[0].color}
              onChange={(e) => handleGradientColorChange(0, e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Color</Label>
            <Input
              type="color"
              value={config.backgroundOptions.gradient?.colorStops[1].color}
              onChange={(e) => handleGradientColorChange(1, e.target.value)}
            />
          </div>

          {gradientType === "linear" && (
            <div className="space-y-2">
              <Label>Rotation (degrees)</Label>
              <Input
                type="number"
                value={config.backgroundOptions.gradient?.rotation || 0}
                onChange={(e) => handleBackgroundOptionsChange({
                  gradient: {
                    ...config.backgroundOptions.gradient!,
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