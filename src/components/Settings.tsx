
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

type SettingsProps = {
  speakEnabled: boolean;
  onSpeakEnabledChange: (value: boolean) => void;
  fontSize: number;
  onFontSizeChange: (value: number) => void;
  highContrast: boolean;
  onHighContrastChange: (value: boolean) => void;
};

const Settings: React.FC<SettingsProps> = ({
  speakEnabled,
  onSpeakEnabledChange,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange
}) => {
  return (
    <div className="border-2 border-mathPurple rounded-lg p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Accessibility Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="speak" className="text-lg">
            Text-to-Speech
          </label>
          <Switch 
            id="speak"
            checked={speakEnabled}
            onCheckedChange={onSpeakEnabledChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="font-size" className="text-lg">
              Symbol Size: {fontSize}
            </label>
          </div>
          <Slider 
            id="font-size"
            min={16} 
            max={32} 
            step={2}
            value={[fontSize]} 
            onValueChange={(value) => onFontSizeChange(value[0])}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label htmlFor="contrast" className="text-lg">
            High Contrast
          </label>
          <Switch 
            id="contrast"
            checked={highContrast}
            onCheckedChange={onHighContrastChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
