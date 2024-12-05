import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QRConfig, CornerSquareType, GradientType } from "../types/qrTypes";
import { useState } from "react";

interface CornersSquareOptionsProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
}

export const CornersSquareOptions = ({
  config,
  onConfigChange,
}: CornersSquareOptionsProps) => {
  const [colorType, setColorType] = useState<"single" | "gradient">(
    config.cornersSquareOptions.gradient ? "gradient" : "single"
  );
  const [gradientType, setGradientType] = useState<GradientType>(
    config.cornersSquareOptions.gradient?.type || "linear"
  );

  const handleCornersSquareOptionsChange = (updates: Partial<typeof config.cornersSquareOptions>) => {
    onConfigChange({
      cornersSquareOptions: {
        ...config.cornersSquareOptions,
        ...updates
      }
    });
  };

  const handleColorTypeChange = (value: "single" | "gradient") => {
    setColorType(value);
    if (value === "single") {
      // Remove gradient when switching to single color
      const { gradient, ...rest } = config.cornersSquareOptions;
      handleCornersSquareOptionsChange(rest);
    } else {
      // Add default gradient when switching to gradient
      handleCornersSquareOptionsChange({
        gradient: {
          type: gradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: config.cornersSquareOptions.color },
            { offset: 1, color: "#000000" }
          ]
        }
      });
    }
  };

  const handleGradientTypeChange = (value: GradientType) => {
    setGradientType(value);
    if (config.cornersSquareOptions.gradient) {
      handleCornersSquareOptionsChange({
        gradient: {
          ...config.cornersSquareOptions.gradient,
          type: value
        }
      });
    }
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!config.cornersSquareOptions.gradient) return;
    
    const newColorStops = [...config.cornersSquareOptions.gradient.colorStops];
    newColorStops[index] = { ...newColorStops[index], color };

    handleCornersSquareOptionsChange({
      gradient: {
        ...config.cornersSquareOptions.gradient,
        colorStops: newColorStops
      }
    });
  };

  const handleClearColor = () => {
    if (colorType === "single") {
      handleCornersSquareOptionsChange({ color: '#000000' });
    } else {
      handleCornersSquareOptionsChange({
        gradient: {
          ...config.cornersSquareOptions.gradient!,
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
        <Label>Corners Square Style</Label>
        <Select
          value={config.cornersSquareOptions.type}
          onValueChange={(value: CornerSquareType) => handleCornersSquareOptionsChange({ type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['square', 'dot', 'extra-rounded'] as CornerSquareType[]).map(type => (
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
          onValueChange={handleColorTypeChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="corners-square-single" />
            <Label htmlFor="corners-square-single">Single color</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradient" id="corners-square-gradient" />
            <Label htmlFor="corners-square-gradient">Color gradient</Label>
          </div>
        </RadioGroup>
      </div>

      {colorType === "single" ? (
        <div className="space-y-2">
          <Label>Corners Square Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={config.cornersSquareOptions.color}
              onChange={(e) => handleCornersSquareOptionsChange({ color: e.target.value })}
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
                <RadioGroupItem value="linear" id="corners-square-linear" />
                <Label htmlFor="corners-square-linear">Linear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="radial" id="corners-square-radial" />
                <Label htmlFor="corners-square-radial">Radial</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Start Color</Label>
            <Input
              type="color"
              value={config.cornersSquareOptions.gradient?.colorStops[0].color}
              onChange={(e) => handleGradientColorChange(0, e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Color</Label>
            <Input
              type="color"
              value={config.cornersSquareOptions.gradient?.colorStops[1].color}
              onChange={(e) => handleGradientColorChange(1, e.target.value)}
            />
          </div>

          {gradientType === "linear" && (
            <div className="space-y-2">
              <Label>Rotation (degrees)</Label>
              <Input
                type="number"
                value={config.cornersSquareOptions.gradient?.rotation || 0}
                onChange={(e) => handleCornersSquareOptionsChange({
                  gradient: {
                    ...config.cornersSquareOptions.gradient!,
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