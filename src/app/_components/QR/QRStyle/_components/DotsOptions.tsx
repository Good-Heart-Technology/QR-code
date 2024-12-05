import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRConfig, DotType, GradientType } from "../types/qrTypes";

type DotsOptionsType = QRConfig['dotsOptions'];

interface DotsOptionsProps {
  config: QRConfig;
  colorType: "single" | "gradient";
  gradientType: GradientType;
  onDotsOptionsChange: (updates: Partial<DotsOptionsType>) => void;
  onColorTypeChange: (value: "single" | "gradient") => void;
  onGradientTypeChange: (value: GradientType) => void;
  onGradientColorChange: (index: number, color: string) => void;
}

export const DotsOptions = ({
  config,
  colorType,
  gradientType,
  onDotsOptionsChange,
  onColorTypeChange,
  onGradientTypeChange,
  onGradientColorChange
}: DotsOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Dots Style</Label>
        <Select
          value={config.dotsOptions.type}
          onValueChange={(value: DotType) => onDotsOptionsChange({ type: value })}
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
          onValueChange={onColorTypeChange}
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
            onChange={(e) => onDotsOptionsChange({ color: e.target.value })}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gradient Type</Label>
            <RadioGroup
              value={gradientType}
              onValueChange={onGradientTypeChange}
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
              onChange={(e) => onGradientColorChange(0, e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Color</Label>
            <Input
              type="color"
              value={config.dotsOptions.gradient?.colorStops[1].color}
              onChange={(e) => onGradientColorChange(1, e.target.value)}
            />
          </div>

          {gradientType === "linear" && (
            <div className="space-y-2">
              <Label>Rotation (degrees)</Label>
              <Input
                type="number"
                value={config.dotsOptions.gradient?.rotation || 0}
                onChange={(e) => onDotsOptionsChange({
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
  );
};