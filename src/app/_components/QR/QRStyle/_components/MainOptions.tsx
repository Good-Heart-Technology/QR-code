import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QRConfig } from "../types/qrTypes";

interface MainOptionsProps {
  config: QRConfig;
  onConfigChange: (updates: Partial<QRConfig>) => void;
}

export const MainOptions = ({ config, onConfigChange }: MainOptionsProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onConfigChange({ image: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Main Options</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Data</Label>
          <Input
            value={config.data}
            onChange={(e) => onConfigChange({ data: e.target.value })}
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
              onClick={() => onConfigChange({ image: undefined })}
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
              onChange={(e) => onConfigChange({ width: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              type="number"
              value={config.height}
              onChange={(e) => onConfigChange({ height: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Margin</Label>
            <Input
              type="number"
              value={config.margin}
              onChange={(e) => onConfigChange({ margin: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};